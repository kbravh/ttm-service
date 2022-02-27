import {User} from '@supabase/supabase-js'
export interface UserProfile extends User {
  id: string
  created_at: string
  email?: string
  last_active_at?: Date | string
  key?: string
  subscription_id?: string;
  subscription_start?: Date | string
  subscription_end?: Date | string
  // proto property, inserted by join
  subscriptions?: Subscription
  stripe_customer_id?: string
}

export interface Subscription {
  id: string
  created_at: Date | string
  price: number
  limit: number
}

export interface TweetRecord {
  id: string
  first_retrieved_at: Date | string
  last_retrieved_at: Date | string
  author_id: string
  tweet_id: string
  conversation_id?: string
}

export interface TweetRequest {
  id: string
  created_at: string
  user_id: string
  tweet_id: string
  conversation_id?: string
  source?: string
}
