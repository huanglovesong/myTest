import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import server from '@/components/common/server'
import center from '@/components/common/center'
import scanPay from '@/components/scanPay'
import paying from '@/components/paying'
import order from '@/components/order'
import orderDetail from '@/components/orderDetail'
import getCardNo from '@/components/getCardNo'
import hf from '@/components/hf'
import qb from '@/components/qb'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name:'home',
      component: home,
    },
    {
      path: '/server/:id',
      name: 'server',
      component: server
    },
    {
      path: '/center',
      name: 'center',
      component: center,
      meta:{
        keepAlive: true
      },
      props: true
    },
    {
      path: '/scanpay',
      name: 'scanPay',
      component: scanPay
    },
    {
      path: '/pay',
      name: 'pay',
      component: paying
    },
    {
      path: '/order',
      name: 'order',
      component: order
    },
    {
      path: '/showOrder',
      name: 'orderDetails',
      component: orderDetail
    },
    {
      path: '/getcard',
      name: 'getCardNo',
      component: getCardNo
    },
   /*  {
      path: '/hf',
      name: 'hf',
      component: hf
    }, */
    {
      path: '/qb',
      name: 'qb',
      component: qb
    },
    {
      path:'*',
      component:home
    }
  ]
})
