import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/",
      name: "DashboardLayout",
      component: () => import("@/layouts/DashboardLayout.vue"),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue')
        },
        {
          path: '/users',
          name: 'Users',
          component: () => import('@/views/users/UsersView.vue')
        },
        {
          path: '/chats/:id',
          name: 'Chat',
          component: () => import('@/views/chats/ChatView.vue')
        }
      ]
    },
    {
      path: '/signin',
      name: 'CleanLayout',
      component: () => import('@/layouts/CleanLayout.vue'),
      children: [
        {
          path: '/signin',
          name: 'signin',
          component: () => import('@/views/auth/SignIn.vue')
        },
        {
          path: '/terms',
          name: 'terms',
          component: () => import('@/views/static/TermsPage.vue')
        }
      ]
    }
  ]
})

// Navigation guard to check authentication
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  // If the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If user is not authenticated, redirect to signin
    if (!session) {
      next({
        path: '/signin',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    // If user is authenticated and tries to access signin page, redirect to dashboard
    if (session && to.path === '/signin') {
      next({ path: '/dashboard' })
    } else {
      next()
    }
  }
})

export default router
