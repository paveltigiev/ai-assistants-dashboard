import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any | null>(null)
  const profile = ref<any | null>(null)

  async function fetchUser() {
    const { data: { user: userData } } = await supabase.auth.getUser()
    user.value = userData
  }

  async function fetchProfile() {
    await fetchUser()

    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq("user_id", user.value.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    
    profile.value = data
  }

  return {
    user,
    fetchUser,
    profile,
    fetchProfile,
  }
})
