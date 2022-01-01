import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  title?: string;
  header?: string;
}

export const MainWrapper: FC<Props> = ({ children, title, header }) => {
  const { asPath } = useRouter();
  return (
    <>
      <Head>
        <title key="title">{title ? `${title} | ` : ''}Tweet to Markdown</title>
        <link rel="preload" href="/fonts/Cartridge-Regular.woff2" as="font" crossOrigin="" />
        {/* Open Graph tags */}
        <meta property="og:url" content={`https://ttm.kbravh.dev/${asPath}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Tweet to Markdown${title ? ` | ${title}` : ''}`} />
        <meta property="twitter:description" content="Save tweets as beautiful Markdown." />
        <meta property="og:locale" content="en_US" />
        <meta property="twitter:title" content={`Tweet to Markdown${title ? ` | ${title}` : ''}`} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:creator" content="@kbravh" />
        <meta property="twitter:image" content="https://ttm.kbravh.dev/ttm_social.png?1" />
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
