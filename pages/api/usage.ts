import { createLogger } from '@logdna/logger'
import { getAdminSupabase } from '../../utils/supabase'
import { NextApiHandler } from 'next'
import Stripe from 'stripe'
import { UserProfile } from '../../types/database'
import { UsageResponse } from '../../types/stripe'
import { withSentry } from '@sentry/nextjs'

const adminSupabase = getAdminSupabase()

const handler: NextApiHandler = async (req, res) => {
  const logger = createLogger(process.env.LOGDNA_INGESTION_KEY ?? '', {
    tags: ['usage-endpoint'],
    app: 'ttm-service',
    env: process.env.NODE_ENV,
    meta: {
      request: {
        headers: req.rawHeaders,
        cookies: req.cookies,
        url: req.url,
        body: req.body,
        query: req.query,
      },
    },
  })

  const { user } = await adminSupabase.auth.api.getUserByCookie(req)

  if (!user) {
    logger.info?.({
      message: 'Request not made by an active user',
    })
    return res.status(401).send('Unauthorized')
  }

  const { data, error } = await adminSupabase
    .from<UserProfile>('users')
    .select('subscription_item_id')
    .eq('id', user.id)
    .single()

  if (error) {
    logger.error?.({
      message: "An error occurred while fetching the user",
      error,
    })
    return res.status(400).send(error)
  }

  if (!data) {
    logger.warn?.({message: 'No user found'})
    return res.status(400).send('User not found')
  }

  const { subscription_item_id } = data

  if (!subscription_item_id) {
    logger.warn?.({message: 'User did not have a Stripe subscription item'})
    return res.status(400).send('User is not subscribed via Stripe')
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2020-08-27',
  })

  const subscriptionPeriods =
    await stripe.subscriptionItems.listUsageRecordSummaries(
      subscription_item_id,
      {
        limit: 1, // we only need the latest period, the one in progress
      }
    )

  const currentPeriod = subscriptionPeriods.data[0]

  const subscriptionItem = await stripe.subscriptionItems.retrieve(
    subscription_item_id
  )
  const subscription = await stripe.subscriptions.retrieve(
    subscriptionItem.subscription
  )

  logger.info?.({
    message: 'User\'s Stripe subscription information found',
    currentPeriod,
    subscription
  })

  const usage: UsageResponse = {
    count: currentPeriod.total_usage,
    startDate: subscription.current_period_start * 1000, //timestamp is in seconds
    endDate: subscription.current_period_end * 1000, // timestamp is in seconds
  }

  return res.status(200).send(usage)
}

export default withSentry(handler)
