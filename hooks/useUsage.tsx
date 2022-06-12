import axios from 'axios'
import { useEffect, useState } from 'react'
import { useUser } from '../context/user'
import { Subscription, TweetRequest, UserProfile } from '../types/database'
import { UsageResponse } from '../types/stripe'
import { getFirstAndLastMomentOfMonth, isDateBetween } from '../utils/dates'
import { supabase } from '../utils/supabase'

interface Usage {
  used: number
  limit?: number | null
  type: 'capped' | 'metered'
  startDate?: Date
  endDate?: Date
}

export const useUsage = () => {
  const [usage, setUsage] = useState<Usage | null>()
  const { userState, user } = useUser()

  useEffect(() => {
    const fetchUsage = async () => {
      if (user && userState === 'full') {
        // fetch subscription type
        const { data: subscription, error: subscriptionError } = await supabase
          .from<Subscription>('subscriptions')
          .select('limit,type')
          .single()
        if (subscriptionError || !subscription) {
          console.error(
            'There was an error fetching the subscription information',
            subscriptionError
          )
          return
        }
        if (subscription.type === 'metered') {
          // if metered user, fetch usage from stripe
          let usageResponse: UsageResponse
          try {
            usageResponse = await axios('/api/usage').then(
              (response) => response.data as UsageResponse
            )
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.log(error)
            }
            return
          }
          setUsage({
            used: usageResponse.count,
            type: 'metered',
            startDate: usageResponse.startDate ? new Date(usageResponse.startDate) : undefined,
            endDate: usageResponse.endDate ? new Date(usageResponse.endDate) : undefined,
          })
        }

        if (subscription.type === 'capped') {
          // if capped, fetch from database by first and last day of month
          const [firstDay, lastDay] = getFirstAndLastMomentOfMonth()
          const { count, error: usageError } = await supabase
            .from<TweetRequest>('requests')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', firstDay.toISOString())
            .lte('created_at', lastDay.toISOString())

          if (usageError || count === null) {
            console.error(
              'There was an error fetching the number of tweets used.',
              usageError
            )
            return
          }
          setUsage({
            used: count,
            limit: subscription.limit,
            type: subscription.type,
          })
        }
      }
    }
    fetchUsage()
  }, [user, userState])

  useEffect(() => {
    if (user && userState === 'full') {
      let start: Date, end: Date
      if (usage?.startDate && usage?.endDate) {
        start = usage.startDate
        end = usage.endDate
      } else {
        [start, end] = getFirstAndLastMomentOfMonth()
      }
      const subscription = supabase
        .from<TweetRequest>(`requests:user_id=eq.${user?.id}`)
        .on('INSERT', (payload) => {
          if (isDateBetween(new Date(payload.new.created_at), start, end)) {
            setUsage((prevUsage) => {
              if (prevUsage) {
                return {
                  limit: prevUsage.limit,
                  used: (prevUsage.used ?? 0) + 1,
                  type: prevUsage.type,
                }
              }
            })
          }
        })
        .subscribe()
      return () => {
        supabase.removeSubscription(subscription)
      }
    }
  }, [userState, user, usage?.startDate, usage?.endDate])

  return usage
}
