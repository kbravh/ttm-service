import { NextApiHandler } from 'next'
import Stripe from 'stripe'
import Cors from 'cors'
import { UserProfile } from '../../types/database'
import { getAdminSupabase } from '../../utils/supabase'
import { runMiddleware } from '../../utils/runMiddleware'
import { createLogger } from '@logdna/logger'
import { withSentry } from '@sentry/nextjs'

const adminSupabase = getAdminSupabase()

const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
})

const handler: NextApiHandler = async (req, res) => {
  const logger = createLogger(process.env.LOGDNA_INGESTION_KEY ?? '', {
    tags: ['stripe-portal'],
    app: 'ttm-service',
    env: process.env.NODE_ENV,
    meta: {
      request: {
        query: req.query,
        headers: req.rawHeaders,
        url: req.url,
      },
    },
  })

  await runMiddleware(req, res, cors)

  const { user } = await adminSupabase.auth.api.getUserByCookie(req)

  if (!user) {
    logger.info?.({
      message: 'Superbase user not found',
    })
    return res.status(401).send('Unauthorized')
  }

  const { data, error } = await adminSupabase
    .from<UserProfile>('users')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (error) {
    logger.error?.({
      message: 'Error while fetching Stripe customer id for current user',
      error,
    })
    return res.status(400).send(error)
  }

  if (!data?.stripe_customer_id) {
    logger.error?.({
      message: 'No Stripe customer ID found for current user',
    })
    return res.status(400).send('User not found')
  }

  logger.info?.({
    message: 'User\'s Stripe ID found',
    customerId: data.stripe_customer_id
  })

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2020-08-27',
  })

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
    })

    return res.send({ url: portalSession.url })
  } catch (error) {
    logger.error?.({
      message: 'Unable to create a portal session for user',
      customerId: data.stripe_customer_id,
      error,
    })
  }
  return res.status(400).send('Unable to create a Stripe session for this user')
}

export default withSentry(handler)
