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
const loading = ref(false)
const error = ref<string | null>(null)

async function handleSubmit() {
  try {
    loading.value = true
    error.value = null
    
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    })

    if (signInError) throw signInError

    // Show success message
    alert('Проверьте ваш email для входа в систему')
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

// Check if user is already authenticated
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    // Get the redirect path from query parameters or default to dashboard
    const redirectPath = route.query.redirect as string || '/dashboard'
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
              Добро пожаловать, админ!
            </CardTitle>
            <CardDescription>
              Введите свой email, чтобы получить ссылку для входа в систему
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
                    placeholder="m@example.com"
                    required
                  />
                  <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
                </div>
                <Button type="submit" class="w-full" :disabled="loading">
                  {{ loading ? 'Отправка...' : 'Получить доступ' }}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <div class="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
          Авторизуясь, вы соглашаетесь с нашими <a href="#">Условиями использования</a>
          и <a href="#">Политикой конфиденциальности</a>.
        </div>
      </div>
    </div>
  </div>
</template>
