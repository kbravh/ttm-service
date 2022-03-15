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

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2020-08-27',
  })

  try {
    const subscription = await stripe.subscriptions.create({
      customer: stripe_customer_id,
      items: [{
        price: priceId,
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    })

    let latestInvoice = subscription?.latest_invoice;
    if (!latestInvoice){
      throw new Error('Latest invoice not found')
    }

    if (typeof latestInvoice === 'string') {
      latestInvoice = await stripe.invoices.retrieve(latestInvoice)
    }

    let paymentIntent = latestInvoice.payment_intent;
    if (!paymentIntent) {
      throw new Error('Payment intent not found')
    }

    if (typeof paymentIntent === 'string') {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntent)
    }

    res.send({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).send({ error: { message: error.message } });
    }
  }
}

export default handler
