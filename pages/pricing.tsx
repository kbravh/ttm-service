import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import { NextPage } from 'next'
import Stripe from 'stripe'
import { Layout } from '../components/layout'
import { MainWrapper } from '../components/mainWrapper'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { PriceEstimate } from '../components/priceEstimate'
import { AnimatePresence, motion } from 'framer-motion'
interface Props {
  plan: {
    id: string
    title: string
    description: string
    tiers: { unit_amount: number; up_to: number }[]
  }
}

const Pricing: NextPage<Props> = ({ plan }) => {
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false)
  const handleClick = async () => {
    let subscriptionResponse
    try {
      subscriptionResponse = await axios('/api/subscribe', {
        method: 'POST',
        data: {
          id: plan.id,
        },
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    }

    const { id } = subscriptionResponse?.data as { id: string }
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY ?? '')
    await stripe?.redirectToCheckout({ sessionId: id })
  }

  return (
    <Layout title="Pricing">
      <MainWrapper title="Pricing">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-4">
          <div className="bg-white rounded-lg shadow divide-y divide-gray-200 p-6">
            <div>
              <h3 className="font-header text-3xl text-slate-800">Free tier</h3>
              <div className="text-slate-400 tex-sm">
                The easiest way to get started
              </div>
              <button className="px-5 py-2 rounded-md no-underline bg-slate-800 leading-none text-slate-100 font-semibold my-3">
                Sign up
              </button>
            </div>
            <ul className="pt-2">
              <li>200 tweets a month</li>
              <li>Resets on the first day of the month</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow divide-y divide-gray-200 p-6">
            <div>
              <h3 className="font-header text-3xl text-slate-800">
                Pay per tweet
              </h3>
              <div className="text-slate-400 tex-sm">
                Take it to the next level
              </div>
              <button
                onClick={handleClick}
                className="px-5 py-2 rounded-md no-underline bg-slate-800 leading-none text-slate-100 font-semibold my-3"
              >
                Subscribe
              </button>
            </div>
            <div className="grid grid-cols-2 pt-2">
              <p className="col-span-2 py-3">
                Pay only for the tweets you&apos;ve used each month
              </p>
              <div>0-200 tweets</div>
              <div>
                <span className="font-semibold">$0.000</span> each
              </div>
              <div>201-500 tweets</div>
              <div>
                <span className="font-semibold">$0.005</span> each
              </div>
              <div>501-1000 tweets</div>
              <div>
                <span className="font-semibold">$0.004</span> each
              </div>
              <div>1001+ tweets</div>
              <div>
                <span className="font-semibold">$0.003</span> each
              </div>
              <div className="col-span-2 mt-3 text-sm">
                Check out the{' '}
                <button onClick={() => setIsEstimatorOpen(true)}>
                  <span className="underline decoration-wavy decoration-emerald-400">
                    price estimator
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isEstimatorOpen && (
            <Dialog
              open={isEstimatorOpen}
              onClose={() => setIsEstimatorOpen(false)}
              className="fixed z-10 inset-0 overflow-y-auto"
              static
              as={motion.div}
            >
              <div className="flex items-center justify-center min-h-screen">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                <div className="relative bg-white rounded-md max-w-sm mx-auto p-4 text-center">
                  <Dialog.Title className="font-header text-3xl text-slate-800">
                    Price estimate
                  </Dialog.Title>
                  <Dialog.Description>
                    <p>
                      Here&apos;s an estimate of the cost by number of downloaded tweets.
                    </p>
                  </Dialog.Description>
                  <PriceEstimate />
                  <button
                    onClick={() => setIsEstimatorOpen(false)}
                    className="px-5 py-2 rounded-md no-underline bg-slate-800 leading-none text-slate-100 font-semibold my-3"
                  >
                    Looks good!
                  </button>
                </div>
              </div>
            </Dialog>
          )}
        </AnimatePresence>
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
