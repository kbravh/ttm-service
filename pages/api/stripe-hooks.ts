import { buffer } from 'micro'
import Stripe from 'stripe'
import { NextApiHandler } from 'next'
import { getAdminSupabase } from '../../utils/supabase'
import { Subscription, UserProfile } from '../../types/database'
import { createLogger } from '@logdna/logger'

const customerIdFromWebhook = (event: Stripe.Event): string => {
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const { customer } = event.data.object as Stripe.Subscription
      return typeof customer === 'string' ? customer : customer.id
    default:
      return ''
  }
}

const handler: NextApiHandler = async (req, res) => {
  const logger = createLogger(process.env.LOGDNA_INGESTION_KEY ?? '', {
    tags: ['stripe-webhook-endpoint'],
    app: 'ttm-service',
    env: process.env.NODE_ENV,
    meta: {
      request: { headers: req.rawHeaders, body: req.body },
    },
  })

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2020-08-27',
  })
  const signature = req.headers['stripe-signature'] ?? ''
  const signingSecret = process.env.STRIPE_SIGNING_KEY ?? ''
  const reqBuffer = await buffer(req)

  let event: Stripe.Event | null = null

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret)
  } catch (error) {
    if (error instanceof stripe.errors.StripeSignatureVerificationError) {
      console.log(error.message)
      logger.info?.({
        message: 'An invalid webhook was received',
      })
      return res.status(400).send(`Webhook error: ${error.message}`)
    }
  }

  if (!event) {
    return res.status(400).send(`Did not receive a valid event`)
  }

  const supabase = getAdminSupabase()

  logger.info?.({
    message: 'Stripe webhook event received',
    event,
  })

  const customerId = customerIdFromWebhook(event)

  switch (event.type) {
    case 'customer.subscription.created':
      logger.info?.({
        message: 'Customer subscription created',
        event,
      })
      {
        // fetch the subscription record with the matching stripe price id
        const subscription = event.data.object as Stripe.Subscription
        const subscriptionItem = subscription.items.data[0]
        const priceId = subscriptionItem.price.id
        const { data: subscriptionRecord, error: subscriptionError } =
          await supabase
            .from<Subscription>('subscriptions')
            .select()
            .eq('stripe_price_id', priceId)
            .single()
        if (subscriptionError || !subscriptionRecord) {
          console.log(
            `unable to find a subscription record with the price id ${priceId}.`,
            subscriptionError
          )
          logger.error?.({
            message: `Unable to find a subscription record with the price id ${priceId}.`,
            subscriptionError,
          })
          return res.status(400).send({
            received: true,
            error: 'Unable to find subscription with that price ID',
          })
        }
        // set the user's subscription to this record and store subscription item
        const { data, error } = await supabase
          .from<UserProfile>('users')
          .update({
            subscription_id: subscriptionRecord?.id,
            subscription_item_id: subscriptionItem.id,
          })
          .eq('stripe_customer_id', customerId)
        if (error || !data) {
          console.log(
            `Unable to find a user with stripe customer ID ${customerId}`
          )
          logger.error?.({
            message: `Unable to find a user with stripe customer ID ${customerId}.`,
            stripeCustomerId: customerId
          })
        }
        logger.info?.({
          message:
            'Subscription ID and subscription item ID updated on user record',
          subscription_id: subscriptionRecord?.id,
          subscription_item_id: subscriptionItem.id,
        })
      }
      break
    case 'customer.subscription.updated':
      logger.info?.({
        message: 'Customer subscription updated',
        event,
      })
      break
    case 'customer.subscription.deleted':
      logger.info?.({
        message: 'Customer subscription deleted',
        event,
      })
      {
        const { data, error } = await supabase
          .from<UserProfile>('users')
          .update({
            subscription_id: process.env.NEXT_PUBLIC_FREE_TIER_PLAN_ID,
          })
          .eq('stripe_customer_id', customerId)
        if (error || !data) {
          console.error(`Unable to switch the user ${customerId} to free tier.`)
          logger.error?.({
            message: `Unable to switch the user to free tier.`,
            stripeCustomerId: customerId
          })
        }
        logger.info?.({
          message: 'User assigned to free tier.',
          stripeCustomerId: customerId
        })
      }
      break
    default:
      logger.info?.({
        message: `Event type ${event.type} not handled`,
        event,
      })
      console.log(`Event ${event.id} of type ${event.type} not handled.`)
  }

  return res.send({ received: true })
}

export const config = {
  api: {
    bodyParser: false,
  },
}
export default handler
