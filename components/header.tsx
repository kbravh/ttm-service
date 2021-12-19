import Link from 'next/link';
import { useUser } from '../context/user';

export const Header = () => {
  const { user } = useUser();
  return (
    <div className="md:flex md:items-center md:justify-between py-7 px-10 shadow-sm">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Tweet to Markdown</h2>
      </div>
      <div className="mt-4 flex md:mt-0 md:ml-4">
        {!user && (
          <>
            <Link href="/login">
              <a className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Sign in</a>
            </Link>
            <Link href="/signup">
              <a className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Sign up
              </a>
            </Link>
          </>
        )}
        {user && (
          <Link href="/logout">
            <a className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Sign out</a>
          </Link>
        )}
      </div>
    </div>
  );
};
