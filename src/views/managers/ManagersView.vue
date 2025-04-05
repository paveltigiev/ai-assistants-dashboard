<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Менеджеры</h1>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Workspace</TableHead>
            <TableHead>Роль</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="profiles.length">
            <template v-for="row in profiles" :key="row.id">
              <TableRow class="cursor-pointer">
                <TableCell class="w-1/12">{{ row.email }}</TableCell>
                <TableCell class="w-1/12">{{ row.workspace_id }}</TableCell>
                <TableCell class="w-1/12">{{ row.role }}</TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell colspan="4" class="h-24 text-center">
              Загрузка профилей...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
// import { useSettingsStore } from "@/store/settingsStore"
import { fetchProfiles } from '@/api/settingsService'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Profile } from '@/types/settingsTypes'

// const settingsStore = useSettingsStore();

const profiles = ref<Profile[]>([])

onMounted(async () => {
  profiles.value = await fetchProfiles()
})
</script>

<style>
</style>