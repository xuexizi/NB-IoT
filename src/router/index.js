import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import mainPage from '@/components/mainPage'
import realTime from '@/components/realTime'
import hisTime from '@/components/hisTime'
import equipment from '@/components/equipment'
import addWarm from '@/components/addWarm'
import addEquip from '@/components/addEquip'
import equip from '@/components/admin/equip'
import warm from '@/components/admin/warm'
import user from '@/components/admin/user'
import myGreenhouse from '@/components/myGreenhouse'
import greenhouse from '@/components/greenhouse'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/myGreenhouse',
      name: 'myGreenhouse',
      component: myGreenhouse,
      children: [
        { path: '/addW', name: 'addW', component: addWarm },
        { path: '/addE', name: 'addE', component: addEquip },
        { path: '/greenhouse', name: 'greenhouse', component: greenhouse }
      ]
    },
    {
      path: '/mainPage',
      name: 'mainPage',
      component: mainPage,
      children: [
        { path: '/realTime', name: 'realTime', component: realTime },
        { path: '/hisTime/:greenHouseId', name: 'hisTime', component: hisTime },
        { path: '/equipment', name: 'equipment', component: equipment },
        { path: '/addWarm', name: 'addWarm', component: addWarm },
        { path: '/addEquip', name: 'addEquip', component: addEquip },
        { path: '/equip', name: 'equip', component: equip },
        { path: '/warm', name: 'warm', component: warm },
        { path: '/user', name: 'user', component: user }
      ]
    }
  ]
})
