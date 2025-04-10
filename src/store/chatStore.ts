import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchChats, fetchMessages } from '@/api/chatService'
import type { Chat, Message } from '@/types/chatTypes'
import { useSettingsStore } from '@/store/settingsStore'

export const useChatStore = defineStore('chat', () => {

  const chats = ref<Chat[]>([])
  const messages = ref<Message[]>([])

  const setChats = async() => {
    chats.value = await fetchChats()
  }

  const setChat = async(chat_id: number, retryCount = 0) => {
    const settingsStore = useSettingsStore()
    if (!settingsStore.currentWorkspace?.id) {
      if (retryCount < 3) {
        console.warn('No workspace ID available, retrying in 1 second...')
        setTimeout(() => setChat(chat_id, retryCount + 1), 1000)
        return
      }
      console.warn('No workspace ID available after 3 retries, giving up')
      return
    }
    messages.value = await fetchMessages(chat_id, settingsStore.currentWorkspace.id)
  }

  return {
    chats, messages, setChats, setChat
  }
})
