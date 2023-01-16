import { NextPage } from 'next'
import { useUser } from '../context/user'
import { useRouter } from 'next/router'
import { MainWrapper } from '../components/mainWrapper'
import { Layout } from '../components/layout'
import { supabase } from '../utils/supabase'
import { SyntheticEvent, useState } from 'react'
import { CogIcon } from '@heroicons/react/outline'

const Email: NextPage = () => {
  const { user } = useUser()
  const router = useRouter()
  const [state, setState] = useState<'ready' | 'loading' | 'sent'>('ready')
  const [email, setEmail] = useState('')

  const isValidEmail = (value: string): boolean =>
    /^(\w+(\.{0,1}|\-{0,1}))+[\w]+@([a-zA-Z]+\.){1,2}[a-zA-Z]{2,}$/.test(value)

  if (user) {
    router.push('/')
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    setState('loading')
    const { user, session, error } = await supabase.auth.signIn(
      {
        email,
      },
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      }
    )
    console.log(user, session, error)
    setState('sent')
  }

  return (
    <Layout title="Login with Email">
      <MainWrapper title="Log in" header="You&#39;re almost ready!">
        <div className="min-h-full flex flex-col justify-center sm:px-6 lg:px-8">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            {state === 'ready' && (
              <>
                <div className="mt-6">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex flex-col items-start">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          id="email"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={!isValidEmail(email)}
                      className="relative block px-5 py-2 rounded-md no-underline bg-slate-800 disabled:bg-slate-400 hover:bg-slate-700 leading-none text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 hover:bg-gradient-to-tr from-emerald-400 to-indigo-500"
                    >
                      Get magic link
                    </button>
                  </form>
                </div>
              </>
            )}
            {state === 'loading' && (
              <div className="mt-6 flex flex-col items-center justify-center">
                <CogIcon className="h-20 text-slate-800 animate-gear" />
              </div>
            )}
            {state === 'sent' && <h2>Please check your inbox!</h2>}
          </div>
        </div>
      </MainWrapper>
    </Layout>
  )
}

export default Email

export const getServerSideProps = async ({ req }: { req: Request }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req)

  if (user) {
    return {
      redirect: {
        permanent: false,
        destination: '/account',
      },
      props: { user },
    }
  }

  return {
    props: {},
  }
}
