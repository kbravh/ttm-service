/* eslint-disable react/no-unescaped-entities */
import { NextPage } from 'next';
import { Layout } from '../components/layout';
import { MainWrapper } from '../components/mainWrapper';

const PrivacyPolicy: NextPage = () => {
  return (
    <Layout title='Privacy Policy'>
      <MainWrapper title="Privacy Policy">
        <p>Last updated: Dec. 25, 2021</p>
        <main className="mt-5 prose prose-slate prose-headings:font-header">
          <p>Privacy policies should be easy to understand; you won't find any legalese here. This is just a quick explanation of how your data will be used in this service.</p>
          <h2>Personal Information</h2>
          <p>The only personal information I collect is your email address when you sign up. I'll never sell your email address, sign you up for any lists, and probably never use it to contact you at all. It's just a way of identifying you as a unique user.</p>
          <p>
            As you use this service to save tweets, I keep a record of that for rate limiting purposes. I'll also be able to show you some interesting stats about your usage. Your data will never be made public or shown to any other user. If I ever show global
            site stats, the data will be general and anonymized with no way to tie it to you.
          </p>
          <h2>Tracking Scripts and Cookies</h2>
          <p>
            I don't use any tracking scripts, so no need to worry there. The authentication service I'm using (<a href="https://supabase.io">Supabase.io</a>) stores an auth cookie and an auth object in local storage.
          </p>
        </main>
      </MainWrapper>
    </Layout>
  );
};

export default PrivacyPolicy;
