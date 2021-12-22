import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ClientOnly } from '../components/clientOnly';
import { Header } from '../components/header';
import { Multipass } from '../components/multipass';
import { useUser } from '../context/user';

const Account: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);
  return (
    <>
      <Header />
      <Head>
        <title>Account | Tweet to Markdown</title>
        <link rel="preload" href="/fonts/Cartridge-Regular.woff2" as="font" crossOrigin="" />
      </Head>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md md:max-w-4xl flex flex-col items-center text-center text-slate-700 text-lg px-4 sm:px-6">
          <h2 className="font-header text-6xl text-slate-800">Account</h2>
          <ClientOnly>
            {user && (
              <div className="w-full flex flex-col items-center prose prose-slate">
                <>
                  <p className="mt-5 mb-2">Please find your API information below.</p>
                  <Multipass />
                </>
              </div>
            )}
          </ClientOnly>
        </div>
      </div>
    </>
  );
};

export default Account;
