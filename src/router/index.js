import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Assessment from '@/components/Assessment'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome
    },
    {
      name: 'assessment',
      component: Assessment,
      path: 'assessment/:id'
    }
  ]
})
