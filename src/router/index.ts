import { createRouter, createWebHistory } from 'vue-router'
// const isAuthenticated = () => {
//   return !!localStorage.getItem('token')
// }

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
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue')
        },
        {
          path: '/chats',
          name: 'Chats',
          component: () => import('@/views/chats/ChatsView.vue')
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
          component: () => import('@/views/user/SignIn.vue')
        }
      ]
    }
  ]
})

// router.beforeEach(async (to, from, next) => {
//   if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated()) {
//     next({ name: 'login' })
//   } else {
//     next()
//   }
// })

export default router
