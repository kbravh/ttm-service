import '../styles/globals.css'
import type { AppProps } from 'next/app'
import UserProvider from '../context/user'
import { Header } from '../components/header'
import { Footer } from '../components/footer'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <div>
        <Header />
        <Component {...pageProps} />
      </div>
      <Footer />
    </UserProvider>
  )
}

export default MyApp
