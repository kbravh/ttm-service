import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full mt-6 border-t border-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-5xl">
        <div className="py-8 text-sm text-gray-500 text-center sm:text-left flex flex-col justify-between sm:flex-row">
          <div className="order-last sm:order-none sm:flex sm:items-center mt-3 sm:mt-0">
            <span className="block sm:inline mr-1">&copy; 2021-present <a href="https://kbravh.dev" className="font-semibold hover:underline hover:decoration-wavy hover:decoration-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 rounded-full">Karey Higuera</a>.</span>
            <span className="block sm:inline">All rights reserved.</span>
          </div>
          <div className="flex flex-col">
            <h5>Links</h5>
            <Link href="/terms-of-service" scroll={false}>
              <a className="font-semibold hover:underline hover:decoration-wavy hover:decoration-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 rounded-full">Terms of Service</a>
            </Link>
            <Link href="/privacy-policy" scroll={false}>
              <a className="font-semibold hover:underline hover:decoration-wavy hover:decoration-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 rounded-full">Privacy Policy</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
