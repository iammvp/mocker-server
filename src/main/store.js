// steal from https://github.com/vuejs/vuex/issues/92#issuecomment-212012430
// for use vuex between windows
import Vue from 'vue'
import Vuex from 'vuex'
import { ipcMain } from 'electron'

import modules from '../store/modules'

Vue.use(Vuex)

const clients = []

const store = new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
store.subscribe((mutation, state) => {
  clients.forEach(client => {
    client.send('vuex-apply-mutation', mutation)
  })
})

ipcMain.on('vuex-connect', (event) => {
  const win = event.sender
  const winId = win.id
  win.on('destroyed', () => {
    clients[winId] = null
    delete clients[winId]
  })
  clients[winId] = event.sender
  event.returnValue = store.state
})

ipcMain.on('vuex-mutation', (event, args) => {
  try {
    store.commit(...args)
  } catch (error) {
    event.sender.send('vuex-error', error)
  }
})

ipcMain.on('vuex-action', (event, args) => {
  try {
    store.dispatch(...args)
  } catch (error) {
    event.sender.send('vuex-error', error)
  }
})

global.state = store.state
global.commit = store.commit
