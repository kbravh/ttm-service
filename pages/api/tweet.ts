import axios from 'axios'
import Cors from 'cors'
import { createLogger } from '@logdna/logger'
import { getAdminSupabase } from '../../utils/supabase'
import { NextApiHandler } from 'next'
import { runMiddleware } from '../../utils/runMiddleware'
import { URLSearchParams } from 'url'
import { TweetRecord, TweetRequest, UserProfile } from '../../types/database'
import { Tweet } from '../../types/tweet'
import {
  withSentry,
  captureException,
  addBreadcrumb,
  Severity,
} from '@sentry/nextjs'
import Stripe from 'stripe'

const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
})

const handler: NextApiHandler = async (req, res) => {
  const logger = createLogger(process.env.LOGDNA_INGESTION_KEY ?? '', {
    tags: ['tweet-endpoint'],
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

  const apiKey = req.headers.authorization?.split('Bearer ')?.[1] ?? ''
  if (!apiKey) {
    logger.info?.({
      message: 'Request made without API key',
    })
    return res.status(401).send('Unauthorized')
  }

  logger.info?.({
    message: 'Request in progress',
    apiKey,
  })

  const adminSupabase = getAdminSupabase()

  const { data: user } = await adminSupabase
    .from<UserProfile>('users')
    .select('id,subscription_item_id,subscriptions:subscription_id (*)')
    .eq('key', apiKey)
    .single()

  const { data: used } = await adminSupabase
    .rpc<number>('monthly_usage', { user_ident: user?.id })
    .single()

  const limit = user?.subscriptions?.limit

  if (!user) {
    logger.info?.({
      message: 'Request made with invalid API key',
      apiKey,
    })
    return res.status(401).send('Invalid API key')
  }

  if (used === null) {
    return res.status(400).send('Subscription information not found')
  }

  if (limit !== undefined && limit !== null && used >= limit) {
    return res.status(402).send(`Usage limit has been met: ${used}/${limit}`)
  }

  const tweetId =
    (Array.isArray(req.query.tweet) ? req.query.tweet[0] : req.query.tweet) ??
    ''

  if (!tweetId) {
    logger.info?.({
      message: 'Request made without tweet ID',
      apiKey,
    })
    return res.status(400).send('No tweet ID provided')
  }

  const params = new URLSearchParams({
    expansions: 'author_id,attachments.poll_ids,attachments.media_keys',
    'user.fields': 'name,username,profile_image_url',
    'tweet.fields':
      'attachments,public_metrics,entities,conversation_id,referenced_tweets,created_at',
    'media.fields': 'url,alt_text',
    'poll.fields': 'options',
  })

  const twitterUrl = new URL(`https://api.twitter.com/2/tweets/${tweetId}`)
  let tweetRequest
  logger.info?.({
    message: 'Tweet request being made',
    url: twitterUrl,
  })
  try {
    tweetRequest = await axios.get(`${twitterUrl.href}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request) {
        if (error.response?.data?.status === 401) {
          captureException(error)
          logger.error?.({
            message: 'Authorization issue while contacting Twitter',
            error,
          })
          return res
            .status(500)
            .send('There is a problem with TTM. It is being investigated.')
        }
        const errors = error.response?.data?.errors
        if (errors?.[0]?.message.includes('The `id` query parameter value')) {
          return res.status(400).send('The tweet Id is invalid.')
        }
        captureException(error)
        return res.status(500).send(errors?.[0]?.message)
      } else {
        captureException(error)
        return res.status(500).send(error.message)
      }
    }
  }

  if (tweetRequest?.status !== 200) {
    return res.status(500).send(tweetRequest?.statusText)
  }

  const tweet: Tweet = tweetRequest?.data
  if (tweet?.errors) {
    return res.status(400).send(tweet.errors[0].detail)
  }
  if (tweet?.reason) {
    switch (tweet.reason) {
      case 'client-not-enrolled':
      default:
        logger.error?.({
          message: 'Authorization issue while contacting Twitter',
          tweet
        })
        captureException(tweet)
        return res
          .status(400)
          .send('There is a problem with TTM. It is being investigated.')
    }
  }

  // send the tweet back to the user
  res.send(tweet)

  logger.info?.({
    message: 'Tweet returned to user, logging tweet in database',
    tweet,
  })
  // save tweet data
  try {
    addBreadcrumb({
      category: 'api',
      data: tweet,
      level: Severity.Info,
      message: `Saving tweet stats for tweet ${tweet.data.id}.`,
    })
    const { data: tweetData, error: tweetError } = await adminSupabase
      .from<TweetRecord>('tweets')
      .upsert(
        {
          last_retrieved_at: new Date(),
          tweet_id: tweet.data.id,
          author_id: tweet.data.author_id,
          conversation_id: tweet.data.conversation_id,
        },
        {
          onConflict: 'tweet_id',
        }
      )
    if (tweetError) {
      logger.error?.({
        message: 'Error logging tweet to database',
        error: tweetError
      })
      captureException(tweetError)
    } else {
      logger.info?.({
        message: 'Tweet saved to database',
        tweetData,
      })
    }
    const source =
      (Array.isArray(req.query.source)
        ? req.query.source[0]
        : req.query.source) || undefined
    const { data: requestData, error: requestError } = await adminSupabase
      .from<TweetRequest>('requests')
      .insert({
        tweet_id: tweet.data.id,
        user_id: user.id,
        conversation_id: tweet.data.conversation_id,
        source,
      })
    if (requestError) {
      logger.error?.({
        message: 'Error logging tweet request to database',
        error: requestError
      })
      captureException(requestError)
    } else {
      logger.info?.({
        message: 'Request saved to database',
        requestData,
      })
    }
  } catch (error) {
    logger.error?.({
      message: 'Error logging tweet and request to database',
      error
    })
    console.error('There was an issue saving the tweet and record.')
  }

  if (user.subscription_id !== process.env.NEXT_PUBLIC_FREE_TIER_PLAN_ID) {
    logger.info?.({
      message: 'Reporting usage to Stripe',
    })
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
      apiVersion: '2020-08-27',
    })
    try {
      await stripe.subscriptionItems.createUsageRecord(
        user.subscription_item_id ?? '',
        { quantity: 1 }
      )
      logger.info?.({
        message: 'Usage reported to Stripe.'
      })
    } catch (error) {
      console.error(error)
      logger.error?.({
        message: 'There was an error reporting usage to Stripe.',
        error,
      })
    }
  }
}

export default withSentry(handler)
