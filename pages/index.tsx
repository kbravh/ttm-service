import Head from 'next/head';
import type { NextPage } from 'next';
import { useUser } from '../context/user';
import { Header } from '../components/header';
import { Multipass } from '../components/multipass';
import Link from 'next/link';
import { AppLinks } from '../components/appLinks';

const Home: NextPage = () => {
  const { user } = useUser();
  return (
    <>
      <Head>
        <link rel="preload" href="/fonts/Cartridge-Regular.woff2" as="font" crossOrigin="" />
      </Head>
      <Header />

      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md md:max-w-4xl flex flex-col items-center text-center text-slate-700 text-lg px-4 sm:px-6">
          <h2 className="font-header text-6xl text-slate-800">
            Save tweets as <span className="bg-clip-text text-transparent bg-gradient-to-tr from-emerald-400 to-indigo-500">beautiful</span> Markdown.
          </h2>
          <div className="w-full flex flex-col items-center prose prose-slate">
            {user && (
              <>
                <p className="my-5">Please find your API information below.</p>
                <Multipass />
              </>
            )}
            {!user && (
              <>
                <p className="my-5">Tweet to Markdown helps you archive the knowledge and insights you find on Twitter. Build up your personal knowledge base and avoid losing information in the ephemeral internet.</p>

                <p>To get started, download the Obsidian plugin or the CLI app. </p>

                <AppLinks />

                <p>Then, sign up to get a free API key.</p>

                <div className="flex flex-col items-center">
                  <Link href="/signup">
                    <a className="flex w-60 justify-center py-2 px-4 select-none no-underline border border-transparent rounded-md shadow-sm text-md font-semibold text-slate-200 bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300">
                      Sign up
                    </a>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
