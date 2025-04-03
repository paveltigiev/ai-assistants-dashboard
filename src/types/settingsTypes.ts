export type Role = {
  id: number
  role: string
  description?: string
  created_at?: string
  updated_at?: string
}

export type Prompt = {
  id: number
  role: string
  prompt: string
}

export type Scheduler = {
  id: number
  role: string
  days_after: number
  day_hour: number
  prompt: string
  workspace_id: number
}