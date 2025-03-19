export interface Chat {
  chat_id: number
  user_id: number
  users: [string]
  created_at: string
  agent: string
  message_count: number
  first_name: string
  last_name: string
}

export interface Message {
  id: number
  chat_id: number
  user_id: number
  message: string
  created_at: string
  updated_at: string
  role: string
  username: string
  text: string
}