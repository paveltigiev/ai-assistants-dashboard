// import useSupabase from '@/lib/supabaseClient'
// const { supabase } = useSupabase()
import { supabase } from "@/lib/supabaseClient";
import type { UserProfile } from '@/types/userTypes'

export const fetchUserProfiles  = async (workspaceId?: number): Promise<UserProfile[]> => {
  try {
    let query = supabase
      .from("extended_user_profiles")
      .select("*")
      .order('created_at', { ascending: false })

    if (workspaceId) {
      query = query.eq("workspace_id", workspaceId)
    }

    const { data, error } = await query

    if (error) throw error

    return data
  } catch (error) {
    console.log( (error as Error).message)
    return []
  }
}

export const fetchUserProfile  = async (user_id: number): Promise<UserProfile> => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user_id)
      .single()
    if (error) throw error

    return data
  } catch (error) {
    console.log( (error as Error).message)
    return {} as UserProfile
  }
}

export const updateUserProfile = async (user: UserProfile) => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(user)
      .eq("id", user.id)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.log((error as Error).message)
    return null
  }
}

export const deleteUserProfile = async (user_id: number) => {
  try {
    const { error } = await supabase
      .from("user_profiles")
      .delete()
      .eq("id", user_id)

    if (error) throw error

    return true
  } catch (error) {
    console.log((error as Error).message)
    return false
  }
}
