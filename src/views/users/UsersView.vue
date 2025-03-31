<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Чаты</h1>
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Пользователь</TableHead>
            <TableHead>Роль</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Дата регистрации</TableHead>
            <TableHead>Дата онбординга</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="userProfiles.length">
            <template v-for="row in userProfiles" :key="row.telegram_id">
              <TableRow>
                <TableCell>{{ `${row.profile.first_name} ${row.profile.last_name}` }}</TableCell>
                <TableCell>{{ row.role }}</TableCell>
                <TableCell>
                  <Badge :variant="getStatusVariant(row.status)">
                    {{ getStatusLabel(row.status) }}
                  </Badge>
                </TableCell>
                <TableCell>{{ row.created_at ? formatDate(row.created_at) : '-' }}</TableCell>
                <TableCell>{{ row.onboarded_at ? formatDate(row.onboarded_at) : '-' }}</TableCell>
                <TableCell>
                  <div class="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" @click="editUser(row)">
                      <Icon icon="heroicons:pencil" />
                    </Button>
                    <Button variant="ghost" size="icon" @click="showChat(row.telegram_id)">
                      <Icon icon="heroicons:chat-bubble-bottom-center-text" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell colspan="3" class="h-24 text-center">
              Загрузка пользователей...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Редактировать пользователя</DialogTitle>
          <DialogDescription>
            Изменение данных пользователя
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <FormField name="role">
            <FormItem>
              <FormLabel>Роль</FormLabel>
              <FormControl>
                <Input v-model="role" placeholder="Введите роль" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="status">
            <FormItem>
              <FormLabel>Статус</FormLabel>
              <FormControl>
                <Select v-model="status">
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="init">Новый</SelectItem>
                    <SelectItem value="active">Активный</SelectItem>
                    <SelectItem value="blocked">Заблокирован</SelectItem>
                  </SelectContent>
                </Select>
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
import { useRouter } from 'vue-router'
import { useUserStore } from "@/store/userStore"
import { formatDate } from "@/helpers/date"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
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
import { useForm, useField } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import type { UserProfile } from '@/types/userTypes'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface FormValues {
  role: string
  status: string
}

const router = useRouter()
const userStore = useUserStore();
const userProfiles = computed(() => userStore.userProfiles)

const formSchema = toTypedSchema(z.object({
  role: z.string().min(1, 'Роль обязательна'),
  status: z.enum(['init', 'active', 'blocked'], {
    errorMap: () => ({ message: 'Выберите статус' })
  })
}))

const form = useForm<FormValues>({
  validationSchema: formSchema,
  initialValues: {
    role: '',
    status: ''
  }
})

const { value: role } = useField<string>('role')
const { value: status } = useField<string>('status')

const selectedUser = ref<UserProfile | null>(null)
const isDialogOpen = ref(false)

const showChat = (telegram_id: number) => router.push(`/chats/${telegram_id}`)

const editUser = (user: UserProfile) => {
  selectedUser.value = user
  role.value = user.role
  status.value = user.status
  isDialogOpen.value = true
}

const onSubmit = async () => {
  const { valid } = await form.validate()
  if (valid && selectedUser.value) {
    const updatedUser = {
      ...selectedUser.value,
      role: role.value,
      status: status.value,
      onboarded_at: status.value === 'active' && !selectedUser.value.onboarded_at 
        ? new Date().toISOString() 
        : selectedUser.value.onboarded_at
    }
    await userStore.updateUserProfile(updatedUser)
    await userStore.setUserProfiles()
    isDialogOpen.value = false
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'init':
      return 'secondary'
    case 'active':
      return 'default'
    case 'blocked':
      return 'destructive'
    default:
      return 'default'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'init':
      return 'Новый'
    case 'active':
      return 'Активный'
    case 'blocked':
      return 'Заблокирован'
    default:
      return status
  }
}

onMounted(async () => userStore.setUserProfiles())
</script>

<style>
</style>