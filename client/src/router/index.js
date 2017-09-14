import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Register from '@/components/Register'
import Feedback from '@/components/Feedback'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Feedback',
      component: Feedback
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
  ]
})
