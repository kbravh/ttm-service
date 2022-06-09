import { NextApiHandler } from 'next'
import Stripe from 'stripe'
import { UserProfile } from '../../types/database'
import { UsageResponse } from '../../types/stripe'
import { getAdminSupabase } from '../../utils/supabase'

const adminSupabase = getAdminSupabase()

const handler: NextApiHandler = async (req, res) => {
  const { user } = await adminSupabase.auth.api.getUserByCookie(req)

  if (!user) {
    return res.status(401).send('Unauthorized')
  }

  const { data, error } = await adminSupabase
    .from<UserProfile>('users')
    .select('subscription_item_id')
    .eq('id', user.id)
    .single()

  if (error) {
    console.log(error)
    return res.status(400).send(error)
  }

  if (!data) {
    console.log('No user found')
    return res.status(400).send('User not found')
  }

  const { subscription_item_id } = data

  if (!subscription_item_id) {
    console.log('User did not have a Stripe subscription item')
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

  const usage: UsageResponse = {
    count: currentPeriod.total_usage,
    startDate: subscription.current_period_start * 1000, //timestamp is in seconds
    endDate: subscription.current_period_end * 1000, // timestamp is in seconds
  }

  return res.status(200).send(usage)
}

export default handler
