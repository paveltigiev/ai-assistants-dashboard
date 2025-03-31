<template>
  <div class="flex items-start gap-4">
    <div class="chat w-1/2 ">
      <h1 class="text-2xl font-semibold mb-4">История чата</h1>
      <div class="border rounded-md p-4">
        <div v-for="message in messages" :key="message.id" class="message-container">
          <div :class="['message', { 'user-message': message.role === 'user', 'assistant-message': message.role === 'assistant' }]">
            <div class="message-username">{{ message.username }}</div>
            <div class="message-time">{{ formatDate(message.created_at) }}</div>
            <div class="message-content">{{ message.text }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="user-info w-1/2">
      <h1 class="text-2xl font-semibold mb-4">Информация о пользователе</h1>
      <div class=" border rounded-md p-4">
        <div v-if="userProfile" class="space-y-2">
          <div class="flex gap-2">
            <span class="font-medium">Имя:</span>
            <span>{{ userProfile?.profile?.first_name }}</span>
          </div>
          <div class="flex gap-2">
            <span class="font-medium">Фамилия:</span>
            <span>{{ userProfile?.profile?.last_name }}</span>
          </div>
          <div class="flex gap-2">
            <span class="font-medium">Telegram ID:</span>
            <span>{{ userProfile?.telegram_id }}</span>
          </div>
          <div class="flex gap-2">
            <span class="font-medium">Username:</span>
            <span><a :href="`https://t.me/${userProfile?.profile?.username}`" target="_blank">@{{ userProfile?.profile?.username }}</a></span>
          </div>
          <div class="flex gap-2">
            <span class="font-medium">Роль:</span>
            <span>{{ userProfile?.role }}</span>
          </div>
          <div class="flex gap-2">
            <span class="font-medium">Статус:</span>
            <span>{{ userProfile?.status }}</span>
          </div>
          <div class="flex gap-2">
            <span class="font-medium">Дата регистрации:</span>
            <span>{{ formatDate(userProfile?.created_at) }}</span>
          </div>
          <div class="flex gap-2">
            <span class="font-medium">Дата онбординга:</span>
            <span v-if="userProfile?.onboarded_at">{{ formatDate(userProfile?.onboarded_at) }}</span>
            <span v-else>Не выполнен</span>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">
          Информация о пользователе не найдена
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue"
import { useChatStore } from "@/store/chatStore"
import { formatDate } from "@/helpers/date"
import { useRoute } from 'vue-router'
import { useUserStore } from "@/store/userStore"

const route = useRoute()
const chatStore = useChatStore()
const userStore = useUserStore()

const messages = computed(() => chatStore.messages)

const userProfile = computed(() => userStore.userProfile)

onMounted(async () => {
  const chatId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  if (chatId) {
    chatStore.setChat(+chatId)
    userStore.setUserProfile(+chatId)
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
