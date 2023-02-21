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
      component: () => import('../views/Auth/index').then(x => x.SignUp),
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('../views/Auth/Settings/index').then(x => x.Settings),
      children: [
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('../views/Auth/Settings/index').then(x => x.Profile),
        },
        {
          path: 'shipping',
          name: 'Shipping',
          component: () => import('../views/Auth/Settings/index').then(x => x.Shipping),
        },
        {
          path: 'orderHistory',
          name: 'OrderHistory',
          component: () => import('../views/Auth/Settings/index').then(x => x.orderHistory),
        },
      ],
    },
    // 404 page
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
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
