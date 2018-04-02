import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import { Notification, Table, TableColumn } from 'element-ui'
import App from './App'
import router from './router'
import store from '../store'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(Table)
Vue.use(TableColumn)
Vue.prototype.$notify = Notification
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
