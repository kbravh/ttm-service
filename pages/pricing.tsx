import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import { NextPage } from 'next'
import Stripe from 'stripe'
import { Layout } from '../components/layout'
import { MainWrapper } from '../components/mainWrapper'

interface Props {
  plan: {
    id: string
    title: string
    description: string
    tiers: { unit_amount: number; up_to: number }[]
  }
}

const Pricing: NextPage<Props> = ({ plan }) => {
  const handleClick = async () => {
    let subscriptionResponse;
    try {
      subscriptionResponse = await axios('/api/subscribe', {
        method: 'POST',
        data: {
          id: plan.id
        }
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    }

    const {id} = subscriptionResponse?.data as {id: string}
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY ?? '')
    await stripe?.redirectToCheckout({sessionId: id})
  }

  return (
    <Layout title="Pricing">
      <MainWrapper title="Pricing">
        <div>Free</div>
        <div>
          Pay per tweet
          <button onClick={handleClick}>Subscribe</button>
        </div>
        <pre>{JSON.stringify(plan, null, 2)}</pre>
      </MainWrapper>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2020-08-27',
  })

  const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_KEY ?? '')
  const product = await stripe.products.retrieve(price.product.toString())

  const tiers =
    price?.tiers?.map(({ unit_amount, up_to }) => ({
      unit_amount,
      up_to,
    })) ?? []

  return {
    props: {
      plan: {
        id: price.id,
        title: product.name,
        description: product.description,
        tiers,
      },
    },
  }
}

export default Pricing
