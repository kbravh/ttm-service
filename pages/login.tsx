import { NextPage } from "next";
import { useEffect } from "react";
import { supabase } from "../utils/supabase";

const Login: NextPage = () => {
  useEffect(() => {
    supabase.auth.signIn({
      provider: 'github'
    })
  })
  return (
    <div>Logging in...</div>
  )
}

export default Login
