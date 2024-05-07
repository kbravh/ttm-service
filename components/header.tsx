import { Disclosure, Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import { useUser } from '../context/user'
import { MenuIcon, UserIcon, XIcon } from '@heroicons/react/outline'
import { Fragment } from 'react'
import { ClientOnly } from './clientOnly'
import Image from 'next/image'

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ')

const userNavigation = [
  { name: 'Your account', href: '/account' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Logout', href: '/logout' },
]
export const Header = () => {
  const { user } = useUser()

  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* logo */}
              <div className="flex">
                <Link href="/" scroll={false}>
                  <a className="flex-shrink-0 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="block lg:hidden h-8 w-auto"
                      src="/ttm.png"
                      alt="Tweet to Markdown"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="hidden lg:block h-8 w-auto"
                      src="/ttm_full.png"
                      alt="Tweet to Markdown"
                    />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}
