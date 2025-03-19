import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchChats, fetchMessages } from '@/api/chatService'
import type { Chat, Message } from '@/types/chatTypes'

export const useChatStore = defineStore('chat', () => {

  const chats = ref<Chat[]>([])
  const messages = ref<Message[]>([])

  const setChats = async() => {
    chats.value = await fetchChats()
  }

  const setChat = async(chat_id: string) => {
    messages.value = await fetchMessages(chat_id)
  }

  return {
    chats, messages, setChats, setChat
  }
})
