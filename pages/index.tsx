import type { NextPage } from 'next'
import { useUser } from '../context/user'

const Home: NextPage = () => {
  const {user} = useUser()
  return (
    <div>
      Welcome to TTM Service. Sign up or login.
    </div>
  )
}

export default Home
