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
    return res.status(400).send('Price id not included')
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

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2020-08-27',
  })

  if (!stripe_customer_id) {
    const customer: Stripe.Customer = await stripe.customers.create({
      email: user.email,
    })
    stripe_customer_id = customer.id

    const { data, error } = await adminSupabase
      .from<UserProfile>('users')
      .update({
        stripe_customer_id,
      })
      .eq('id', user.id)
      .single()
  }

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [
      {
        price: priceId,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    automatic_tax: { enabled: true },
    customer: stripe_customer_id,
    customer_update: {
      address: 'auto'
    }
  })

  res.send({ id: session.id })
}

export default handler
