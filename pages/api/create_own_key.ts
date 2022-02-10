import { nanoid } from 'nanoid';
import { NextApiHandler } from 'next';
import { UserProfile } from '../../types/database';
import { getAdminSupabase, supabase } from '../../utils/supabase';
import { withSentry } from '@sentry/nextjs';

/**
 * This API is called whenever a user wants to generate an API key.
 */
const handler: NextApiHandler = async (req, res): Promise<void> => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const key = 'TTM>' + nanoid(15);

  const adminSupabase = getAdminSupabase()

  const { data: updatedUser } = await adminSupabase
    .from<UserProfile>('users')
    .update({
      key,
      last_active_at: new Date(),
    })
    .eq('id', user.id).single();

  res.send({
    ...user,
    ...updatedUser,
  });
};

export default withSentry(handler);
