import axios from 'axios';
import Cors from 'cors';
import { createLogger } from '@logdna/logger';
import { getAdminSupabase } from '../../utils/supabase';
import { NextApiHandler } from 'next';
import { runMiddleware } from '../../utils/runMiddleware';
import { URLSearchParams } from 'url';
import { TweetRecord, TweetRequest, UserProfile } from '../../types/database';
import { Tweet } from '../../types/tweet';
import { withSentry, captureException, addBreadcrumb, Severity } from '@sentry/nextjs';

const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
});

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
  });

  await runMiddleware(req, res, cors);

  const apiKey = req.headers.authorization?.split('Bearer ')?.[1] ?? '';
  if (!apiKey) {
    logger.info?.({
      message: 'Request made without API key'
    });
    return res.status(401).send('Unauthorized');
  }

  logger.info?.({
    message: 'Request in progress',
    apiKey,
  });

  const adminSupabase = getAdminSupabase();

  const { data: user } = await adminSupabase.from<UserProfile>('users').select('id,subscriptions:subscription_id (*)').eq('key', apiKey).single();

  const {data: usage} = await adminSupabase.rpc<number>('monthly_usage', { user_ident: user?.id });

  const used = (Array.isArray(usage) ? usage[0] : usage);
  const limit = user?.subscriptions?.limit ?? 0;

  if (!user) {
    logger.info?.({
      message: 'Request made with invalid API key',
      apiKey,
    });
    return res.status(401).send('Invalid API key');
  }

  if (used === null) {
    return res.status(400).send('Subscription information not found');
  }

  if (used >= limit) {
    return res.status(402).send(`Usage limit has been met: ${used}/${limit}`)
  }

  const tweetId = (Array.isArray(req.query.tweet) ? req.query.tweet[0] : req.query.tweet) ?? '';

  if (!tweetId) {
    logger.info?.({
      message: 'Request made without tweet ID',
      apiKey,
    });
    return res.status(400).send('No tweet ID provided');
  }

  const params = new URLSearchParams({
    expansions: 'author_id,attachments.poll_ids,attachments.media_keys',
    'user.fields': 'name,username,profile_image_url',
    'tweet.fields': 'attachments,public_metrics,entities,conversation_id,referenced_tweets,created_at',
    'media.fields': 'url,alt_text',
    'poll.fields': 'options',
  });

  const twitterUrl = new URL(`https://api.twitter.com/2/tweets/${tweetId}`);
  let tweetRequest;
  logger.info?.({
    message: 'Tweet request being made',
    url: twitterUrl,
  });
  try {
    tweetRequest = await axios.get(`${twitterUrl.href}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request) {
        if (error.response?.data?.status === 401) {
          captureException(error);
          return res.status(500).send('There is a problem with TTM. It is being investigated.');
        }
        const errors = error.response?.data?.errors;
        if (errors?.[0]?.message.includes('The `id` query parameter value')) {
          return res.status(400).send('The tweet Id is invalid.');
        }
        captureException(error);
        return res.status(500).send(errors?.[0]?.message);
      } else {
        captureException(error);
        return res.status(500).send(error.message);
      }
    }
  }

  if (tweetRequest?.status !== 200) {
    return res.status(500).send(tweetRequest?.statusText);
  }

  const tweet: Tweet = tweetRequest?.data;
  if (tweet?.errors) {
    return res.status(400).send(tweet.errors[0].detail);
  }
  if (tweet?.reason) {
    switch (tweet.reason) {
      case 'client-not-enrolled':
      default:
        captureException(tweet);
        return res.status(400).send('There is a problem with TTM. It is being investigated.');
    }
  }

  // send the tweet back to the user
  res.send(tweet);

  logger.info?.({
    message: 'Tweet returned to user, logging tweet in database',
    tweet,
  });
  // save tweet data
  try {
    addBreadcrumb({
      category: 'api',
      data: tweet,
      level: Severity.Info,
      message: `Saving tweet stats for tweet ${tweet.data.id}.`,
    });
    const { data: tweetData, error: tweetError } = await adminSupabase.from<TweetRecord>('tweets').upsert(
      {
        last_retrieved_at: new Date(),
        tweet_id: tweet.data.id,
        author_id: tweet.data.author_id,
        conversation_id: tweet.data.conversation_id
      },
      {
        onConflict: 'tweet_id',
      },
    );
    if (tweetError) {
      captureException(tweetError);
    } else {
      logger.info?.({
        message: 'Tweet saved to database',
        tweetData,
      });
    }
    const source = (Array.isArray(req.query.source) ? req.query.source[0] : req.query.source) || undefined;
    const { data: requestData, error: requestError } = await adminSupabase.from<TweetRequest>('requests').insert({
      tweet_id: tweet.data.id,
      user_id: user.id,
      conversation_id: tweet.data.conversation_id,
      source
    });
    if (requestError) {
      captureException(requestError);
    } else {
      logger.info?.({
        message: 'Request saved to database',
        requestData,
      });
    }
  } catch (error) {
    console.error('There was an issue saving the tweet and record.');
  }
};

export default withSentry(handler);
