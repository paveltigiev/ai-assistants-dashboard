import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRoles, fetchPrompts } from '@/api/settingsService'
import type { Role, Prompt } from '@/types/settingsTypes'

export const useSettingsStore = defineStore('settings', () => {

  const roles = ref<Role[]>([])
  const prompts = ref<Prompt[]>([])

  const setRoles = async() => {
    roles.value = await fetchRoles()
  }

  const setPrompts = async() => {
    prompts.value = await fetchPrompts()
  }

  return {
    roles, prompts, setRoles, setPrompts
  }
})
