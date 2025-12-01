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

  const sendMessage = async (tgId: number, message: string) => {
    if (!tgId || !message.trim()) return

    try {
      const settingsStore = useSettingsStore()
      const workspaceId = settingsStore.currentWorkspace?.id

      const response = await fetch('https://n8n.gogol.chat/webhook/686e27a6-0f30-4f5a-a6d1-67e529fe5222', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          tg_id: tgId,
          workspace_id: workspaceId
        })
      })

      if (response.ok) {
        // Refresh messages for this chat after successful send
        await setChat(tgId)
      } else {
        console.error('Failed to send message, status:', response.status)
      }
    } catch (error) {
      console.error('Failed to send message', error)
    }
  }

  return {
    chats,
    messages,
    setChats,
    setChat,
    sendMessage
  }
})
