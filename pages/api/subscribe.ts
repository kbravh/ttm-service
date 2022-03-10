import { NextApiHandler } from 'next'
import Stripe from 'stripe'
import { UserProfile } from '../../types/database'
import { getAdminSupabase } from '../../utils/supabase'

const adminSupabase = getAdminSupabase()

const handler: NextApiHandler = async (req, res) => {
  const { user } = await adminSupabase.auth.api.getUserByCookie(req)

  if (!user) {
    return res.status(401).send('Unauthorized')
  }

  const priceId = req.body.id
  if (!priceId) {
    return res.status(400).send('Product id not included')
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

  if (!data) {
    console.log('No user found')
    return res.status(400).send('User not found')
  }

  let { stripe_customer_id } = data

  if (!stripe_customer_id) {
    //create stripe customer
    stripe_customer_id = ''
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
    price: priceId
  }]

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2020-08-27',
  })

  const session = await stripe.checkout.sessions.create({
    customer: stripe_customer_id,
    mode: 'payment',
    line_items: lineItems,
    payment_method_types: ['card'],
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/cancel`,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
  })

  return res.send({
    id: session.id,
  })
}

export default handler
