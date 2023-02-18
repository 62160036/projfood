import { getAuth } from 'firebase/auth'
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

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (getAuth().currentUser) {
      next()
    }
    else {
      alert('You are not logged in!')
      next({ name: 'Home' })
    }
  }
  else {
    next()
  }
})

export default router
