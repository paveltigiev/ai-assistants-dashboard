<script setup lang="ts">
import { onMounted, computed, watch } from "vue"
import { useRouter } from 'vue-router'
import { useUserStore } from "@/store/userStore"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getStatusLabel, getStatusVariant } from '@/utils/labels'
import { formatDate } from "@/utils/date"
import { Badge } from '@/components/ui/badge'
import { useSettingsStore } from '@/store/settingsStore'

const router = useRouter()
const userStore = useUserStore();
const userProfiles = computed(() => userStore.userProfiles)
const settingsStore = useSettingsStore();

const showChat = (user_id: number) => router.push(`/users/${user_id}`)

// Watch for workspace changes
watch(() => settingsStore.currentWorkspace, async () => {
  await userStore.setUserProfiles()
})

onMounted(async () => {
  userStore.setUserProfiles()
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Пользователи</h1>
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
            <template v-for="row in userProfiles" :key="row.id">
              <TableRow  @click="showChat(row.id)" class="cursor-pointer">
                <TableCell>{{ `${row.profile.first_name || ''} ${row.profile.last_name || ''}` }}</TableCell>
                <TableCell>{{ row.role }}</TableCell>
                <TableCell>
                  <Badge :variant="getStatusVariant(row.status)">
                    {{ getStatusLabel(row.status) }}
                  </Badge>
                </TableCell>
                <TableCell>{{ row.created_at ? formatDate(row.created_at) : '-' }}</TableCell>
                <TableCell>{{ row.onboarded_at ? formatDate(row.onboarded_at) : '-' }}</TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell colspan="5" class="h-24 text-center">
              Загрузка пользователей...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<style>
</style>
