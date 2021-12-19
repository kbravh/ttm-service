import { useUser } from '../context/user';

export const Multipass = () => {
  const { user } = useUser();

  const generateAPIKey = async () => {
    console.log('generating new api key...');
  };

  return (
    <div className="bg-white shadow-md overflow-hidden sm:rounded-lg mt-5">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">API Access Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Your API key and other information about your API usage.</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">API Key</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span className="flex-grow">{user?.key ?? 'Generate a key'}</span>
              <span className="ml-4 flex-shrink-0">
                <button onClick={() => generateAPIKey()} type="button" className="bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Re-generate
                </button>
              </span>
            </dd>
          </div>
          {/* <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Tweets in last 30 days</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">1123 tweets</dd>
          </div> */}
        </dl>
      </div>
    </div>
  );
};
