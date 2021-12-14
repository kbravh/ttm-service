import { NextPage } from "next"
import { useEffect } from "react"
import { useUser } from "../context/user"

const Logout: NextPage = () => {
  const {logout} = useUser()
  useEffect(() => {
    logout()
  })
  return (
    <div>Logging out...</div>
  )
}

export default Logout
