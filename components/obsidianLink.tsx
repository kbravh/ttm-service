export const ObsidianLink = () => {
  return (
    <span className="inline-block -ml-1">
      <a href="https://obsidian.md" className="no-underline group">
        <div className="flex items-baseline">
          <svg viewBox="0 0 63 100" width="18.9" height="15" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="a" x1="82.85" y1="30.41" x2="51.26" y2="105.9" gradientTransform="matrix(1 0 0 -1 -22.41 110.97)" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#6c56cc" />
                <stop offset="1" stopColor="#9785e5" />
              </linearGradient>
            </defs>
            <path fill="#34208c" d="m44.61 0-31.7 17.52L0 45.45l19.57 45.02L47.35 100l5.09-10.2L63 26.39Z" />
            <path fill="url(#a)" d="M63 26.39 43.44 14.41 16.43 35.7 47.35 100l5.09-10.2Z" style={{ fill: 'url(#a)' }} />
            <path fill="#af9ff4" d="M63 26.39 44.61 0l-1.17 14.41Z" />
            <path fill="#4a37a0" d="M43.44 14.41 44.61 0l-31.7 17.52 3.52 18.18ZM16.43 35.7l3.14 54.77L47.35 100Z" />
          </svg>
        <span className="no-underline group-hover:underline group-hover:decoration-dotted text-purple-900 group-hover:decoration-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-full">Obsidian</span>
        </div>
      </a>
    </span>
  );
};
