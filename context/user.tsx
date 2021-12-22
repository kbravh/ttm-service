import { Provider, User } from '@supabase/supabase-js';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types/database';
import { supabase } from '../utils/supabase';

export interface UserContext {
  user: UserProfile | null;
  login: (service: Provider) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;

  isUserLoading: boolean;
}

const context = createContext<UserContext>({ user: null, login: () => {}, logout: () => {}, setUser: () => {}, isUserLoading: true });

const Provider: React.FC = ({ children }) => {
  const [user, setUser] = useState(supabase.auth.user());
  const [isUserLoading, setIsUserLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUserProfile = async () => {
      const sessionUser = supabase.auth.user();

      if (sessionUser) {
        const { data: user } = await supabase.from('users').select('*').eq('id', sessionUser.id).single();

        setUser({
          ...sessionUser,
          ...user,
        });

        setIsUserLoading(false);
      }
    };
    getUserProfile();

    supabase.auth.onAuthStateChange(() => {
      getUserProfile();
    });
  }, []);

  useEffect(() => {
    axios.post('/api/set_cookie', {
      event: user ? 'SIGNED_IN' : 'SIGNED_OUT',
      session: supabase.auth.session(),
    });
  }, [user]);

  const login = async (service: Provider) => {
    await supabase.auth.signIn({
      provider: service,
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  const exposed = {
    user,
    login,
    logout,
    setUser,
    isUserLoading
  };
  return <context.Provider value={exposed}>{children}</context.Provider>;
};

export const useUser = () => useContext(context);

export default Provider;
