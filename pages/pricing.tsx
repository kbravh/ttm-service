import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import { GetServerSideProps, NextPage } from 'next'
import Stripe from 'stripe'
import { Layout } from '../components/layout'
import { MainWrapper } from '../components/mainWrapper'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { PencilAltIcon } from '@heroicons/react/outline'
import { PriceEstimate } from '../components/priceEstimate'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useUser } from '../context/user'
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
  const [isSwitchbackOpen, setIsSwitchbackOpen] = useState(false)
  const [subscribeState, setSubscribeState] = useState<
    'ready' | 'loading' | 'error'
  >('ready')

  const { user, userState } = useUser()

  const handleClick = async () => {
    setSubscribeState('loading')
    let subscriptionResponse
    try {
      subscriptionResponse = await axios('/api/subscribe', {
        method: 'POST',
        data: {
          id: plan.id,
        },
      })
    } catch (error) {
      setSubscribeState('error')
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
        <div className="bg-yellow-400 border-2 border-dashed border-slate-900 text-slate-800 text-center flex flex-col items-center p-10 rounded-sm">
          <h3 className="text-4xl mb-4  ">
            This service has stopped working as of April 27, 2023.
          </h3>
          <p className="text-2xl">
            Twitter has suspended this service due to their recent API changes.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-4">
          <div className="bg-white rounded-lg shadow divide-y divide-gray-200 p-6">
            <div>
              <h3 className="font-header text-3xl text-slate-800">Free tier</h3>
              <div className="text-slate-400 tex-sm">
                The easiest way to get started
              </div>
              {!user && (
                <div className="my-5">
                  <Link href="/login">
                    <a className="px-5 py-2 rounded-md no-underline bg-slate-800 leading-none text-slate-100 font-semibold shadow shadow-slate-800">
                      Sign up
                    </a>
                  </Link>
                </div>
              )}
              {user && userState === 'full' && (
                <AnimatePresence>
                  {user.subscription_id ===
                  process.env.NEXT_PUBLIC_FREE_TIER_PLAN_ID ? (
                    <motion.button
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                      disabled
                      className="px-5 py-2 rounded-md no-underline text-slate-800 leading-none bg-slate-100 font-semibold my-3 shadow shadow-slate-200"
                    >
                      You&apos;re in!
                    </motion.button>
                  ) : (
                    <motion.button
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                      onClick={() => setIsSwitchbackOpen(true)}
                      className="px-5 py-2 rounded-md no-underline bg-slate-800 leading-none text-slate-100 font-semibold my-3 shadow shadow-slate-800"
                    >
                      Switch back?
                    </motion.button>
                  )}
                </AnimatePresence>
              )}
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
              {user && userState === 'full' && (
                <AnimatePresence>
                  {user.subscription_id ===
                  process.env.NEXT_PUBLIC_FREE_TIER_PLAN_ID ? (
                    <motion.button
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                      onClick={handleClick}
                      className="px-5 py-2 rounded-md no-underline bg-slate-800 leading-none text-slate-100 font-semibold my-3 shadow shadow-slate-800"
                    >
                      <span className="flex items-center space-x-2">
                        {subscribeState === 'loading' && (
                          <div className="flex items-center justify-center space-x-2">
                            <div
                              className="spinner-border animate-spin inline-block w-4 h-4 border-1 rounded-full"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          </div>
                        )}
                        {subscribeState === 'ready' && (
                          <PencilAltIcon className="h-5 w-auto" />
                        )}
                        {subscribeState === 'error' && (
                          <PencilAltIcon className="h-5 w-auto" />
                        )}
                        <span>Subscribe</span>
                      </span>
                    </motion.button>
                  ) : (
                    <motion.button
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                      disabled
                      className="px-5 py-2 rounded-md no-underline text-slate-800 leading-none bg-slate-100 font-semibold my-3 shadow shadow-slate-200"
                    >
                      You&apos;re in!
                    </motion.button>
                  )}
                </AnimatePresence>
              )}
              {!user && (
                <div className="my-5">
                  <Link href="/login?redirect=pricing" scroll={false}>
                    <a className="px-5 py-2 rounded-md no-underline bg-slate-800 leading-none text-slate-100 font-semibold shadow shadow-slate-800">
                      Sign up to subscribe
                    </a>
                  </Link>
                </div>
              )}
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
                  <span className="font-semibold hover:underline hover:decoration-wavy hover:decoration-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 rounded-full">
                    price estimator
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <>
          {isEstimatorOpen && (
            <Dialog
              open={isEstimatorOpen}
              onClose={() => setIsEstimatorOpen(false)}
              className="fixed z-10 inset-0 overflow-y-auto"
              static
            >
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              <div className="flex items-center justify-center min-h-screen">
                <AnimatePresence>
                  <Dialog.Panel
                    className="relative bg-white rounded-md max-w-sm mx-auto p-4 text-center"
                    as={motion.div}
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                  >
                    <Dialog.Title className="font-header text-3xl text-slate-800">
                      Price estimate
                    </Dialog.Title>
                    <Dialog.Description>
                      <p>
                        Here&apos;s an estimate of the cost by number of
                        downloaded tweets.
                      </p>
                    </Dialog.Description>
                    <PriceEstimate />
                    <button
                      onClick={() => setIsEstimatorOpen(false)}
                      className="px-5 py-2 rounded-md no-underline bg-slate-800 leading-none text-slate-100 font-semibold my-3"
                    >
                      Looks good!
                    </button>
                  </Dialog.Panel>
                </AnimatePresence>
              </div>
            </Dialog>
          )}
        </>

        <>
          {isSwitchbackOpen && (
            <Dialog
              open={isSwitchbackOpen}
              onClose={() => setIsSwitchbackOpen(false)}
              className="fixed z-10 inset-0 overflow-y-auto"
              static
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              <div className="flex items-center justify-center min-h-screen">
                <AnimatePresence>
                  <Dialog.Panel
                    className="relative bg-white rounded-md max-w-sm mx-auto p-4 text-center"
                    as={motion.div}
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                  >
                    <Dialog.Title className="font-header text-3xl text-slate-800">
                      Switch to free tier
                    </Dialog.Title>
                    <Dialog.Description>
                      If you&apos;d like to switch back to free tier and cancel
                      your subscription, please visit your account page and
                      click &quot;Manage my subscription&quot;.
                    </Dialog.Description>
                    <Link href="/account">
                      <a className="block px-5 py-2 mx-6 rounded-md no-underline bg-slate-800 leading-none text-slate-100 font-semibold my-3">
                        My account
                      </a>
                    </Link>
                  </Dialog.Panel>
                </AnimatePresence>
              </div>
            </Dialog>
          )}
        </>
      </MainWrapper>
    </Layout>
  )
}

export default Pricing
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
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
