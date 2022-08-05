import { nanoid } from 'nanoid';
import { NextApiHandler } from 'next';
import { UserProfile } from '../../types/database';
import { getAdminSupabase } from '../../utils/supabase';
import { withSentry } from '@sentry/nextjs';

const adminSupabase = getAdminSupabase()
/**
 * This API is called whenever a user wants to generate an API key.
 */
const handler: NextApiHandler = async (req, res): Promise<void> => {
  const { user } = await adminSupabase.auth.api.getUserByCookie(req);

  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const key = 'TTM_' + nanoid(15);


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
