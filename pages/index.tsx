import Head from 'next/head'
import type { NextPage } from 'next'
import { useUser } from '../context/user'
import Link from 'next/link'
import { AppLinks } from '../components/appLinks'
import { Layout } from '../components/layout'
import { supabase } from '../utils/supabase'
import { UserProfile } from '../types/database'
import { ObsidianLink } from '../components/obsidianLink'

interface Props {
  user: UserProfile | null
}

// const Home: NextPage<Props> = ({ user }) => {
const Home: NextPage<Props> = () => {
  // ;({ user } = useUser())

  return (
    <Layout>
      <Head>
        <title>Tweet to Markdown</title>
        <link
          rel="preload"
          href="/fonts/Cartridge-Regular.woff2"
          as="font"
          crossOrigin=""
        />
      </Head>

      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md md:max-w-4xl flex flex-col items-center text-center text-slate-700 text-lg px-4 sm:px-6">
          <h2 className="font-header text-6xl text-slate-800">
            {/* {user && (
              <>
                You&#39;re ready to save tweets as{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-tr from-emerald-400 to-indigo-500">
                  beautiful
                </span>{' '}
                Markdown.
              </>
            )}
            {!user && (
              <>
                Save tweets as{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-tr from-emerald-400 to-indigo-500">
                  beautiful
                </span>{' '}
                Markdown.
              </>
            )} */}
            <div className="bg-yellow-400 border-2 border-dashed border-slate-900 text-slate-800 text-center flex flex-col items-center -rotate-3 p-10 rounded-sm">
              <h3 className="text-4xl mb-4  ">
                This service has stopped working as of April 27, 2023.
              </h3>
              <p className="text-2xl">
                Twitter has suspended this service due to their recent API
                changes.
              </p>
            </div>
          </h2>
          <div className="w-full flex flex-col items-center prose prose-slate">
            <>
              <p className="my-5">
                Tweet to Markdown helps you archive the knowledge and insights
                you find on Twitter. Build up your personal knowledge base and
                avoid losing information in the ephemeral internet.
              </p>

              {/* {user && (
                <>
                  <span className="my-5 block">
                    To get started, download the <ObsidianLink /> plugin or the
                    CLI app.{' '}
                  </span>
                  <AppLinks />

                  <p>Then, head to your account page for your API key.</p>
                  <div className="flex flex-col items-center">
                    <Link href="/account" scroll={false}>
                      <a className="flex w-60 justify-center py-2 px-4 select-none no-underline border border-transparent rounded-md shadow-sm text-md font-semibold text-slate-100 bg-gradient-to-tr from-emerald-400 to-indigo-500 hover:scale-105 transition duration-100 transform-gpu focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300">
                        My account
                      </a>
                    </Link>
                  </div>
                </>
              )} */}
            </>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home

// export const getServerSideProps = async ({ req }: { req: Request }) => {
//   const { user } = await supabase.auth.api.getUserByCookie(req)

//   if (user) {
//     return {
//       props: { user },
//     }
//   }

//   return {
//     props: {},
//   }
// }
