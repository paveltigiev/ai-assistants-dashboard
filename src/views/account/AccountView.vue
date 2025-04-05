<template>
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-semibold">Аккаунт</h1>
  </div>
  <div class="max-w-md">
    <Card>
      <CardHeader class="">
        <CardTitle class="text-xl">
          Сброс пароля
        </CardTitle>
        <CardDescription>
          Есливы хотите изменить пароль, введите новый пароль и подтвердите его.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="updatePassword">
          <div class="grid gap-6">
            <div class="grid gap-2">
              <Label html-for="newPassword">Новый пароль</Label>
              <Input
                id="newPassword"
                v-model="newPassword"
                type="password"
                required
              />
              <Label html-for="confirmNewPassword">Еще раз новый пароль</Label>
              <Input
                id="confirmNewPassword"
                v-model="confirmNewPassword"
                type="password"
                required
              />
              <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
            </div>
            <Button type="submit" class="w-full">Задать новый пароль</Button>
          </div>
        </form>
      </CardContent>
    </Card>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const newPassword = ref('');
const confirmNewPassword = ref('');

import { supabase } from '@/lib/supabaseClient'

async function updatePassword() {
  if (newPassword.value !== confirmNewPassword.value) {
    alert('New passwords do not match!');
    return;
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword.value,
    });

    if (error) {
      alert(`Error updating password: ${error.message}`);
      return;
    }

    alert('Password updated successfully!');
  } catch (err) {
    console.error('Unexpected error:', err);
    alert('An unexpected error occurred. Please try again.');
  }
}
</script>

<style lang="scss" scoped>
</style>
