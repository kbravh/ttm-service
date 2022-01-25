import axios from 'axios';
import Cors from 'cors';
import { getAdminSupabase } from '../../utils/supabase';
import { NextApiHandler } from 'next';
import { runMiddleware } from '../../utils/runMiddleware';
import { URLSearchParams } from 'url';
import { TweetRecord, TweetRequest, UserProfile } from '../../types/database';
import { Tweet } from '../../types/tweet';

const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
});

const handler: NextApiHandler = async (req, res) => {
  await runMiddleware(req, res, cors);
  const apiKey = req.headers.authorization?.split('Bearer ')?.[1] ?? '';
  if (!apiKey) {
    return res.status(401).send('Unauthorized');
  }

  const adminSupabase = getAdminSupabase();

  const { data: user } = await adminSupabase.from<UserProfile>('users').select('id').eq('key', apiKey).single();

  if (!user) {
    return res.status(401).send('Invalid API key');
  }
  const tweetId = req.query.tweet ?? '';
  if (!tweetId) {
    return res.status(400).send('No tweet ID provided');
  }

  let params: URLSearchParams;
  try {
    params = new URLSearchParams({
      expansions: 'author_id,attachments.poll_ids,attachments.media_keys',
      'user.fields': 'name,username,profile_image_url',
      'tweet.fields': 'attachments,public_metrics,entities,conversation_id,referenced_tweets',
      'media.fields': 'url,alt_text',
      'poll.fields': 'options',
    });
  } catch (error) {
    return res.status(400).send('Malformed request');
  }

  const twitterUrl = new URL(`https://api.twitter.com/2/tweets/${tweetId}`);
  let tweetRequest;
  try {
    tweetRequest = await axios.get(`${twitterUrl.href}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request) {
        const response = error.response?.data;
        if (response?.data?.errors?.message.includes("The `id` query parameter value")) {
          return res.status(400).send('The tweet Id is invalid.')
        }
        return res.status(500).send('There seems to be a connection issue on our end.');
      } else {
        console.error(error);
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
        return res.status(400).send("There seems to be a problem with TTM's connection to Twitter.");
    }
  }

  // send the tweet back to the user
  res.send(tweet);

  // save tweet data
  try {
    await adminSupabase.from<TweetRecord>('tweets').upsert(
      {
        last_retrieved_at: new Date(),
        tweet_id: tweet.data.id,
        author_id: tweet.data.author_id,
      },
      {
        onConflict: 'tweet_id',
        returning: 'minimal',
      },
    );
    await adminSupabase.from<TweetRequest>('requests').insert(
      {
        tweet_id: tweet.data.id,
        user_id: user.id,
      },
      {
        returning: 'minimal',
      },
    );
  } catch (error) {
    console.error('There was an issue saving the tweet and record.');
  }
};

export default handler;
