import Head from 'next/head';
import Image from 'next/image';
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
        <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col justify-center">
          <div className="flex gap-8 align-middle justify-center">
            <a href="https://github.com/kbravh/tweet-to-markdown" className="hover:translate-y-2 transition-all ease-out">
              <Image src="/ttm-logo.png" className="rounded-full" width={100} height={100} alt="Tweet to Markdown logo" />
            </a>
            <a href="https://github.com/kbravh/obsidian-tweet-to-markdown" className="hover:translate-y-2 transition-all ease-out">
              <Image src="/obsidian-ttm-logo.png" width={100} height={100} alt="Obsidian Tweet to Markdown logo" />
            </a>
          </div>
          {user && <Multipass />}
          {!user && (
            <div className="text-center text-lg">
              <p>Sign up for an account to get an API key.</p>
              <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
