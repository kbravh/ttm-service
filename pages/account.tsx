import { NextPage } from 'next';
import { ClientOnly } from '../components/clientOnly';
import { MainWrapper } from '../components/mainWrapper';
import { Multipass } from '../components/multipass';
import { useUser } from '../context/user';
import { supabase } from '../utils/supabase';

const Account: NextPage = () => {
  const { user } = useUser();
  return (
    <>
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
    </>
  );
};

export default Account;

export const getServerSideProps = async ({ req }: { req: Request }) => {
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
    props: {},
  };
};
