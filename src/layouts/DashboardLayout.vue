<script setup lang="ts">
  import AppSidebar from '@/components/AppSidebar.vue'
  import { useRoute } from 'vue-router'
  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from '@/components/ui/breadcrumb'
  import { Separator } from '@/components/ui/separator'
  import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
  } from '@/components/ui/sidebar'
  import { RouterView } from 'vue-router'

  const route = useRoute()

  const getBreadcrumbItems = () => {
    const pathSegments = route.path.split('/').filter(Boolean)
    
    return pathSegments.map((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/')
      const title = segment.charAt(0).toUpperCase() + segment.slice(1)
      
      return {
        title,
        path,
        isLast: index === pathSegments.length - 1
      }
    })
  }
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Главная</BreadcrumbLink>
            </BreadcrumbItem>
            <template v-for="(item, _index) in getBreadcrumbItems()" :key="item.path">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink v-if="!item.isLast" :href="item.path">
                  {{ item.title }}
                </BreadcrumbLink>
                <BreadcrumbPage v-else>{{ item.title }}</BreadcrumbPage>
              </BreadcrumbItem>
            </template>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4">
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>