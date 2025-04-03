<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Рассылки</h1>
      <Button @click="handleCreate">Создать рассылку</Button>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Роль</TableHead>
            <TableHead>Дней после</TableHead>
            <TableHead>Время</TableHead>
            <TableHead>Промпт</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="schedulers.length">
            <template v-for="row in schedulers" :key="row.id">
              <TableRow class="cursor-pointer" @click="handleRowClick(row)">
                <TableCell class="w-1/12">{{ row.role }}</TableCell>
                <TableCell class="w-1/12">{{ row.days_after }}</TableCell>
                <TableCell class="w-1/12">{{ row.day_hour }}</TableCell>
                <TableCell class="w-8/12">{{ row.prompt.slice(0, 300) }}{{ row.prompt.length > 300 ? '...' : '' }}</TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell colspan="4" class="h-24 text-center">
              Загрузка рассылок...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ selectedScheduler ? 'Редактировать рассылку' : 'Создать рассылку' }}</DialogTitle>
          <DialogDescription>
            {{ selectedScheduler ? 'Редактирование существующей рассылки' : 'Создание новой рассылки' }}
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <FormField name="role">
            <FormItem>
              <FormLabel>Роль</FormLabel>
                <FormControl>
                  <Select v-model="role">
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="role in roles" :key="role.id" :value="role.role">
                        {{ role.role }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="days_after">
            <FormItem>
              <FormLabel>Дней после</FormLabel>
              <FormControl>
                <Input v-model.number="days_after" placeholder="Введите количество дней" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="day_hour">
            <FormItem>
              <FormLabel>Время</FormLabel>
              <FormControl>
                <Input v-model.number="day_hour" placeholder="Введите время" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="prompt">
            <FormItem>
              <FormLabel>Промпт</FormLabel>
              <FormControl>
                <Textarea
                  v-model="prompt"
                  placeholder="Введите промпт"
                  class="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <div class="flex justify-between gap-2">
            <Button v-if="selectedScheduler" type="button" variant="destructive" @click="handleDelete(selectedScheduler)">
              Удалить
            </Button>
            <div class="flex gap-2">
              <Button type="button" variant="outline" @click="isDialogOpen = false">
                Отмена
              </Button>
              <Button type="submit">Сохранить</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from "vue"
import { useSettingsStore } from "@/store/settingsStore"
import { fetchRoles } from '@/api/settingsService'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useForm, useField } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { createScheduler, updateScheduler, deleteScheduler } from '@/api/settingsService'

import type { Scheduler } from '@/types/settingsTypes'
import type { Role } from '@/types/settingsTypes'

interface FormValues {
  role: string
  days_after: number
  day_hour: number
  prompt: string
  workspace_id: number
}

type CreateScheduler = Omit<Scheduler, 'id'>

const roles = ref<Role[]>([])
const settingsStore = useSettingsStore();
const schedulers = computed(() => settingsStore.schedulers)

const formSchema = toTypedSchema(z.object({
  role: z.string().min(1, 'Роль обязательна'),
  days_after: z.number().min(0, 'Количество дней обязательно'),
  day_hour: z.number().min(0, 'Время обязательно'),
  prompt: z.string().min(1, 'Промпт обязателен'),
}))

const form = useForm<FormValues>({
  validationSchema: formSchema,
  initialValues: {
    role: '',
    days_after: 0,
    day_hour: 0,
    prompt: '',
    workspace_id: 1
  }
})

const { value: role } = useField<string>('role')
const { value: days_after } = useField<number>('days_after')
const { value: day_hour } = useField<number>('day_hour')
const { value: prompt } = useField<string>('prompt')
const { value: workspace_id } = useField<number>('workspace_id')
const selectedScheduler = ref<Scheduler | null>(null)
const isDialogOpen = ref(false)

const handleRowClick = (row: Scheduler) => {
  selectedScheduler.value = row
  role.value = row.role
  days_after.value = row.days_after
  day_hour.value = row.day_hour
  prompt.value = row.prompt
  workspace_id.value = row.workspace_id
  isDialogOpen.value = true
}

const handleCreate = () => {
  selectedScheduler.value = null
  role.value = ''
  days_after.value = 0
  day_hour.value = 0
  prompt.value = ''
  isDialogOpen.value = true
  workspace_id.value = 1
}

const handleDelete = async (row: Scheduler) => {
  if (confirm('Вы уверены, что хотите удалить эту рассылку?')) {
    await deleteScheduler(row.id)
    await settingsStore.setSchedulers()
    isDialogOpen.value = false
  }
}

const onSubmit = async () => {
  const { valid } = await form.validate()
  if (valid) {
    if (selectedScheduler.value) {
      const updatedScheduler: Scheduler = {
        id: selectedScheduler.value.id,
        role: role.value,
        days_after: days_after.value,
        day_hour: day_hour.value,
        prompt: prompt.value,
        workspace_id: workspace_id.value
      }
      await updateScheduler(updatedScheduler)
    } else {
      const newScheduler: CreateScheduler = {
        role: role.value,
        days_after: days_after.value,
        day_hour: day_hour.value,
        prompt: prompt.value,
        workspace_id: 1
      }
      await createScheduler(newScheduler)
    }
    await settingsStore.setSchedulers()
    isDialogOpen.value = false
  }
}

onMounted(async () => {
  settingsStore.setSchedulers()
  roles.value = await fetchRoles()
})
</script>

<style>
</style>