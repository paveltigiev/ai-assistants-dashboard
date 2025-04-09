import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRoles, fetchPrompts, fetchSchedulers, fetchWorkspaces } from '@/api/settingsService'
import type { Role, Prompt, Scheduler } from '@/types/settingsTypes'

export const useSettingsStore = defineStore('settings', () => {

  const roles = ref<Role[]>([])
  const prompts = ref<Prompt[]>([])
  const schedulers = ref<Scheduler[]>([])
  const workspaces = ref<any[]>([])
  const currentWorkspace = ref<any>(null)

  const setRoles = async() => {
    roles.value = await fetchRoles()
  }

  const setPrompts = async() => {
    prompts.value = await fetchPrompts()
  }

  const setSchedulers = async() => {
    schedulers.value = await fetchSchedulers()
  }

  const setWorkspaces = async() => {
    workspaces.value = await fetchWorkspaces()
  }

  return {
    roles,
    prompts,
    schedulers,
    workspaces,
    currentWorkspace,
    setRoles,
    setPrompts,
    setSchedulers,
    setWorkspaces
  }
})
