import type { NextPage } from 'next'
import { supabase } from '../utils/supabase'

const Home: NextPage = () => {
  console.log(supabase.auth.user())
  return (
    <div>
      Welcome to TTM Service. Sign up or login.
    </div>
  )
}

export default Home
