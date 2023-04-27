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
          <div className="bg-yellow-400 border-2 border-dashed border-slate-900 text-slate-800 text-center flex flex-col gap-2 items-center p-6 rounded-sm">
            <h3 className="text-4xl mb-4  mt-0">
              This service has stopped working as of April 27, 2023.
            </h3>
            <p className="text-2xl">
              Twitter has suspended this service due to their recent API
              changes.
            </p>
          </div>
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
