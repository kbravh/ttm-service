import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface Props {
  children: ReactNode;
  title?: string;
  description?: string;
}

const variants = {
  hidden: { opacity: 0, x: 200, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 100 },
};

export const Layout: FC<Props> = ({ children, title, description }) => {
  const { asPath } = useRouter();

  return (
    <motion.main initial="hidden" animate="enter" exit="exit" variants={variants} transition={{ type: 'tween' }}>
      <Head>
        <title key="title">{title ? `${title} | ` : ''}Tweet to Markdown</title>
        <link rel="preload" href="/fonts/Cartridge-Regular.woff2" as="font" crossOrigin="" />
        {/* Open Graph tags */}
        <meta property="og:url" content={`https://ttm.kbravh.dev/${asPath}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Tweet to Markdown${title ? ` | ${title}` : ''}`} />
        <meta property="og:image" content="https://ttm.kbravh.dev/ttm_social.png?1" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="628" />
        <meta
          property="og:description"
          content={description ?? 'Save tweets as beautiful Markdown. Tweet to Markdown helps you archive the knowledge and insights you find on Twitter. Build up your personal knowledge base and avoid losing information in the ephemeral internet.'}
        />
        <meta property="og:locale" content="en_US" />
        <meta property="twitter:title" content={`Tweet to Markdown${title ? ` | ${title}` : ''}`} />
        <meta
          property="twitter:description"
          content={description ?? 'Save tweets as beautiful Markdown. Tweet to Markdown helps you archive the knowledge and insights you find on Twitter. Build up your personal knowledge base and avoid losing information in the ephemeral internet.'}
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:creator" content="@kbravh" />
        <meta property="twitter:image" content="https://ttm.kbravh.dev/ttm_social.png?1" />
      </Head>
      {children}
    </motion.main>
  );
};
