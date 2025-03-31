export type Role = {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}

export type Prompt = {
  id: number
  role: string
  prompt: string
}