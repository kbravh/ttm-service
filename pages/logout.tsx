import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { useUser } from '../context/user';

const Logout: NextPage = () => {
  const { logout } = useUser();
  useEffect(() => {
    logout();
  });
  return (
    <>
      <Head>
        <title>Logging out... | Tweet to Markdown</title>
      </Head>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md md:max-w-4xl flex flex-col items-center text-center text-slate-700 text-lg px-4 sm:px-6">
          <h2 className="font-header text-4xl text-slate-800">Logging out...</h2>
        </div>
      </div>
    </>
  );
};

export default Logout;
