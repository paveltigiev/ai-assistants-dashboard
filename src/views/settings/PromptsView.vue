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
            <TableHead>Название</TableHead>
            <TableHead>Промпт</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="prompts.length">
            <template v-for="row in prompts" :key="row.id">
              <TableRow class="cursor-pointer" @click="handleRowClick(row)">
                <TableCell>{{ row.role }}</TableCell>
                <TableCell>{{ row.prompt.slice(0, 100) }}...</TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell colspan="3" class="h-24 text-center">
              Нет промптов
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
        <form @submit.prevent="onSubmit" class="space-y-4">
          <FormField name="role">
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input v-model="role" placeholder="Введите название" />
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
                  class="min-h-[200px]"
                />
              </FormControl>
              <FormMessage />
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

<script setup lang="ts">
import { onMounted, computed, ref } from "vue"
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useForm, useField } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { createPrompt, updatePrompt } from '@/api/settingsService'
import type { Prompt } from '@/types/settingsTypes'

interface FormValues {
  role: string
  prompt: string
}

type CreatePrompt = Omit<Prompt, 'id'>

const settingsStore = useSettingsStore();
const prompts = computed(() => settingsStore.prompts)

const formSchema = toTypedSchema(z.object({
  role: z.string().min(1, 'Название обязательно'),
  prompt: z.string().min(1, 'Промпт обязателен'),
}))

const form = useForm<FormValues>({
  validationSchema: formSchema,
  initialValues: {
    role: '',
    prompt: ''
  }
})

const { value: role } = useField<string>('role')
const { value: prompt } = useField<string>('prompt')

const selectedPrompt = ref<Prompt | null>(null)
const isDialogOpen = ref(false)

const handleRowClick = (row: Prompt) => {
  selectedPrompt.value = row
  role.value = row.role
  prompt.value = row.prompt
  isDialogOpen.value = true
}

const handleCreate = () => {
  selectedPrompt.value = null
  role.value = ''
  prompt.value = ''
  isDialogOpen.value = true
}

const onSubmit = async () => {
  const { valid } = await form.validate()
  if (valid) {
    if (selectedPrompt.value) {
      const updatedPrompt: Prompt = {
        id: selectedPrompt.value.id,
        role: role.value,
        prompt: prompt.value
      }
      await updatePrompt(updatedPrompt)
    } else {
      const newPrompt: CreatePrompt = {
        role: role.value,
        prompt: prompt.value
      }
      await createPrompt(newPrompt)
    }
    await settingsStore.setPrompts()
    isDialogOpen.value = false
  }
}

onMounted(async () => settingsStore.setPrompts())
</script>

<style>
</style>