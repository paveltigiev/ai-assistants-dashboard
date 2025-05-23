<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function handleSubmit() {
  try {
    loading.value = true
    error.value = null
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (signInError) throw signInError
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

// Check if user is already authenticated
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    const redirectPath = route.query.redirect as string || '/'
    router.push(redirectPath)
  }
})
</script>

<template>
  <div class="flex justify-center flex-col items-center gap-6">
    <div class="flex w-full max-w-sm flex-col gap-6">
      <div class="flex flex-col gap-6">
        <Card>
          <CardHeader class="text-center">
            <CardTitle class="text-xl">
              Вход в систему
            </CardTitle>
            <CardDescription>
              <!-- Введите свою почту, чтобы получить ссылку для входа в систему -->
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="handleSubmit">
              <div class="grid gap-6">
                <div class="grid gap-2">
                  <Label html-for="email">Email</Label>
                  <Input
                    id="email"
                    v-model="email"
                    type="email"
                    placeholder="admin@mail.com"
                    required
                  />
                  <div class="flex items-center">
                    <Label html-for="password">Пароль</Label>
                    <router-link
                      to="/signInWithOtp"
                      class="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Забыли пароль?
                  </router-link>
                  </div>
                  <Input
                    id="password"
                    v-model="password"
                    type="password"
                    placeholder="********"
                    required
                  />
                  <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
                </div>
                <Button type="submit" class="w-full" :disabled="loading">
                  {{ loading ? 'Отправка...' : 'Войти' }}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <div class="text-center text-sm">
          Если у вас нет аккаунта, вы можете
          <router-link to="/signup" class="underline underline-offset-4">
            зарегистрироваться
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
