import { Disclosure, Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import { useUser } from '../context/user';
import { MenuIcon, UserIcon, XIcon } from '@heroicons/react/outline';
import { Fragment } from 'react';
import { ClientOnly } from './clientOnly';

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

const userNavigation = [
  { name: 'Your account', href: '/account' },
  { name: 'Logout', href: '/logout' },
];
export const Header = () => {
  const { user } = useUser();

  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* logo */}
              <div className="flex">
                <Link href="/">
                  <a className="flex-shrink-0 flex items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="block lg:hidden h-8 w-auto" src="/ttm.png" alt="Tweet to Markdown" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="hidden lg:block h-8 w-auto" src="/ttm_full.png" alt="Tweet to Markdown" />
                  </a>
                </Link>
              </div>

              <ClientOnly>
                {/* logged-in menu */}
                {user && (
                  <>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                      {/* Profile dropdown */}
                      <Menu as="div" className="ml-3 relative">
                        <div>
                          <Menu.Button className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                            <span className="sr-only">Open user menu</span>
                            <div className="h-8 w-8 rounded-full bg-emerald-400 flex items-center justify-center">
                              <UserIcon width={24} height={24} />
                            </div>
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a href={item.href} className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                        <span className="sr-only">Open main menu</span>
                        {open ? <XIcon className="block h-6 w-6" aria-hidden="true" /> : <MenuIcon className="block h-6 w-6" aria-hidden="true" />}
                      </Disclosure.Button>
                    </div>
                  </>
                )}
                {/* logged-out menu */}
                {!user && (
                  <div className="ml-6 flex items-center">
                    {!user && (
                      <Link href="/login">
                        <a type="button" className="bg-white p-1 rounded-full text-slate-500 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                          <span>Login</span>
                        </a>
                      </Link>
                    )}
                  </div>
                )}
              </ClientOnly>
            </div>
          </div>

          <ClientOnly>
            <Disclosure.Panel className="sm:hidden">
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="mt-3 space-y-1">
                  {userNavigation.map((item) => (
                    <Disclosure.Button key={item.name} as="a" href={item.href} className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </ClientOnly>
        </>
      )}
    </Disclosure>
  );
};
