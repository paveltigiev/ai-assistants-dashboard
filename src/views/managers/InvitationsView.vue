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
              <TableHead>Workspace</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Использован</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="invitations.length">
              <template v-for="row in invitations" :key="row.id">
                <TableRow>
                  <TableCell class="w-1/12">{{ row.email }}</TableCell>
                  <TableCell class="w-1/12">{{ row.workspace_id }}</TableCell>
                  <TableCell class="w-1/12">{{ row.created_at }}</TableCell>
                  <TableCell class="w-1/12">{{ row.used }}</TableCell>
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
      
      <Card class="w-1/3">
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
            <Input id="email" v-model="email" type="email" placeholder="Enter email" required />

            <Label for="workspace_id">Workspace ID</Label>
            <Input id="workspace_id" v-model="workspace_id" type="text" placeholder="Enter workspace ID" required />
                </div>
            <Button type="submit" class="w-full">Отправить</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
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

import type { Invitation } from '@/types/settingsTypes';

const email = ref('');
const workspace_id = ref('');

const invitations = ref<Invitation[]>([]);

async function fetchInvitations() {
  const { data, error } = await supabase
    .from("invitations")
    .select("*");

  if (error) {
    console.error("Error fetching invitations:", error);
    return;
  }

  invitations.value = data;
}

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

onMounted(() => {
  fetchInvitations(); // Fetch invitations when the component is mounted
});
</script>

<style lang="scss" scoped>

</style>
