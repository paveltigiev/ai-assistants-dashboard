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
                  <div class="message__header-time">{{ formatDate(message.created_at, 'HH:mm DD.MM.YYYY') }}</div>
                </div>
                <div class="message__image" v-if="message.image_url">
                  <img :src="message.image_url" alt="Image" class="w-full h-full object-cover rounded-md">
                </div>
                <div class="message__content">{{ message.text }}</div>
              </div>
            </div>
            <div v-if="!messages.length" class="flex items-center justify-center h-24 text-gray-500">
              Загрузка сообщений...
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <div class="user-info w-1/3">
      <Card>
        <CardContent class="relative mt-4">
          <div v-if="userProfile" class="flex flex-col gap-2">
            <div class="flex gap-2">
              {{ userProfile?.profile?.first_name || '' }} {{ userProfile?.profile?.last_name || '' }}
              <Badge :variant="getStatusVariant(userProfile?.status)">
                {{ getStatusLabel(userProfile?.status) }}
              </Badge>
            </div>
            <div class="flex gap-2">
              <span class="font-medium">Роль:</span>
              <span>{{ userProfile?.role }}</span>
            </div>

            <Button @click="editUser" class="" size="xs" variant="outline">
              <Icon icon="heroicons:pencil" class="" />
              Редактировать
            </Button>
          </div>

        </CardContent>
        
        <hr class="mb-4" />
        
        <CardContent>
          <div v-if="userProfile" class="flex flex-col gap-2">
            <div class="flex gap-2">
              <span class="font-medium">Telegram ID:</span>
              <span>{{ userProfile?.telegram_id }}</span>
            </div>
            <div class="flex gap-2" v-if="userProfile?.profile?.username">
              <span class="font-medium">Username:</span>
              <span><a :href="`https://t.me/${userProfile?.profile?.username}`" target="_blank">@{{ userProfile?.profile?.username }}</a></span>
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
          <FormField name="onboarded_at">
            <FormItem>
              <FormLabel>Дата онбординга</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      class="w-full justify-start text-left font-normal"
                      :class="{ 'text-muted-foreground': !onboarded_at }"
                    >
                      <Icon icon="heroicons:calendar" class="mr-2 h-4 w-4" />
                      {{ onboarded_at ? formatDate(onboarded_at) : 'Выберите дату' }}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <Calendar
                      :model-value="getDateValue(onboarded_at)"
                      @update:model-value="handleDateChange"
                    />
                  </PopoverContent>
                </Popover>
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
import { onMounted, computed, ref, watch } from "vue"
import { useChatStore } from "@/store/chatStore"
import { useRoute } from 'vue-router'
import { useUserStore } from "@/store/userStore"
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
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { parseDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import { useSettingsStore } from '@/store/settingsStore'

const route = useRoute()
const userId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
const chatStore = useChatStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const isDialogOpen = ref(false)
const messages = computed(() => chatStore.messages)
const roles = computed(() => settingsStore.roles)

const userProfile = computed(() => userStore.userProfile)

interface FormValues {
  role: string
  status: string
  onboarded_at: string | null
}

const formSchema = toTypedSchema(z.object({
  role: z.string().min(1, 'Роль обязательна'),
  status: z.enum(['init', 'active', 'blocked'], {
    errorMap: () => ({ message: 'Выберите статус' })
  }),
  onboarded_at: z.string().nullable()
}))

const form = useForm<FormValues>({
  validationSchema: formSchema,
  initialValues: {
    role: '',
    status: '',
    onboarded_at: null
  }
})

const { value: role } = useField<string>('role')
const { value: status } = useField<string>('status')
const { value: onboarded_at } = useField<string | null>('onboarded_at')

const handleDateChange = (date: DateValue | undefined) => {
  onboarded_at.value = date ? new Date(date.toString()).toISOString() : null
}

const getDateValue = (dateString: string | null) => {
  if (!dateString) return undefined
  const date = new Date(dateString)
  return parseDate(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`)
}

const editUser = () => {
  if (userProfile.value) {
    role.value = userProfile.value.role
    status.value = userProfile.value.status
    onboarded_at.value = userProfile.value.onboarded_at
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
      onboarded_at: onboarded_at.value || ''
    }
    await userStore.updateUserProfile(updatedUser)
    await userStore.setUserProfile(+userId)
    isDialogOpen.value = false
  }
}

watch(() => settingsStore.currentWorkspace, async () => {
  await chatStore.setChat(userProfile.value?.telegram_id || 0)
})

onMounted(async () => {
  await userStore.setUserProfile(+userId)
  chatStore.setChat(userProfile.value?.telegram_id || 0)
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
  height: calc(100vh - 14rem);
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
