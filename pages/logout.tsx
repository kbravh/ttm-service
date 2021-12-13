import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { supabase } from "../utils/supabase"

const Logout: NextPage = () => {
  const router = useRouter()
  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut()
      router.push('/')
    }

    logout()
  })
  return (
    <div>Logging out...</div>
  )
}

export default Logout
