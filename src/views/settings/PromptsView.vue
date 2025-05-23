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
import { Info } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useForm, useField } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { createPrompt, updatePrompt } from '@/api/settingsService'
import type { Prompt } from '@/types/settingsTypes'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuthStore } from '@/store/authStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const authStore = useAuthStore()
const profile = computed(() => authStore.profile)

interface FormValues {
  role: string
  prompt: string
  workspace_id?: number
  greetings?: string
  image?: string
}

type CreatePrompt = Omit<Prompt, 'id'>

const settingsStore = useSettingsStore();
const prompts = computed(() => settingsStore.prompts)

// Watch for workspace changes
watch(() => settingsStore.currentWorkspace, async () => {
  await settingsStore.setPrompts()
})

const formSchema = toTypedSchema(z.object({
  role: z.string().min(1, 'Название обязательно'),
  prompt: z.string().min(1, 'Промпт обязателен'),
}))

const form = useForm<FormValues>({
  validationSchema: formSchema,
  initialValues: {
    role: '',
    prompt: '',
    greetings: '',
    image: ''
  }
})

const { value: role } = useField<string>('role')
const { value: prompt } = useField<string>('prompt')
const { value: greetings } = useField<string>('greetings')
const { value: image } = useField<string>('image')
const { value: workspace_id } = useField<number>('workspace_id')

const selectedPrompt = ref<Prompt | null>(null)
const isDialogOpen = ref(false)

const isAdmin = computed(() => profile.value?.role === 'admin')
const workspaces = computed(() => settingsStore.workspaces)

const handleRowClick = (row: Prompt) => {
  selectedPrompt.value = row
  role.value = row.role
  prompt.value = row.prompt
  greetings.value = row.greetings
  image.value = row.image ?? ''
  workspace_id.value = row.workspace_id
  isDialogOpen.value = true
}

const handleCreate = () => {
  selectedPrompt.value = null
  role.value = ' '
  prompt.value = ' '
  greetings.value = ''
  image.value = ''
  workspace_id.value = isAdmin.value ? undefined : profile.value.workspace_id
  isDialogOpen.value = true
}

const onSubmit = async () => {
  prompt.value = prompt.value.trim()
  role.value = role.value.trim()
  const { valid } = await form.validate()
  if (valid) {
    if (selectedPrompt.value) {
      const updatedPrompt: Prompt = {
        id: selectedPrompt.value.id,
        role: role.value,
        prompt: prompt.value,
        workspace_id: workspace_id.value || profile.value.workspace_id,
        greetings: greetings.value,
        image: image.value
      }
      await updatePrompt(updatedPrompt)
    } else {
      const newPrompt: CreatePrompt = {
        role: role.value,
        prompt: prompt.value,
        workspace_id: workspace_id.value || profile.value.workspace_id,
        greetings: greetings.value,
        image: image.value
      }
      await createPrompt(newPrompt)
    }
    await settingsStore.setPrompts()
    isDialogOpen.value = false
  }
}

onMounted(async () => {
  settingsStore.setPrompts()
  await authStore.fetchProfile()
  if (isAdmin.value) {
    await settingsStore.setWorkspaces()
  }
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Промпты</h1>
      <Button @click="handleCreate">Создать промпт</Button>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Приветствие</TableHead>
            <TableHead>Промпт</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="prompts.length">
            <template v-for="row in prompts" :key="row.id">
              <TableRow class="cursor-pointer" @click="handleRowClick(row)">
                <TableCell class="w-1/12">
                  <img :src="row.image" alt="Image" class="h-10 rounded-md" v-if="row.image">
                </TableCell>
                <TableCell class="w-2/12">
                  <TooltipProvider v-if="row.role === 'system'">
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <div class="flex items-center gap-1">
                          <span class="text-blue-500">{{ row.role }}</span>
                          <Info class="h-4 w-4 text-gray-500" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Системный промпт, подставляется во все вопросы ассистенту</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider v-else-if="row.role === 'scheduler'">
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <div class="flex items-center gap-1">
                          <span class="text-blue-500">{{ row.role }}</span>
                          <Info class="h-4 w-4 text-gray-500" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Системный промпт, подставляется во все рассылки</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider v-else-if="row.role === 'master'">
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <div class="flex items-center gap-1">
                          <span class="text-orange-500">{{ row.role }}</span>
                          <Info class="h-4 w-4 text-gray-500" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Используется если промпт пользователя не найден</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <span v-else>{{ row.role }}</span>
                </TableCell>
                <TableCell class="w-3/12">{{ row.greetings ? row.greetings.slice(0, 150) : '-' }}{{ row.greetings && row.greetings.length > 150 ? '...' : '' }}</TableCell>
                <TableCell class="w-6/12">{{ row.prompt.slice(0, 300) }}{{ row.prompt.length > 300 ? '...' : '' }}</TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell colspan="3" class="h-24 text-center">
              Нет промптов. Создайте новый промпт.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ selectedPrompt ? 'Редактировать промпт' : 'Создать промпт' }}</DialogTitle>
          <DialogDescription>
            {{ selectedPrompt ? 'Редактирование существующего промпта' : 'Создание нового промпта' }}
          </DialogDescription>
        </DialogHeader>

        <div class="mb-1 flex items-center gap-2 border rounded-lg px-2 py-2" v-if="selectedPrompt?.role === 'system'">
          <Info class="h-4 w-4" />
          <div class="text-xs">
            Промпт с названием <strong class="text-blue-500">system</strong> используется как системный и подставляется во все вопросы ассистенту
          </div>
        </div>

        <div class="mb-1 flex items-center gap-2 border rounded-lg px-2 py-2" v-if="selectedPrompt?.role === 'scheduler'">
          <Info class="h-4 w-4" />
          <div class="text-xs">
              Промпт с названием <strong class="text-blue-500">scheduler</strong> используется как системный и подставляется во все рассылки
          </div>
        </div>

        <div class="mb-1 flex items-center gap-2 border rounded-lg px-2 py-2" v-if="selectedPrompt?.role === 'master'">
          <Info class="h-4 w-4" />
          <div class="text-xs">
            Промпт с названием <strong class="text-orange-500">master</strong> используется если промпт пользователя не найден
          </div>
        </div>

        <form @submit.prevent="onSubmit" class="space-y-4">
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

          <FormField name="role">
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input v-model="role" placeholder="Введите название" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="greetings">
            <FormItem>
              <FormLabel>Приветствие</FormLabel>
              <FormControl>
                <Textarea v-model="greetings" placeholder="Введите приветствие" />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="prompt">
            <FormItem>
              <FormLabel>Промпт</FormLabel>
              <FormControl>
                <Textarea
                  v-model="prompt"
                  placeholder="Введите промпт"
                  class="min-h-[200px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="image">
            <FormItem>
              <FormLabel>Изображение</FormLabel>
              <FormControl>
                <Input v-model="image" placeholder="Введите изображение" />
              </FormControl>
            </FormItem>
          </FormField>

          <div class="flex justify-end gap-2">
            <Button type="button" variant="outline" @click="isDialogOpen = false">
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style>
</style>