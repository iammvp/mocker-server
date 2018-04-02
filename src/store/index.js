import Vue from 'vue'
import Vuex from 'vuex'
import { ipcRenderer } from 'electron'
import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})

// for use vuex between windows
// import master state
try {
  store.replaceState(ipcRenderer.sendSync('vuex-connect'))
  // console.log('master state imported!')
} catch (error) {
  throw error
  // console.log('import master state failed: %s', error)
}
const { commit } = store

store.commit = (...args) => {
  ipcRenderer.send('vuex-mutation', args)
}

store.dispatch = (...args) => {
  // nextTick hack to simulate dispatch behavior
  Vue.nextTick(() => {
    // console.log(content, payload)
    ipcRenderer.send('vuex-action', args)
  })
}

ipcRenderer.on('vuex-apply-mutation', (event, {type, payload}) => {
  commit(type, payload)
})

ipcRenderer.on('vuex-error', (event, error) => console.error(error))

// export to global
window.commit = store.commit
window.state = store.state
export default store
