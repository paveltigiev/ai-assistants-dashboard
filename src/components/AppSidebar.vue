<script setup lang="ts">
// import SearchForm from '@/components/SearchForm.vue'
import VersionSwitcher from '@/components/VersionSwitcher.vue'
import NavUser from '@/components/NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  type SidebarProps,
  SidebarRail,
} from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/store/authStore'

const props = defineProps<SidebarProps>()

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const profile = computed(() => authStore.profile)

const route = useRoute()
const mode = useColorMode()

const data = ref({
  versions: ['@delikat_market_info'],
  user: {
    name: 'Manager',
    email: 'manager@mail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Пользователи и чаты',
      url: '#',
      items: [
        // {
        //   title: 'Дашборд',
        //   url: '/dashboard',
        // },
        {
          title: 'Пользователи',
          url: '/users',
        }
      ],
    },
    {
      title: 'Настройки',
      url: '#',
      items: [
        {
          title: 'Промпты',
          url: '/settings/prompts',
        },
        {
          title: 'Рассылки',
          url: '/settings/schedulers',
        }
      ],
    }
  ],
})

onMounted(async () => {
  await authStore.fetchProfile()

  data.value.user.email = user.value.email
  data.value.user.name = profile.value.role == 'admin' ? 'Админ' : 'Менеджер'

  if (profile.value.role == 'admin') {
    data.value.navMain.push(
      {
        title: 'Управление',
        url: '#',
        items: [
          {
            title: 'Менеджеры',
            url: '/managers',
          },
          {
            title: 'Приглашения',
            url: '/managers/invitations',
          }
        ]
      }
    )
  }

})
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <VersionSwitcher
        :versions="data.versions"
        :default-version="data.versions[0]"
      />
      <!-- <SearchForm /> -->
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup v-for="item in data.navMain" :key="item.title">
        <SidebarGroupLabel>{{ item.title }}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="childItem in item.items" :key="childItem.title">
              <SidebarMenuButton as-child :is-active="route.path === childItem.url">
                <router-link :to="childItem.url">{{ childItem.title }}</router-link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter class="p-2">
      <div class="relative flex w-full min-w-0 flex-col ">
        <div class="flex items-center justify-between">
          <DropdownMenu v-if="false">
            <DropdownMenuTrigger as-child>
              <Button variant="outline">
                <Icon icon="radix-icons:moon" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Icon icon="radix-icons:sun" class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span class="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="mode = 'light'">
                Light
              </DropdownMenuItem>
              <DropdownMenuItem @click="mode = 'dark'">
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem @click="mode = 'auto'">
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <NavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>