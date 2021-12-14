import { NextPage } from "next";
import { useEffect } from "react";
import { useUser } from "../context/user";

const Login: NextPage = () => {
  const {login} = useUser()

  useEffect(() => {
    login()
  }, [login])
  return (
    <div>Logging in...</div>
  )
}

export default Login
