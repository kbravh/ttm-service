import Image from "next/image";

export const AppLinks = () => {
  return (
    <div className="flex justify-around items-center gap-20 select-none">
      <div className="relative group">
        <div className="absolute inset-4 rounded-full blur bg-gradient-to-tr from-emerald-400 to-indigo-500 opacity-75 transition group-hover:opacity-100 group-hover:scale-105 group-hover:duration-200 duration-1000"></div>
        <a href="https://github.com/kbravh/obsidian-tweet-to-markdown" className="relative block h-[80px]">
          <Image src="/obsidian-ttm-logo.svg" width={90} height={70} alt="The Tweet to Markdown Obsidian plugin logo" />
        </a>
      </div>
      <div className="relative group">
        <div className="absolute inset-0 rounded-full blur bg-gradient-to-tr from-emerald-400 to-indigo-500 opacity-75 transition group-hover:opacity-100 group-hover:scale-105 group-hover:duration-200 duration-1000"></div>
        <a href="https://github.com/kbravh/tweet-to-markdown" className="relative w-[100px] h-[50px] flex items-center">
          <Image src="/cli-ttm-logo.svg" width={100} height={50} alt="The Tweet to Markdown CLI logo" />
        </a>
      </div>
    </div>
  );
};
