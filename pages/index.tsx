import Head from 'next/head';
import type { NextPage } from 'next';
import { useUser } from '../context/user';
import { Header } from '../components/header';
import { Multipass } from '../components/multipass';

const Home: NextPage = () => {
  const { user } = useUser();
  return (
    <>
      <Head>
        <link rel="preload" href="/fonts/Cartridge-Regular.woff2" as="font" crossOrigin="" />
      </Head>
      <Header />

      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md md:max-w-4xl flex flex-col justify-center text-center text-slate-700 text-lg px-4 sm:px-6">
          <h2 className="font-sans font-bold text-6xl text-slate-800">Save tweets as <span className="bg-clip-text text-transparent bg-gradient-to-tr from-emerald-400 to-indigo-500">beautiful</span> Markdown.</h2>
          <p className="my-5">Tweet to Markdown works in Obsidian or as a standalone CLI. Archive knowledge and insights you find on Twitter as you work towards data permanence.</p>
          {user && <Multipass />}
          {!user && (
            <div className='flex flex-col items-center'>
              <p className="mb-5">Sign up for an account to get an API key.</p>
              <button className="flex w-60 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-semibold text-white bg-emerald-400 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-200">
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
