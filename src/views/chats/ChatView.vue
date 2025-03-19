<template>
  <div class="flex items-start gap-4">
    <div class="chat w-1/2 ">
      <h1 class="text-2xl font-semibold mb-4">История чата</h1>
      <div class="border rounded-md p-4">
        <div v-for="message in messages" :key="message.id" class="message-container">
          <div :class="['message', { 'user-message': message.role === 'user', 'assistant-message': message.role === 'assistant' }]">
            <div class="message-username">{{ message.username }}</div>
            <div class="message-time">{{ formatDate(message.created_at) }}</div>
            <div class="message-content" v-html="message.text"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="user-info w-1/2">
      <h1 class="text-2xl font-semibold mb-4">Информация о пользователе</h1>
      <div class=" border rounded-md p-4">
        <pre>
          {{ userInfo }}
        </pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { supabase } from "@/lib/supabaseClient"
import { useChatStore } from "@/store/chatStore"
import { formatDate } from "@/helpers/date"
import { useRoute } from 'vue-router'

const route = useRoute()
const chat_id = route.params.chatId as string
const chatStore = useChatStore()

const messages = computed(() => {
  return chatStore.messages
})

const userInfo =computed(() => {
  const info = messages.value.find(message => message.role === "user")

  return info
})

onMounted(async () => {
  if (route.params.id) {
    chatStore.setChat(route.params.id)
  }
})
</script>

<style scoped>
.message-container {
  margin:  0;
}

.message {
  max-width: 70%;
  padding: 1rem;
  border-radius: 1rem;
  margin: 0.5rem;
}

.user-message {
  background-color: #505050;
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 0.2rem;
}

.assistant-message {
  border: 1px solid #505050;
  margin-right: auto;
  border-bottom-left-radius: 0.2rem;
}

.message-time {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-bottom: 0.5rem;
}
</style>
