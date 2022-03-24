import { NextApiHandler } from "next";
import Stripe from "stripe";
import Cors from 'cors';
import { UserProfile } from "../../types/database";
import { getAdminSupabase } from '../../utils/supabase'
import { runMiddleware } from "../../utils/runMiddleware";

const adminSupabase = getAdminSupabase()

const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
});

const handler: NextApiHandler = async (req, res) => {
  await runMiddleware(req, res, cors);

  const {user} = await adminSupabase.auth.api.getUserByCookie(req)

  if (!user) {
    return res.status(401).send('Unauthorized')
  }

  const { data, error } = await adminSupabase
    .from<UserProfile>('users')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (error) {
    console.log(error)
    return res.status(400).send(error)
  }

  if (!data?.stripe_customer_id) {
    console.log('No stripe customer found')
    return res.status(400).send('User not found')
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2020-08-27',
  })

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: data.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`
  })

  res.send({url: portalSession.url})
}

export default handler
