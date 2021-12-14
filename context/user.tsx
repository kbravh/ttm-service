import { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export interface UserContext {
  user: User | null
  login: () => void
  logout: () => void
}

const context = createContext<UserContext>({user: null, login: () => {}, logout: () => {}})

const Provider: React.FC =  ({children}) => {
  const [user, setUser] = useState(supabase.auth.user())
  const router = useRouter()

  useEffect(() => {
    const getUserProfile = async () => {
      const sessionUser = supabase.auth.user()

      if (sessionUser) {
        const {data: user} = await supabase.from('users').select('*').eq('id', sessionUser.id).single()

        setUser({
          ...sessionUser,
          ...user
        })
      }
    }
    getUserProfile()

    supabase.auth.onAuthStateChange(() => {
      getUserProfile()
    })
  }, [])

  const login = async () => {
    await supabase.auth.signIn({
      provider: 'github'
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const exposed = {
    user,
    login,
    logout
  }
  return <context.Provider value={exposed}>{children}</context.Provider>
}

export const useUser = () => useContext(context);

export default Provider
