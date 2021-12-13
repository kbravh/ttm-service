export interface User {
  id: string
  created_at: Date | string
  email: string
  last_active_at?: Date | string
  key?: string
}
