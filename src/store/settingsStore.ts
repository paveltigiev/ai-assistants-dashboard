import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRoles, fetchPrompts, fetchSchedulers, fetchWorkspaces, fetchProfiles } from '@/api/settingsService'
import type { Role, Prompt, Scheduler } from '@/types/settingsTypes'

export const useSettingsStore = defineStore('settings', () => {

  const roles = ref<Role[]>([])
  const prompts = ref<Prompt[]>([])
  const schedulers = ref<Scheduler[]>([])
  const workspaces = ref<any[]>([])
  const currentWorkspace = ref<any>(null)
  const profiles = ref<any[]>([])

  const setRoles = async() => {
    roles.value = await fetchRoles()
  }

  const setPrompts = async() => {
    prompts.value = await fetchPrompts(currentWorkspace.value?.id)
  }

  const setSchedulers = async() => {
    schedulers.value = await fetchSchedulers(currentWorkspace.value?.id)
  }

  const setWorkspaces = async() => {
    workspaces.value = await fetchWorkspaces()
  }

  const setProfiles = async() => {
    profiles.value = await fetchProfiles(currentWorkspace.value?.id)
  }

  return {
    roles,
    prompts,
    schedulers,
    workspaces,
    currentWorkspace,
    profiles,
    setRoles,
    setPrompts,
    setSchedulers,
    setWorkspaces,
    setProfiles
  }
})
