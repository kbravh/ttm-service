import Head from 'next/head';
import { FC, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  title: string;
  header?: string;
}

export const MainWrapper: FC<Props> = ({ children, title, header }) => {
  return (
    <>
      <Head>
        <title>{title} | Tweet to Markdown</title>
        <link rel="preload" href="/fonts/Cartridge-Regular.woff2" as="font" crossOrigin="" />
      </Head>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg md:max-w-4xl flex flex-col items-center text-center text-slate-700 text-lg px-4 sm:px-6">
          <h1 className="font-header text-6xl text-slate-800">{header ?? title}</h1>
          {children}
        </div>
      </div>
    </>
  );
};
