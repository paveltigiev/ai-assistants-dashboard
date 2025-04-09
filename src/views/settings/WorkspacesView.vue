<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Воркспейсы</h1>
    </div>

    <div class="flex gap-4">
      <div class="rounded-md border w-2/3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Название</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="workspaces.length">
              <template v-for="workspace in workspaces" :key="workspace.id">
                <TableRow>
                  <TableCell>{{ workspace.id }}</TableCell>
                  <TableCell>{{ workspace.name }}</TableCell>
                </TableRow>
              </template>
            </template>

            <TableRow v-else>
              <TableCell colspan="2" class="h-24 text-center">
                Загрузка воркспейсов...
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div class="w-1/3">
        <Card>
          <CardHeader>
            <CardTitle class="text-xl">
              Новый воркспейс
            </CardTitle>
            <CardDescription>
              Введите название для нового воркспейса
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="handleSubmit">
              <div class="grid gap-6">
                <div class="grid gap-2">
                  <Label for="name">Название</Label>
                  <Input id="name" v-model="name" type="text" placeholder="Введите название" required />
                </div>
                <Button type="submit" class="w-full">Создать</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useSettingsStore } from '@/store/settingsStore'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const settingsStore = useSettingsStore()
const workspaces = computed(() => settingsStore.workspaces)
const name = ref('')

async function handleSubmit() {
  try {
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("role")
      .single();

    if (!userProfile || userProfile.role !== "admin") {
      throw new Error("Только администратор может создавать воркспейсы!");
    }

    const { error } = await supabase.from("workspaces").insert([{ name: name.value }]);

    if (error) throw error;

    name.value = '';
    await settingsStore.setWorkspaces();
  } catch (error) {
    console.error('Error creating workspace:', error);
    alert(error instanceof Error ? error.message : 'Произошла ошибка при создании воркспейса');
  }
}

onMounted(async () => {
  await settingsStore.setWorkspaces();
})
</script>

<style lang="scss" scoped>
</style>