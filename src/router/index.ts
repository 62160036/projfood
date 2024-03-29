import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'FirstPage',
      component: () => import('@/layout/index').then(x => x.AppIndex),
      children: [
        {
          path: '/',
          name: 'Home',
          component: () => import('@/views/index').then(x => x.PageIndex),
        },
        {
          path: '/view/:id',
          name: 'PageView',
          component: () => import('@/views/index').then(x => x.PageView),
        },
        {
          path: '/view/:id/:name',
          name: 'PageViewName',
          component: () => import('@/views/index').then(x => x.PageViewProduct),
        },
        {
          path: '/sign-up',
          name: 'SignUp',
          component: () => import('@/views/Auth/index').then(x => x.SignUp),
          meta: { title: 'PJF - Sign Up' },
        },
        {
          path: '/settings',
          name: 'Settings',
          component: () => import('@/views/Auth/Settings/index').then(x => x.Settings),
          meta: { requiresAuth: true },
          children: [
            {
              path: 'profile',
              name: 'Profile',
              component: () => import('@/views/Auth/Settings/index').then(x => x.Profile),
              meta: { title: 'PJF - Profile' },
            },
            {
              path: 'shipping',
              name: 'Shipping',
              component: () => import('@/views/Auth/Settings/index').then(x => x.Shipping),
              meta: { title: 'PJF - Shipping' },
            },
            {
              path: 'orderHistory',
              name: 'OrderHistory',
              component: () => import('@/views/Auth/Settings/index').then(x => x.orderHistory),
              meta: { title: 'PJF - Order History' },
            },
          ],
        },
        {
          path: '/payment',
          name: 'Payment',
          component: () => import('@/views/payment/index').then(x => x.Payment),
          meta: { title: 'PJF - Payment' },
        },
      ],
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/layout/index').then(x => x.AppLayout),
      meta: { requiresAdmin: true },
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index').then(x => x.dashboard),
          meta: { title: 'PJF - Dashboard' },
        },
        {
          path: '/user/manage',
          name: 'ManageUser',
          component: () => import('@/views/dashboard/index').then(x => x.userManage),
          meta: { title: 'PJF - Manage User' },
        },
        {
          path: '/product/manage',
          name: 'ManageProduct',
          component: () => import('@/views/dashboard/index').then(x => x.productManage),
          meta: { title: 'PJF - Manage Product' },
        },
        {
          path: '/category/manage',
          name: 'ManageCategory',
          component: () => import('@/views/dashboard/index').then(x => x.categoryManage),
          meta: { title: 'PJF - Manage Category' },
        },
        {
          path: '/order/manage',
          name: 'ManageOrder',
          component: () => import('@/views/dashboard/index').then(x => x.orderManage),
          meta: { title: 'PJF - Manage Order' },
        },
        {
          path: '/report/manage',
          name: 'ManageReport',
          component: () => import('@/views/dashboard/index').then(x => x.reportManage),
          meta: { title: 'PJF - Manage Report' },
        },
      ],
    },

    // 404 page
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/pages/index').then(x => x.NotFound),
      meta: { title: 'PJF - 404 Not Found' },
    },
    // No Permission
    {
      path: '/access-denied',
      name: 'accessDenied',
      component: () => import('@/views/pages/index').then(x => x.Access),
      meta: { title: 'PJF - Access Denied' },
    },

  ],
})

router.beforeEach((to, _from, next) => {
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
      if (user && user.emailVerified)
        next()
      else
        next({ name: 'accessDenied' })
    })
  }
  else if (to.matched.some(record => record.meta.requiresAdmin)) {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdTokenResult().then((idTokenResult) => {
          if (idTokenResult.claims.admin)
            next()
          else
            next({ name: 'accessDenied' })
        })
      }
      else { next({ name: 'accessDenied' }) }
    })
  }
  else { next() }
})

export default router
