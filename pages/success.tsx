import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { Layout } from '../components/layout'
import { MainWrapper } from '../components/mainWrapper'
import { CashIcon, UserIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import { handlePortalClick } from '../utils/redirects'

const Success: NextPage = () => {
  const [portalState, setPortalState] = useState<'ready' | 'loading' | 'error'>(
    'ready'
  )

  return (
    <Layout title="Success">
      <MainWrapper title="Success">
        Subscription created successfully!
        <p>
          Head back to your account page, or view your subscription details.
        </p>
        <div className="flex flex-col sm:flex-row justify-around items-center gap-7 sm:gap-20 select-none">
          <div className="relative group">
            <div className="absolute inset-0 rounded-full blur bg-gradient-to-tr from-emerald-400 to-indigo-500 opacity-75 transition group-hover:opacity-100 group-hover:scale-105 group-hover:duration-200 duration-1000"></div>
            <Link href="/account">
              <a className="relative block px-5 py-2 rounded-md no-underline bg-slate-800 leading-none text-slate-100 font-semibold">
                <span className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-auto" />
                  <span>Account page</span>
                </span>
              </a>
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 rounded-full blur bg-gradient-to-tr from-emerald-400 to-indigo-500 opacity-75 transition group-hover:opacity-100 group-hover:scale-105 group-hover:duration-200 duration-1000"></div>
            <button
              className="relative block px-5 py-2 rounded-md bg-slate-800 leading-none text-slate-100 font-semibold"
              onClick={() =>
                handlePortalClick((state) => setPortalState(state))
              }
            >
              <span className="flex items-center space-x-2">
                <CashIcon className="h-5 w-auto" />
                <span>Subscription details</span>
              </span>
            </button>
          </div>
        </div>
      </MainWrapper>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const sessionId = query.session_id

  // is there anything we want to show the user about their confirmed session?
  // if not, we can just dump this part probably

  return {
    props: {},
  }
}

export default Success
