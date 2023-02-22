import { getAuth, onAuthStateChanged } from 'firebase/auth'
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
      path: '/sign-up',
      name: 'SignUp',
      component: () => import('../views/Auth/index').then(x => x.SignUp),
      meta: { title: 'PJF - Sign Up' },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('../views/Auth/Settings/index').then(x => x.Settings),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('../views/Auth/Settings/index').then(x => x.Profile),
          meta: { title: 'PJF - Profile' },
        },
        {
          path: 'shipping',
          name: 'Shipping',
          component: () => import('../views/Auth/Settings/index').then(x => x.Shipping),
          meta: { title: 'PJF - Shipping' },
        },
        {
          path: 'orderHistory',
          name: 'OrderHistory',
          component: () => import('../views/Auth/Settings/index').then(x => x.orderHistory),
          meta: { title: 'PJF - Order History' },
        },
      ],
    },
    // 404 page
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
    },
    // No Permission
    {
      path: '/no-permission',
      name: 'NoPermission',
      component: () => import('../views/NoPermission.vue'),
    },

  ],
})

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title)

  if (nearestWithTitle) {
    let title = 'PJF'
    if (typeof nearestWithTitle.meta.title === 'string')
      title = nearestWithTitle.meta.title

    document.title = title
  }
  else {
    const title = 'PJF'
    document.title = title
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user)
        next()

      else
        next({ name: 'NoPermission' })
    })
  }
  else {
    next()
  }
})

export default router
