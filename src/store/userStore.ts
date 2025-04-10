import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchUserProfiles, fetchUserProfile, updateUserProfile as updateUserProfileApi } from '@/api/usersService'
import type { UserProfile } from '@/types/userTypes'
import { useSettingsStore } from '@/store/settingsStore'

export const useUserStore = defineStore('user', () => {

  const userProfiles = ref<UserProfile[]>([])
  const userProfile = ref<UserProfile>()

  const setUserProfiles = async(retryCount = 0) => {
    const settingsStore = useSettingsStore()
    if (!settingsStore.currentWorkspace?.id) {
      if (retryCount < 3) {
        console.warn('No workspace ID available, retrying in 1 second...')
        setTimeout(() => setUserProfiles(retryCount + 1), 1000)
        return
      }
      console.warn('No workspace ID available after 3 retries, giving up')
      return
    }
    userProfiles.value = await fetchUserProfiles(settingsStore.currentWorkspace.id)
  }

  const setUserProfile = async(user_id: number) => {
    userProfile.value = await fetchUserProfile(user_id)
  }

  const updateUserProfile = async(user: UserProfile) => {
    return await updateUserProfileApi(user)
  }

  return {
    userProfiles, userProfile, setUserProfiles, setUserProfile, updateUserProfile
  }
})
