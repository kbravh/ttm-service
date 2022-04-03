import { buffer } from 'micro'
import Stripe from 'stripe'
import { NextApiHandler } from 'next'
import { getAdminSupabase } from '../../utils/supabase'
import { Subscription, UserProfile } from '../../types/database'

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
      return res.status(400).send(`Webhook error: ${error.message}`)
    }
  }

  if (!event) {
    return res.status(400).send(`Did not receive a valid event`)
  }

  const supabase = getAdminSupabase()

  console.log(event)

  const customerId = customerIdFromWebhook(event)

  switch (event.type) {
    case 'customer.subscription.created':
      console.log(
        'Customer subscription created',
        JSON.stringify(event, null, 2)
      )
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
          console.log(`unable to find a subscription record with the price id ${priceId}.`, subscriptionError)
          return res.status(400).send({received: true, error: 'Unable to find subscription with that price ID'})
        }
        // set the user's subscription to this record and store subscription item
        const { data, error } = await supabase
          .from<UserProfile>('users')
          .update({
            subscription_id: subscriptionRecord?.id,
            subscription_item_id: subscriptionItem.id
          }).eq('stripe_customer_id', customerId)
        if (error || !data) {
          console.log(`Unable to find a user with stripe customer ID ${customerId}`)
        }
      }
      break
    case 'customer.subscription.updated':
      console.log(
        'Customer subscription updated',
        JSON.stringify(event, null, 2)
      )
      break
    case 'customer.subscription.deleted':
      console.log(
        'Customer subscription deleted',
        JSON.stringify(event, null, 2)
      )
      {
        const { data, error } = await supabase
          .from<UserProfile>('users')
          .update({
            subscription_id: process.env.FREE_TIER_PLAN_ID,
          })
          .eq('stripe_customer_id', customerId)
          if (error || !data) {
            console.log(`Unable to switch the user ${customerId} to free tier.`)
          }
      }
      break
    default:
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
