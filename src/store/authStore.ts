import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any | null
  }),
  actions: {
    async fetchUser() {
      const { data: { user } } = await supabase.auth.getUser()
      this.user = user
    }
  }
})
