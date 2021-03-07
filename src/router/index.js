import Vue from 'vue'
import Router from 'vue-router'

import Login from 'views/login/Login'
import Layout from '@/layout/index'


Vue.use(Router)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: '/userorderlist',
        component: () => import('views/user/OrderList')
      },
      {
        path: '/receiverorderlist',
        component: () => import('views/receiver/ReceiverOrderList')
      },
      {
        path: '/receivermanage',
        component: () => import('views/receiver/ReceiverManage')
      },
      {
        path: '/bannermanage',
        component: () => import('views/banner/BannerManage')
      }
    ]
  }

]

const router = new Router({
  routes,
  /*  mode: 'history' */
})

export default router