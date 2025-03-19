<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Чаты</h1>
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Пользователь</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Количество сообщений</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="chats.length">
            <template v-for="row in chats" :key="chats.chat_id">
              <TableRow class="cursor-pointer" @click="showChat(row.chat_id)">
                <TableCell>{{ row.name }}</TableCell>
                <TableCell>{{ row.created_at }}</TableCell>
                <TableCell>{{ row.message_count }}</TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell colspan="3" class="h-24 text-center">
              Нет чатов
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue"
import { useRouter } from 'vue-router'
import { useChatStore } from "@/store/chatStore"
import { formatDate } from "@/helpers/date"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const router = useRouter()

const chatStore = useChatStore();

const chats = computed(() => {
  const data = chatStore.chats.map((chat) => {
    return {
      username: chat.users[chat.users.length - 1],
      created_at: formatDate(chat.created_at),
      message_count: chat.message_count,
      agent: chat.agent,
      chat_id: chat.chat_id,
      name: chat.first_name + ' ' + chat.last_name,
      user_id: chat.user_id
    }
  })
  return data
})

const showChat = (chatId: number) => {
  router.push(`/chats/${chatId}`)
}

onMounted(async () => {
  chatStore.setChats()
})
</script>

<style>

</style>