import { GetServerSideProps, NextPage } from 'next';
import { ClientOnly } from '../components/clientOnly';
import { Layout } from '../components/layout';
import { MainWrapper } from '../components/mainWrapper';
import { Multipass } from '../components/multipass';
import { useUser } from '../context/user';
import { UserProfile } from '../types/database';
import { supabase } from '../utils/supabase';

interface Props {
  user: UserProfile | null
}

const Account: NextPage<Props> = ({user}) => {
  ({ user } = useUser());
  return (
    <Layout title='Account'>
      <MainWrapper title="Account">
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
      </MainWrapper>
    </Layout>
  );
};

export default Account;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
      props: {},
    };
  }

  return {
    props: {user},
  };
};
