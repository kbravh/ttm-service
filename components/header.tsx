import { Disclosure } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '../context/user';

export const Header = () => {
  const { user } = useUser();
  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      {() => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link href="/">
                  <a className="flex-shrink-0 flex items-center">
                    <img className="block lg:hidden h-8 w-auto" src="/ttm.png" alt="Tweet to Markdown" />
                    <img className="hidden lg:block h-8 w-auto" src="/ttm_full.png" alt="Tweet to Markdown" />
                  </a>
                </Link>
              </div>
              <div className="ml-6 flex items-center">
                {!user && (
                  <Link href="/login">
                    <a type="button" className="bg-white p-1 rounded-full text-slate-500 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span>Login</span>
                    </a>
                  </Link>
                )}
                {user && (
                  <Link href="/logout">
                    <a type="button" className="bg-white p-1 rounded-full text-slate-500 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span>Logout</span>
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};
