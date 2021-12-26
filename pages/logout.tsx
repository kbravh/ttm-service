import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { Layout } from '../components/layout';
import { MainWrapper } from '../components/mainWrapper';
import { useUser } from '../context/user';

const Logout: NextPage = () => {
  const { logout } = useUser();
  useEffect(() => {
    logout();
  });
  return (
    <Layout title='Log out'>
      <MainWrapper title='Logging out...' />
    </Layout>
  );
};

export default Logout;
