import {nanoid} from 'nanoid'
import { NextApiHandler } from "next";
import { supabase } from '../../utils/supabase';
import { User } from '../../types/database';

/**
 * This API is called as a function hook any time a new user record is created.
 */
const handler: NextApiHandler = async (req, res): Promise<void> => {
  // TODO - re-enable once Supabase fixes the HTTP param issue
  // if (req.query.SECRET !== process.env.API_SECRET_KEY) {
  //   return res.status(401).send('You are not authorized to use this API');
  // }

  if (!req.body?.record?.id) {
    return res.status(404).send('This resource must be triggered with a user record')
  }

  const key = 'TTM' + nanoid(15);

  await supabase
    .from<User>('users')
    .update({
      key,
      last_active_at: new Date()
    })
    .eq('id', req.body.record.id)

  res.send({key})
}

export default handler;
