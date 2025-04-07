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
  workspace_id: number
}

export type Scheduler = {
  id: number
  role: string
  days_after: number
  time: string
  prompt: string
  workspace_id: number
  image_url?: string
}

export interface Profile {
  id: number;
  email: string;
  workspace_id: string;
  role: string;
}

export interface Invitation {
  id: number;
  email: string;
  workspace_id: string;
  created_at: string;
  used: boolean;
}

export interface Profile {
  id: number;
  email: string;
  workspace_id: string;
  role: string;
}