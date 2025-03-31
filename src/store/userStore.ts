import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchUserProfiles, fetchUserProfile, updateUserProfile as updateUserProfileApi } from '@/api/usersService'
import type { UserProfile } from '@/types/userTypes'

export const useUserStore = defineStore('user', () => {

  const userProfiles = ref<UserProfile[]>([])
  const userProfile = ref<UserProfile>()

  const setUserProfiles = async() => {
    userProfiles.value = await fetchUserProfiles()
  }

  const setUserProfile = async(telegram_id: number) => {
    userProfile.value = await fetchUserProfile(telegram_id)
  }

  const updateUserProfile = async(user: UserProfile) => {
    return await updateUserProfileApi(user)
  }

  return {
    userProfiles, userProfile, setUserProfiles, setUserProfile, updateUserProfile
  }
})
