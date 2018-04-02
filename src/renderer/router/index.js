import Vue from 'vue'
import Router from 'vue-router'

import List from '../components/ListPage/ListIndex.vue'
import AddSchema from '../components/AddSchemaPage/AddSchemaIndex.vue'
import AddJSON from '../components/AddJSONPage/AddJSONIndex.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'list-page',
      component: List
    },
    {
      path: '/add-schema',
      name: 'add-schema-page',
      component: AddSchema
    },
    {
      path: '/add-json',
      name: 'add-json-page',
      component: AddJSON
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
