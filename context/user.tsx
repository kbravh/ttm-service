import { Provider, User, UserCredentials } from '@supabase/supabase-js'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { UserProfile } from '../types/database'
import { supabase } from '../utils/supabase'

export interface UserContext {
  user: UserProfile | null
  login: (credentials: UserCredentials, redirect?: string) => void
  logout: () => void
  setUser: React.Dispatch<React.SetStateAction<User | null>>

  userState: UserStates
}

type UserStates = 'anon' | 'authed' | 'full'

const context = createContext<UserContext>({
  user: null,
  login: () => {},
  logout: () => {},
  setUser: () => {},
  userState: 'anon',
})

const Provider: React.FC = ({ children }) => {
  const [user, setUser] = useState(supabase.auth.user())
  const [userState, setUserState] = useState<UserStates>('anon')
  const router = useRouter()

  useEffect(() => {
    const getUserProfile = async () => {
      const sessionUser = supabase.auth.user()

      if (sessionUser) {
        setUserState('authed')
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('id', sessionUser.id)
          .single()

        setUser({
          ...sessionUser,
          ...user,
        })

        setUserState('full')
      }
    }
    getUserProfile()

    supabase.auth.onAuthStateChange(() => {
      getUserProfile()
    })

  }, [])

  useEffect(() => {
    let data = {}
    if (!supabase.auth.session()) {
      data = {
        event: 'SIGNED_OUT',
      }
    } else {
      data = {
        event: user ? 'SIGNED_IN' : 'SIGNED_OUT',
        session: supabase.auth.session(),
      }
    }
    axios.post('/api/set_cookie', data)
  }, [user])

  const login: UserContext['login'] = async (
    credentials: UserCredentials,
    redirect: string = 'account'
  ) => {
    await supabase.auth.signIn(credentials, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${redirect}`,
    })
  }

  const logout: UserContext['logout'] = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setUserState('anon')
    router.push('/')
  }

  const exposed = {
    user,
    login,
    logout,
    setUser,
    userState,
  }
  return <context.Provider value={exposed}>{children}</context.Provider>
}

export const useUser = () => useContext(context)

export default Provider
