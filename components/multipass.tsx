import { useUser } from '../context/user';
import axios from 'axios';
import { UserProfile } from '../types/database';
import { useEffect, useRef, useState } from 'react';
import { KeyIcon } from '@heroicons/react/outline';
import { wait } from '../utils/timers';

type keyState = 'ready' | 'loading' | 'error';

interface Usage {
  used: number;
  limit: number;
}

export const Multipass = () => {
  const { userState, user, setUser } = useUser();
  const [keyState, setKeyState] = useState<keyState>('loading');
  const [usage, setUsage] = useState<Usage | null>();
  const copyButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setKeyState('ready');
  }, [user]);

  useEffect(() => {
    const fetchUsage = async () => {
      if (userState === 'full') {
        const usage = await axios.get<Usage>('/api/usage').then((response) => response.data);
        if (usage) {
          setUsage(usage);
        }
      }
    };
    fetchUsage();
  }, [userState]);

  const copyKeyToClipboard = async () => {
    await navigator.clipboard.writeText(user?.key ?? '');
    if (copyButtonRef.current) {
      copyButtonRef.current.innerText = 'Copied!'
      await wait(3000)
      copyButtonRef.current.innerText = 'Copy key'
    }
  };

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
      {userState === 'authed' && <h2>Loading...</h2>}
      {userState === 'full' && (
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
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex">
                    <span className="flex-grow">{user?.email}</span>
                    <span className="sm:ml-4 flex-shrink-0">
                      <span className="bg-white rounded-md font-medium">
                        {user?.app_metadata.provider === 'github' && (
                          <span className="flex items-center space-x-2">
                            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>GitHub</span>
                          </span>
                        )}
                        {user?.app_metadata.provider === 'twitter' && (
                          <span className="flex items-center space-x-2">
                            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                            <span>Twitter</span>
                          </span>
                        )}
                      </span>
                    </span>
                  </dd>
                </div>

                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">API Key</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex">
                    {keyState === 'ready' && (
                      <>
                        <span className="flex flex-grow items-center">{user?.key ?? 'No key'}</span>
                        {user?.key && (
                          <span className="sm:ml-4">
                            <button type="button" onClick={() => copyKeyToClipboard()} ref={copyButtonRef} className="ml-2 rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                              Copy key
                            </button>
                          </span>
                        )}
                      </>
                    )}
                    {keyState === 'error' && <span className="flex-grow text-red-900">Error</span>}
                    {keyState === 'loading' && (
                      <span className="flex-grow flex justify-center items-center">
                        <KeyIcon className="h-4 w-auto animate-key_wiggle text-emerald-600" />
                      </span>
                    )}
                  </dd>
                </div>
                {usage && (
                  <>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Tweets used</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex">
                        <span className="flex-grow">
                          {usage?.used}/{usage?.limit}
                        </span>
                        <span>Resets each month</span>
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
            <div className="border-t border-gray-200 px-2 py-3 sm:px-4 flex justify-between">
              <span>Need to generate a new API key?</span>
              <button type="button" onClick={() => generateOwnKey()} className="ml-2 rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                Generate new key
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
