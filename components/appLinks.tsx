import { TerminalIcon } from '@heroicons/react/outline';

export const AppLinks = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around items-center gap-7 sm:gap-20 select-none">
      <div className="relative group">
        <div className="absolute h-9 inset-0 rounded-full blur bg-gradient-to-tr from-emerald-400 to-indigo-500 opacity-75 transition group-hover:opacity-100 group-hover:scale-105 group-hover:duration-200 duration-1000"></div>
        <a href="https://github.com/kbravh/obsidian-tweet-to-markdown" className="relative block px-5 py-[9px] rounded-md no-underline bg-slate-800 leading-none text-slate-100 font-semibold">
          <span className="flex items-center space-x-2">
            <svg width="15px" height="15px" viewBox="0 0 20 20" className='text-slate-100' stroke='currentColor' fill='currentColor'>
              <path strokeWidth={.0724371}
                d="M19.762 5.779a.812.812 0 0 0-1.149 0l-3.75 3.75-4.393-4.392 3.75-3.75a.812.812 0 0 0-1.148-1.15l-3.75 3.751-2.77-2.77a1.29 1.29 0 0 0-1.825 1.824l1.195 1.196L4.66 5.501c-2.296 2.297-2.644 5.796-1.058 8.466L.504 17.064a1.72 1.72 0 0 0 2.432 2.432L6.034 16.4c2.669 1.585 6.169 1.238 8.465-1.058l1.263-1.263 1.196 1.195a1.29 1.29 0 1 0 1.824-1.824l-2.77-2.77 3.75-3.75a.813.813 0 0 0 0-1.15z"
              />
            </svg>

            <span>Obsidian plugin</span>
          </span>
        </a>
      </div>
      <div className="relative group">
        <div className="absolute inset-0 rounded-full blur bg-gradient-to-tr from-emerald-400 to-indigo-500 opacity-75 transition group-hover:opacity-100 group-hover:scale-105 group-hover:duration-200 duration-1000"></div>
        <a href="https://github.com/kbravh/tweet-to-markdown" className="relative block px-5 py-2 rounded-md no-underline bg-slate-800 leading-none text-slate-100 font-semibold">
          <span className="flex items-center space-x-2">
            <TerminalIcon className="h-5 w-auto" />
            <span>CLI app</span>
          </span>
        </a>
      </div>
    </div>
  );
};
