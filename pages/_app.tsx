import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { AnimatePresence } from 'framer-motion'

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <div>
        <Header />
        <AnimatePresence
          exitBeforeEnter
          initial={false}
          onExitComplete={() => window.scrollTo(0, 0)}
        >
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </div>
      <Footer />
    </>
  )
}

export default MyApp
