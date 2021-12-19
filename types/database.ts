import {User} from '@supabase/supabase-js'
export interface UserProfile extends User {
  id: string
  created_at: string
  email?: string
  last_active_at?: Date | string
  key?: string
}
