import { createClient } from '@supabase/supabase-js';
import { NextApiHandler } from 'next';
import { UserProfile } from '../../types/database';

const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.PRIVATE_SUPABASE_KEY ?? '');

/**
 * This API is called as a function hook any time a new user record is created.
 */
const handler: NextApiHandler = async (req, res): Promise<void> => {
  if (req.query.SECRET !== process.env.API_SECRET_KEY) {
    return res.status(401).send('You are not authorized to use this API');
  }

  if (!req.body.user) {
    return res.status(400).send("You must include the user's ID");
  }

  const subscriptionRequest = adminSupabase.from<UserProfile>('users').select('subscriptions:subscription_id (*)').eq('id', req.body.user).single();

  const usageRequest = adminSupabase.rpc<number>('monthly_usage', { user_ident: req.body.user });

  const [{ data: user }, { data: count }] = await Promise.all([subscriptionRequest, usageRequest]);

  console.log();

  res.send({
    limit: user?.subscriptions?.limit,
    usage: count,
  });
};

export default handler;
