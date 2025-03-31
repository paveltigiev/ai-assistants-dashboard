import { supabase } from "@/lib/supabaseClient";
import type { Role, Prompt } from '@/types/settingsTypes'

type CreatePrompt = Omit<Prompt, 'id'>

export const fetchRoles  = async (): Promise<Role[]> => {
  try {
    const { data, error } = await supabase
      .from("roles")
      .select("*")

    if (error) throw error

    return data
  } catch (error) {
    console.log( (error as Error).message)
    return []
    }
}

export const fetchPrompts  = async (): Promise<Prompt[]> => {
  try {
    const { data, error } = await supabase
      .from("prompts")
      .select("*")

    if (error) throw error

    return data
  } catch (error) {
    console.log( (error as Error).message)
    return []
  }
}

export const updatePrompt = async (prompt: Prompt) => {
  try {
    const { data, error } = await supabase
      .from("prompts")
      .update(prompt)
      .eq("id", prompt.id)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.log( (error as Error).message)
    return null
  }
}

export const createPrompt = async (prompt: CreatePrompt) => {
  try {
    const { data, error } = await supabase
      .from("prompts")
      .insert(prompt)

    if (error) throw error

    return data
  } catch (error) {
    console.log( (error as Error).message)
    return null
  }
}