// import useSupabase from '@/lib/supabaseClient'
// const { supabase } = useSupabase()
import { supabase } from "@/lib/supabaseClient";
import type { UserProfile } from '@/types/userTypes'

export const fetchUserProfiles  = async (): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")

    if (error) throw error

    return data
  } catch (error) {
    console.log( (error as Error).message)
    return []
  }
}

export const fetchUserProfile  = async (telegram_id: number): Promise<UserProfile> => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("telegram_id", telegram_id)
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
