<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate } from "@/utils/date"
import type { Invitation } from '@/types/settingsTypes';
import { useSettingsStore } from "@/store/settingsStore"
import { useAuthStore } from '@/store/authStore'
import { CheckCircle2, XCircle } from 'lucide-vue-next'
const authStore = useAuthStore()

const settingsStore = useSettingsStore()
const profile = computed(() => authStore.profile)
const isAdmin = ref(false)
const email = ref('');
const workspace_id = ref('');
const workspaces = computed(() => settingsStore.workspaces)
const invitations = ref<Invitation[]>([]);

async function fetchInvitations() {
  if (!settingsStore.currentWorkspace?.id) {
    invitations.value = []
    return
  }

  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("workspace_id", settingsStore.currentWorkspace.id)

  if (error) {
    console.error("Error fetching invitations:", error)
    return
  }

  invitations.value = data
}

// Watch for workspace changes
watch(() => settingsStore.currentWorkspace, async () => {
  await fetchInvitations()
})

async function sendInvitation(email: string, workspace_id: string) {
  const { error } = await supabase
    .from("invitations")
    .insert([{ email, workspace_id }]);

  if (error) throw error;
  console.log("Invitation sent!");
  await fetchInvitations(); // Refresh the table after sending an invitation
}

function handleSubmit() {
  sendInvitation(email.value, workspace_id.value)
    .then(() => {
      email.value = '';
      workspace_id.value = '';
      alert("Invitation sent successfully!");
    })
    .catch((error) => {
      console.error("Error sending invitation:", error);
      alert("Failed to send invitation.");
    });
}

onMounted(async() => {
  await fetchInvitations();
  await authStore.fetchProfile()
  isAdmin.value = profile.value.role == 'admin'
  settingsStore.setWorkspaces()
  workspace_id.value = profile.value.workspace_id
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Приглашения</h1>
    </div>

    <div class="flex gap-4">
      <div class="rounded-md border w-2/3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Использован</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="invitations.length">
              <template v-for="row in invitations" :key="row.id">
                <TableRow>
                  <TableCell>{{ row.email }}</TableCell>
                  <TableCell>{{ formatDate(row.created_at) }}</TableCell>
                  <TableCell>
                    <div class="flex items-center gap-2">
                      <CheckCircle2 v-if="row.used" class="h-4 w-4 text-green-500" />
                      <XCircle v-else class="h-4 w-4 text-red-500" />
                    </div>
                  </TableCell>
                </TableRow>
              </template>
            </template>

            <TableRow v-else>
              <TableCell colspan="3" class="h-24 text-center">
                Загрузка приглашений...
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div class="w-1/3">
        <Card>
          <CardHeader class="">
            <CardTitle class="text-xl">
              Новое приглашение
            </CardTitle>
            <CardDescription>
              Введите email и workspace ID, чтобы отправить приглашение
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="handleSubmit">
              <div class="grid gap-6">
                <div class="grid gap-2">
                  <Label for="email">Email</Label>
                  <Input id="email" v-model="email" type="email" placeholder="Введите email" required />

                  <div v-if="isAdmin">
                    <Select v-model="workspace_id">
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
                </div>
                <Button type="submit" class="w-full">Отправить</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
