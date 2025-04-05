import { supabase } from "@/lib/supabaseClient";
import type { Role, Prompt, Scheduler } from '@/types/settingsTypes'

type CreatePrompt = Omit<Prompt, 'id'>
type CreateScheduler = Omit<Scheduler, 'id'>

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

export const fetchSchedulers  = async (): Promise<Scheduler[]> => {
  try {
    const { data, error } = await supabase
      .from("schedulers")
      .select("*")
      .order('days_after', { ascending: false })

    if (error) throw error

    return data
  } catch (error) {
    console.log( (error as Error).message)
    return []
  }
}

export const updateScheduler = async (scheduler: Scheduler) => {
  try {
    const { data, error } = await supabase
      .from("schedulers")
      .update(scheduler)
      .eq("id", scheduler.id)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.log( (error as Error).message)
    return null
  }
}

export const createScheduler = async (scheduler: CreateScheduler) => {
  try {
    const { data, error } = await supabase
      .from("schedulers")
      .insert(scheduler)

    if (error) throw error

    return data
  } catch (error) {
    console.log( (error as Error).message)
    return null
  }
}

export const deleteScheduler = async (id: number) => {
  try {
    const { error } = await supabase
      .from("schedulers")
      .delete()
      .eq("id", id)

    if (error) throw error

    return true
  } catch (error) {
    console.log((error as Error).message)
    return false
  }
}

export const fetchProfiles = async () => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")

    if (error) throw error

    return data
  } catch (error) {
    console.log( (error as Error).message)
    return []
  }
}
