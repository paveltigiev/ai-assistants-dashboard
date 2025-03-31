<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Чаты</h1>
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Пользователь</TableHead>
            <TableHead>Роль</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Дата регистрации</TableHead>
            <TableHead>Дата онбординга</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="userProfiles.length">
            <template v-for="row in userProfiles" :key="row.telegram_id">
              <TableRow class="cursor-pointer" @click="showChat(row.telegram_id)">
                <TableCell>{{ `${row.profile.first_name} ${row.profile.last_name}` }}</TableCell>
                <TableCell>{{ row.role }}</TableCell>
                <TableCell>{{ row.status }}</TableCell>
                <TableCell>{{ formatDate(row.created_at) }}</TableCell>
                <TableCell>{{ formatDate(row.onboarded_at) }}</TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell colspan="3" class="h-24 text-center">
              Нет пользователей
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
import { useUserStore } from "@/store/userStore"
import { formatDate } from "@/helpers/date"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const router = useRouter()
const userStore = useUserStore();
const userProfiles = computed(() => userStore.userProfiles)

const showChat = (telegram_id: number) => router.push(`/chats/${telegram_id}`)

onMounted(async () => userStore.setUserProfiles())
</script>

<style>
</style>