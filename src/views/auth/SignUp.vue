<script setup lang="ts">
import { ref } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function registerUser(event: Event) {
  event.preventDefault();
  const emailValue = email.value;
  const passwordValue = password.value;
  const { data: invitation, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("email", email.value)
    .eq("used", false)
    .single()

  if (error) {
    alert("Для регистрации вам нужно получить приглашение.");
    throw new Error("Нет приглашения");
  }

  const { data: { user }, error: authError } = await supabase.auth.signUp({
    email: emailValue,
    password: passwordValue,
  });

  if (authError) throw authError;

  if (!user) {
    throw new Error("User registration failed");
  }

  await supabase.from("profiles").insert([
    {
      user_id: user.id,
      workspace_id: invitation.workspace_id,
      email: emailValue,
      role: "user"
    },
  ]);

  await supabase
    .from("invitations")
    .update({ used: true })
    .eq("id", invitation.id);

  alert('Регистрация прошла успешно! Проверьте почту для подтверждения.')
  router.push('/signin')
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
              Регистрация в системе
            </CardTitle>
            <CardDescription>
              Введите свой email, на который вы получили приглашение
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="registerUser">
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
                  <Label html-for="password">Пароль</Label>
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
                  {{ loading ? 'Отправка...' : 'Зарегистрироваться' }}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <div class="text-center text-sm">
          Если у вас есть аккаунт, вы можете
          <router-link to="/signin" class="underline underline-offset-4">
            войти
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
