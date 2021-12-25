import Link from 'next/link';
import { NextPage } from 'next';
import { useUser } from '../context/user';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { MainWrapper } from '../components/mainWrapper';

const Login: NextPage = () => {
  const { login, user } = useUser();
  const router = useRouter();

  if (user) {
    router.push('/');
  }

  return (
    <>
      <MainWrapper title="Log in" header="You&#39;re almost ready!">
        <div className="min-h-full flex flex-col justify-center sm:px-6 lg:px-8">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 space-y-3 sm:space-y-0">
              <div className="relative group flex justify-center">
                <button
                  onClick={() => login({ provider: 'twitter' })}
                  className="relative block px-5 py-2 rounded-md no-underline bg-slate-800 hover:bg-slate-700 leading-none text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 hover:bg-gradient-to-tr from-emerald-400 to-indigo-500"
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    <span>Continue with Twitter</span>
                  </span>
                </button>
              </div>
              <div className="relative group flex justify-center">
                <button
                  onClick={() => login({ provider: 'github' })}
                  className="relative block px-5 py-2 rounded-md no-underline bg-slate-800 hover:bg-slate-700 leading-none text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 hover:bg-gradient-to-tr from-emerald-400 to-indigo-500"
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Continue with GitHub</span>
                  </span>
                </button>
              </div>
            </div>
            <p className="mt-4">
              By using the service, you agree to the{' '}
              <Link href="/terms-of-service">
                <a className="font-semibold hover:underline hover:decoration-wavy hover:decoration-emerald-400">Terms of Service</a>
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy">
                <a className="font-semibold hover:underline hover:decoration-wavy hover:decoration-emerald-400">Privacy Policy</a>
              </Link>
            </p>
          </div>
        </div>
      </MainWrapper>
    </>
  );
};

export default Login;
