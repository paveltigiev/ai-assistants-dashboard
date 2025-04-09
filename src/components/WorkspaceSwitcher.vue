<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Check, ChevronsUpDown, GalleryVerticalEnd } from 'lucide-vue-next'
import { ref, onMounted, watch } from 'vue'
import { useSettingsStore } from '@/store/settingsStore'

const props = defineProps<{
  workspaces: any[]
  defaultWorkspace: any
  isAdmin: boolean
}>()

const settingsStore = useSettingsStore()
const selectedWorkspace = ref(props.defaultWorkspace)

// Watch for changes in defaultWorkspace prop
watch(() => props.defaultWorkspace, (newWorkspace) => {
  if (newWorkspace) {
    selectedWorkspace.value = newWorkspace
    settingsStore.currentWorkspace = newWorkspace
  }
})

const saveWorkspace = (workspace: any) => {
  selectedWorkspace.value = workspace
  localStorage.setItem('currentWorkspace', JSON.stringify(workspace))
  settingsStore.currentWorkspace = workspace
}

onMounted(() => {
  const savedWorkspace = localStorage.getItem('currentWorkspace')
  if (savedWorkspace) {
    const parsedWorkspace = JSON.parse(savedWorkspace)
    if (props.workspaces.some(w => w.id === parsedWorkspace.id)) {
      selectedWorkspace.value = parsedWorkspace
      settingsStore.currentWorkspace = parsedWorkspace
    }
  } else if (props.defaultWorkspace) {
    selectedWorkspace.value = props.defaultWorkspace
    settingsStore.currentWorkspace = props.defaultWorkspace
  }
})
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <template v-if="isAdmin">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <SidebarMenuButton
              size="lg"
              class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd class="size-4" />
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                <span class="font-semibold">Workspace</span>
                <span class="">{{ selectedWorkspace?.name }}</span>
              </div>
              <ChevronsUpDown class="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            class="w-[--reka-dropdown-menu-trigger-width]"
            align="start"
          >
            <DropdownMenuItem
              v-for="workspace in workspaces"
              :key="workspace.id"
              @select="saveWorkspace(workspace)"
            >
              {{ workspace.name }}
              <Check v-if="workspace.id === selectedWorkspace?.id" class="ml-auto" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </template>
      <template v-else>
        <SidebarMenuButton size="lg">
          <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <GalleryVerticalEnd class="size-4" />
          </div>
          <div class="flex flex-col gap-0.5 leading-none">
            <span class="font-semibold">{{ selectedWorkspace?.name }}</span>
          </div>
        </SidebarMenuButton>
      </template>
    </SidebarMenuItem>
  </SidebarMenu>
</template> 