import { useUser } from '../context/user';
import axios from 'axios';
import { UserProfile } from '../types/database';
import { useEffect, useState } from 'react';
import { KeyIcon } from '@heroicons/react/outline';

type keyState = 'ready' | 'loading' | 'error';

export const Multipass = () => {
  const { isUserLoading, user, setUser } = useUser();
  const [keyState, setKeyState] = useState<keyState>('loading');

  useEffect(() => {
    setKeyState('ready');
  }, [user]);

  const generateOwnKey = async () => {
    setKeyState('loading');

    let updatedUser: UserProfile;
    try {
      updatedUser = await axios.get<UserProfile>('/api/create_own_key').then((response) => response.data);
      setUser(updatedUser);
      setKeyState('ready');
    } catch (error) {
      console.error(error);
      setKeyState('error');
    }
  };

  return (
    <>
      {isUserLoading && <h2>Loading...</h2>}
      {!isUserLoading && (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg text-left">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">API Access Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Your API key and other information about your API usage.</p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.email}</dd>
                </div>

                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">API Key</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex">
                    {keyState === 'ready' && (
                      <>
                        <span className="flex-grow">{user?.key ?? 'No key'}</span>
                        <span className="sm:ml-4 flex-shrink-0">
                          <button type="button" onClick={() => generateOwnKey()} className="bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                            Generate new key
                          </button>
                        </span>
                      </>
                    )}
                    {keyState === 'error' && <span className="flex-grow text-red-900">Error</span>}
                    {keyState === 'loading' && (
                      <span className="flex-grow flex justify-center items-center">
                        <KeyIcon className="h-4 w-auto animate-wiggle text-emerald-600" />
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </>
      )}
    </>
  );
};
