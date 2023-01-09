import { NextApiHandler } from "next";
import { supabase } from "../../utils/supabase";

const handler: NextApiHandler = (req, res) => {
  supabase.auth.api.setAuthCookie(req, res)
}

export default handler
