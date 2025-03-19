<script setup lang="ts">
// import SearchForm from '@/components/SearchForm.vue'
import VersionSwitcher from '@/components/VersionSwitcher.vue'
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
  type SidebarProps,
  SidebarRail,
} from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'
import { Button } from '@/components/ui/button'

const props = defineProps<SidebarProps>()

const mode = useColorMode()

const data = {
  versions: ['@delikat_onboarding'],
  navMain: [
    {
      title: 'Чаты и сообщения',
      url: '#',
      items: [
        {
          title: 'Чаты с пользователями',
          url: '#',
          isActive: true,
        },
        {
          title: 'Статистика использования',
          url: '#',
        },
      ],
    },
    {
      title: 'Настройки',
      url: '#',
      items: [
        {
          title: 'База знаний',
          url: '#',
        },
        {
          title: 'инструкции',
          url: '#',
        },
      ],
    }
  ],
}
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
              <SidebarMenuButton as-child :is-active="childItem.isActive">
                <a :href="childItem.url">{{ childItem.title }}</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarRail />

    <div class="relative flex w-full min-w-0 flex-col p-2">
      <div>
        <DropdownMenu>
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
  </Sidebar>
</template>