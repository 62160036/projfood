import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/About.vue'),
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: () => import('../views/Auth/SignUp.vue'),
    },
  ],
})

export default router
