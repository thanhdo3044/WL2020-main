import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import routes from './routes'
import {
  LoadingBar
} from 'quasar'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const Router = new VueRouter({
  scrollBehavior: () => ({
    x: 0,
    y: 0
  }),
  routes,

  // Leave these as they are and change in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  // mode: 'history',
  base: process.env.VUE_ROUTER_BASE
})
Router.beforeEach((to, from, next) => {
  LoadingBar.start()
  let userInfoLocal = JSON.parse(localStorage.getItem('userInfo'))
  if (userInfoLocal) {
    store.dispatch('base/AUTO_LOGIN', userInfoLocal)
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (userInfoLocal) {
      next()
    } else {
      next({
        path: '/access-denied'
      })
    }
  } else {
    next()
  }
})
Router.afterEach((to, from) => {
  LoadingBar.stop()
})
export default Router
