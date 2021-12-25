import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { MainWrapper } from '../components/mainWrapper';
import { useUser } from '../context/user';

const Logout: NextPage = () => {
  const { logout } = useUser();
  useEffect(() => {
    logout();
  });
  return (
    <>
      <MainWrapper title='Logging out...' />
    </>
  );
};

export default Logout;
