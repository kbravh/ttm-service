import { withSentry } from '@sentry/nextjs';
import { createClient } from '@supabase/supabase-js';
import { createLogger } from '@logdna/logger';
import { NextApiHandler } from 'next';
import { UserProfile } from '../../types/database';

const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.PRIVATE_SUPABASE_KEY ?? '');

const handler: NextApiHandler = async (req, res): Promise<void> => {
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
  });

  let userId = '';

  const { user: actingUser } = await adminSupabase.auth.api.getUserByCookie(req);

  //if a user isn't making the request, check for admin key
  if (actingUser?.id) {
    userId = actingUser.id;
  } else {
    if (req.query.SECRET !== process.env.API_SECRET_KEY) {
      logger.info?.({
        message: 'Request made without cookie or API key.'
      })
      return res.status(401).send('You are not authorized to use this API');
    }
    if (!req.body.user) {
      logger.info?.({
        message: 'Admin request made without user id in body.'
      })
      return res.status(400).send("You must include the user's ID");
    }
    userId = req.body.user;
  }

  const subscriptionRequest = adminSupabase.from<UserProfile>('users').select('subscriptions:subscription_id (*)').eq('id', userId).single();

  const usageRequest = adminSupabase.rpc<number>('monthly_usage', { user_ident: userId });

  const [{ data: user }, { data: used }] = await Promise.all([subscriptionRequest, usageRequest]);

  logger.info?.({
    message: 'Usage request completed.',
    userId
  })

  res.send({
    limit: user?.subscriptions?.limit,
    used,
  });
};

export default withSentry(handler);
