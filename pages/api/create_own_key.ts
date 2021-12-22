import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { NextApiHandler } from 'next';
import { UserProfile } from '../../types/database';
import { supabase } from '../../utils/supabase';

const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.PRIVATE_SUPABASE_KEY ?? '');

/**
 * This API is called whenever a user wants to generate an API key.
 */
const handler: NextApiHandler = async (req, res): Promise<void> => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const key = 'TTM>' + nanoid(15);

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

export default handler;
