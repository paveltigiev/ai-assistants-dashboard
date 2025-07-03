<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Рассылки</h1>
      <Button @click="handleCreate">Создать рассылку</Button>
    </div>
    

    <div class="filters flex gap-2 mb-4">
      <div class="filter">
        <Input v-model="daysFilter" placeholder="Фильтр по дням" />
      </div>
      <div class="filter">
        <Select v-model="roleFilter">
          <SelectTrigger>
            <SelectValue placeholder="Фильтр по роли" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="role in roles" :key="role.id" :value="role.role">
              {{ role.role }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button @click="resetFilters" variant="outline">Сбросить фильтры</Button>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Роль</TableHead>
            <TableHead>День</TableHead>
            <TableHead>Время</TableHead>
            <TableHead>Изображение</TableHead>
            <TableHead>Промпт</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="schedulers.length">
            <template v-for="row in filteredSchedulers" :key="row.id">
              <TableRow class="cursor-pointer" @click="handleRowClick(row)">
                <TableCell class="w-1/12">{{ row.role }}</TableCell>
                <TableCell class="w-1/12">{{ row.days_after }}</TableCell>
                <TableCell class="w-1/12">{{ row.time }}</TableCell>
                <TableCell class="w-1/12">
                  <img v-if="row.image_url" :src="row.image_url" class="w-16 h-16 object-cover rounded" />
                  <span v-else>-</span>
                </TableCell>
                <TableCell class="w-8/12">{{ row.prompt && row.prompt.length > 300 ? row.prompt.slice(0, 300) : row.prompt }}{{ row.prompt && row.prompt.length > 300 ? '...' : '' }}</TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell colspan="5" class="h-24 text-center">
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
          <FormField name="time">
            <FormItem>
              <FormLabel>Время</FormLabel>
              <FormControl>
                <Input
                  v-model="time"
                  placeholder="ЧЧ:ММ"
                  maxlength="5"
                  @input="handleTimeInput"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="image">
            <FormItem>
              <FormLabel>Изображение</FormLabel>
              <FormControl>
                <div class="flex flex-col gap-2">
                  <img v-if="imagePreview" :src="imagePreview" class="w-32 h-32 object-cover rounded" />
                  <Input 
                    type="file" 
                    accept="image/*" 
                    @change="handleImageUpload"
                    class="cursor-pointer"
                  />
                </div>
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
          <FormField name="workspace_id" v-if="isAdmin">
            <FormItem>
              <FormLabel>Workspace</FormLabel>
              <FormControl>
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
              <Button type="submit" :disabled="isLoading"> {{isLoading ? 'Сохраняется...' : 'Сохранить'}} </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from "vue"
import { useSettingsStore } from "@/store/settingsStore"
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
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabaseClient'
import { formatTimeInput } from '@/utils/timeFormat'

import type { Scheduler } from '@/types/settingsTypes'

interface FormValues {
  role: string
  days_after: number
  time: string
  prompt: string
  workspace_id: number
  image_url?: string
}

type CreateScheduler = Omit<Scheduler, 'id'>

const roles = computed(() => settingsStore.roles)
const imagePreview = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const isLoading = ref(false)

const roleFilter = ref('')
const daysFilter = ref('')
const filteredSchedulers = ref<Scheduler[]>([])
const authStore = useAuthStore()
const settingsStore = useSettingsStore();
const schedulers = computed(() => settingsStore.schedulers)


const profile = computed(() => authStore.profile)

const isAdmin = computed(() => profile.value?.role === 'admin')
const workspaces = computed(() => settingsStore.workspaces)

const formSchema = toTypedSchema(z.object({
  role: z.string().min(1, 'Роль обязательна'),
  days_after: z.number().min(0, 'Количество дней обязательно'),
  time: z.string().min(0, 'Время обязательно'),
  prompt: z.string().min(1, 'Промпт обязателен'),
}))

const form = useForm<FormValues>({
  validationSchema: formSchema,
  initialValues: {
    role: '',
    days_after: 0,
    time: '09:00',
    prompt: '',
    workspace_id: 0
  }
})

const { value: role } = useField<string>('role')
const { value: days_after } = useField<number>('days_after')
const { value: time } = useField<string>('time')
const { value: prompt } = useField<string>('prompt')
const { value: workspace_id } = useField<number>('workspace_id')
const { value: image_url } = useField<string | undefined>('image_url')

const selectedScheduler = ref<Scheduler | null>(null)
const isDialogOpen = ref(false)

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0]
    imagePreview.value = URL.createObjectURL(input.files[0])
  }
}

const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = fileName

    const { error: uploadError } = await supabase.storage
      .from('scheduler-images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('scheduler-images')
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

const handleRowClick = (row: Scheduler) => {
  selectedScheduler.value = row
  role.value = row.role
  days_after.value = row.days_after
  time.value = row.time
  prompt.value = row.prompt
  workspace_id.value = row.workspace_id
  image_url.value = row.image_url
  imagePreview.value = row.image_url || null
  isDialogOpen.value = true
}

const handleCreate = () => {
  selectedScheduler.value = null
  role.value = roles.value.length > 0 ? roles.value[0].role : ''
  days_after.value = 0
  time.value = '09:00'
  prompt.value = ' '
  image_url.value = undefined
  imagePreview.value = null
  selectedFile.value = null
  isDialogOpen.value = true
  workspace_id.value = profile.value.workspace_id
}

const handleDelete = async (row: Scheduler) => {
  if (confirm('Вы уверены, что хотите удалить эту рассылку?')) {
    await deleteScheduler(row.id)
    await settingsStore.setSchedulers()
    isDialogOpen.value = false
  }
}

const handleTimeInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  const formattedValue = formatTimeInput(input.value)
  time.value = formattedValue
}

const onSubmit = async () => {
  isLoading.value = true
  prompt.value = prompt.value.trim()
  const { valid } = await form.validate()
  if (valid) {
    let imageUrl = image_url.value

    if (selectedFile.value) {
      const uploadedUrl = await uploadImage(selectedFile.value)
      if (uploadedUrl) {
        imageUrl = uploadedUrl
      }
    }

    if (selectedScheduler.value) {
      const updatedScheduler: Scheduler = {
        id: selectedScheduler.value.id,
        role: role.value,
        days_after: days_after.value,
        time: time.value,
        prompt: prompt.value,
        workspace_id: workspace_id.value,
        image_url: imageUrl
      }
      await updateScheduler(updatedScheduler)
    } else {
      const newScheduler: CreateScheduler = {
        role: role.value,
        days_after: days_after.value,
        time: time.value,
        prompt: prompt.value,
        workspace_id: profile.value.workspace_id,
        image_url: imageUrl
      }
      await createScheduler(newScheduler)
    }
    await settingsStore.setSchedulers()
    isDialogOpen.value = false
  }
  isLoading.value = false
}

// Watch for workspace changes
watch(() => settingsStore.currentWorkspace, async () => {
  await settingsStore.setSchedulers()
})

watch(() => workspace_id.value, async (newWorkspaceId) => {
  if (newWorkspaceId) {
    await settingsStore.setRoles()
  }
})

watch(() => roleFilter.value, async () => {
  filterSchedulers()
})
watch(() => daysFilter.value, async () => {
  filterSchedulers()
})

const resetFilters = () => {
  roleFilter.value = ''
  daysFilter.value = ''
  filterSchedulers()
}

const filterSchedulers = () => {
  filteredSchedulers.value = schedulers.value.filter((scheduler) => {
    const roleMatch = !roleFilter.value || scheduler.role.toLowerCase().includes(roleFilter.value.toLowerCase())
    const daysMatch = !daysFilter.value || scheduler.days_after.toString() === daysFilter.value
    return roleMatch && daysMatch
  })
}

onMounted(async () => {
  await authStore.fetchProfile()
  await settingsStore.setSchedulers()
  filterSchedulers()
  
  if (profile.value) {
    workspace_id.value = profile.value.workspace_id
  }
})
</script>

<style>
</style>