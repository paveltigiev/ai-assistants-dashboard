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
            <TableHead v-if="isAdmin">Workspace</TableHead>
            <TableHead v-if="isAdmin">Роль</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="profiles.length">
            <template v-for="row in profiles" :key="row.id" >
              <TableRow @click="editManager(row)" :class="[isAdmin ? 'cursor-pointer' : '']">
                <TableCell>{{ row.email }}</TableCell>
                <TableCell v-if="isAdmin">{{ workspaces.find(w => w.id === row.workspace_id)?.name || row.workspace_id }}</TableCell>
                <TableCell v-if="isAdmin">{{ row.role }}</TableCell>
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

    <!-- Модалка редактирования -->
    <Dialog v-model:open="showModal">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать менеджера</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <div>
            <Label class="text-sm font-medium">Email</Label>
            <Input type="email" v-model="selectedManager.email" class="input" disabled />
          </div>
          <div>
            <Label class="text-sm font-medium">Workspace ID</Label>
            <Select v-model="selectedManager.workspace_id">
              <SelectTrigger>
                <SelectValue placeholder="Выберите workspace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="workspace in workspaces" :key="workspace.id" :value="workspace.id">
                  {{ workspace.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label class="text-sm font-medium">Роль</label>
            <Select v-model="selectedManager.role">
              <SelectTrigger>
                <SelectValue placeholder="Выберите роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="role in roles" :key="role" :value="role">
                  {{ role }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="flex justify-end gap-2">
            <Button @click="showModal = false" class="btn">Отмена</Button>
            <Button @click="saveManager" class="btn-primary">Сохранить</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue"
import { fetchProfiles, updateProfile } from '@/api/settingsService'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from "@/components/ui/label"
import type { Profile } from '@/types/settingsTypes'

import { useSettingsStore } from "@/store/settingsStore"
const settingsStore = useSettingsStore()

const authStore = useAuthStore()
const profile = computed(() => authStore.profile)
const workspaces = computed(() => settingsStore.workspaces)
const isAdmin = ref(false)
const profiles = computed(() => settingsStore.profiles)
const roles = ref(['admin', 'user'])

const showModal = ref(false)
const selectedManager = ref<Partial<Profile>>({})

function editManager(row: Profile) {
  selectedManager.value = { ...row }
  showModal.value = true
}

async function saveManager() {
  if (!selectedManager.value.id) return
  await updateProfile(selectedManager.value as Profile)
  showModal.value = false
  await settingsStore.setProfiles()
}

// Watch for workspace changes
watch(() => settingsStore.currentWorkspace, async () => {
  await settingsStore.setProfiles()
})

onMounted(async () => {
  await settingsStore.setProfiles()
  await authStore.fetchProfile()
  isAdmin.value = profile.value.role === 'admin'
})
</script>

<style>
</style>