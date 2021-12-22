import '../styles/globals.css'
import type { AppProps } from 'next/app'
import UserProvider from '../context/user'
import { Header } from '../components/header'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Header />
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp
