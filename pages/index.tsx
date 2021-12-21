import Head from 'next/head';
import type { NextPage } from 'next';
import { useUser } from '../context/user';
import { Header } from '../components/header';
import { Multipass } from '../components/multipass';
import Image from 'next/image';

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
            <p className="my-5">Tweet to Markdown helps you archive the knowledge and insights you find on Twitter. Build up your personal knowledge base and avoid losing information in the ephemeral internet.</p>

            <p>To get started, download the Obsidian plugin or the CLI app. </p>

            <div className="flex justify-around items-center gap-20">
              <div className="relative group">
                <div className="absolute inset-0 rounded-full blur bg-gradient-to-tr from-emerald-400 to-indigo-500 opacity-75 transition group-hover:opacity-100 group-hover:scale-105 group-hover:duration-200 duration-1000"></div>
                <a href="https://github.com/kbravh/tweet-to-markdown" className='relative block rounded-full h-[80px]'>
                  <Image src="/cli-ttm-logo.png" width={80} height={80} alt="The Tweet to Markdown CLI logo" className="rounded-full" />
                </a>
              </div>
              <a href="https://github.com/kbravh/obsidian-tweet-to-markdown">
                <Image src="/obsidian-ttm-logo.png" width={80} height={80} alt="The Tweet to Markdown Obsidian plugin logo" />
              </a>
            </div>

            <p>Then, sign up to get a free API key.</p>
            {user && <Multipass />}
            {!user && (
              <div className="flex flex-col items-center">
                <button className="flex w-60 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-semibold text-slate-100 bg-emerald-400 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-200">
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
