<template>
  <div class="flex items-start gap-4">
    <div class="w-2/3">
      <Card>
        <CardHeader>
          <CardTitle>История чата</CardTitle>
          <CardDescription>Чат агента с пользователем</CardDescription>
        </CardHeader>
        <CardContent class="">
          <div class="chat">
            <div v-for="message in messages" :key="message.id" class="messages">
              <div :class="['message', { 'user-message': message.role === 'user', 'assistant-message': message.role === 'assistant' }]">
                <div class="message__header">
                  <div class="message__header-username">{{ message.username }}</div>
                  <div class="message__header-time">{{ formatDate(message.created_at) }}</div>
                </div>
                <div class="message__content">{{ message.text }}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <div class="user-info w-1/3">
      <Card>
        <CardHeader>
          <div class="flex justify-between items-center">
            <div>
              <CardTitle>Пользователь</CardTitle>
              <CardDescription>Информация о пользователе</CardDescription>
            </div>
            <Button @click="editUser" class="">
              <Icon icon="heroicons:pencil" class="mr-2" />
              Редактировать
            </Button>
          </div>
        </CardHeader>
        <CardContent class="relative">
          <div v-if="userProfile" class="space-y-2">
            <div class="flex gap-2">
              <span class="font-medium">Имя:</span>
              <span>{{ userProfile?.profile?.first_name }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-medium">Фамилия:</span>
              <span>{{ userProfile?.profile?.last_name }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-medium">Telegram ID:</span>
              <span>{{ userProfile?.telegram_id }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-medium">Username:</span>
              <span><a :href="`https://t.me/${userProfile?.profile?.username}`" target="_blank">@{{ userProfile?.profile?.username }}</a></span>
            </div>
            <div class="flex gap-2">
              <span class="font-medium">Роль:</span>
              <span>{{ userProfile?.role }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-medium">Статус:</span>
              <Badge :variant="getStatusVariant(userProfile?.status)">
                {{ getStatusLabel(userProfile?.status) }}
              </Badge>
            </div>
            <div class="flex gap-2">
              <span class="font-medium">Дата регистрации:</span>
              <span>{{ formatDate(userProfile?.created_at) }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-medium">Дата онбординга:</span>
              <span v-if="userProfile?.onboarded_at">{{ formatDate(userProfile?.onboarded_at) }}</span>
              <span v-else>Не выполнен</span>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">
            Информация о пользователе не найдена
          </div>

        </CardContent>
      </Card>
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
import { useChatStore } from "@/store/chatStore"
import { useRoute } from 'vue-router'
import { useUserStore } from "@/store/userStore"
import { Input } from '@/components/ui/input'
import { useForm, useField } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { Button } from '@/components/ui/button'
import { getStatusLabel, getStatusVariant } from '@/utils/labels'
import { formatDate } from "@/utils/date"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
// import type { UserProfile } from '@/types/userTypes'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@iconify/vue'

interface FormValues {
  role: string
  status: string
}

const route = useRoute()
const chatId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
const chatStore = useChatStore()
const userStore = useUserStore()
const isDialogOpen = ref(false)
const messages = computed(() => chatStore.messages)

const userProfile = computed(() => userStore.userProfile)

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

const editUser = () => {
  if (userProfile.value) {
    role.value = userProfile.value.role
    status.value = userProfile.value.status
    isDialogOpen.value = true
  }
}

const onSubmit = async () => {
  const { valid } = await form.validate()
  if (valid && userProfile.value) {
    const updatedUser = {
      ...userProfile.value,
      role: role.value,
      status: status.value,
      onboarded_at: status.value === 'active' && !userProfile.value.onboarded_at 
        ? new Date().toISOString() 
        : userProfile.value.onboarded_at
    }
    await userStore.updateUserProfile(updatedUser)
    await userStore.setUserProfile(+chatId)
    isDialogOpen.value = false
  }
}

onMounted(async () => {
  chatStore.setChat(+chatId)
  userStore.setUserProfile(+chatId)
})
</script>

<style scoped lang="scss">
.messages {
  margin: 0.5rem 0;
  display: flex;
  flex-direction: column;
}

.message {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  position: relative;
  line-height: 1.4;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    gap: 1rem;

    &-username {
      font-size: 0.85rem;
      font-weight: 500;
      opacity: 0.8;
      display: none;
    }
    &-time {
      font-size: 0.75rem;
      opacity: 0.7;
      text-align: right;
    }
  }

  &__content {
    white-space: pre-wrap;
    word-break: break-word;
  }

  &.user-message {
    background-color: #DDFFC0;
    color: #000;
    margin-left: auto;
    border-bottom-right-radius: 0.2rem;
  }

  &.assistant-message {
    background-color: #f0f0f0;
    color: #000;
    margin-right: auto;
    border-bottom-left-radius: 0.2rem;
  }
}

.message-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.chat {
  height: calc(100vh - 8rem);
  overflow-y: auto;
  padding-right: 1rem;
}

.chat::-webkit-scrollbar {
  width: 6px;
}

.chat::-webkit-scrollbar-track {
  background: transparent;
}

.chat::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
} 
</style>
