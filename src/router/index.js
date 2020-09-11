import Vue from 'vue'
import VueRouter from 'vue-router'
import BaseView from '@/layout/BaseView'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: BaseView,
    redirect: '/develop',
    children: [
      {
        path: '/dashboard',
        name: '仪表盘',
        icon: 'dashboard',
        component: () => import('@/pages/dashboard/index'),
      },
      {
        path: '/develop',
        name: '任务开发',
        icon: 'code',
        component: () => import('@/pages/develop/index'),
      },
      {
        path: '/admin',
        name: '系统管控',
        icon: 'setting',
        component: () => import('@/pages/admin/index'),
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
