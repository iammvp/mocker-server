
import { ipcRenderer } from 'electron'
import db from '../../lib/dataStore'

let timer = null // if server is started, user toggle select, 1500ms delay for restart server
const state = {
  isServerStarted: false,
  schemaLists: [],
  startedLists: []

}

const mutations = {
  LOAD_LIST (state, db) {
    state.schemaLists = [...db]
  },
  ADD_LIST (state, list) {
    state.schemaLists = [list, ...state.schemaLists]
    if (process.type === 'renderer') {
      // hot reload, reset server whenever add new list if sever is started, thanks to xuzhimei
      if (state.isServerStarted) {
        state.startedLists = [list, ...state.startedLists]
        ipcRenderer.send('restartServer')
      }
      ipcRenderer.send('addSchemaSuccess')
    }
  },
  DELETE_LIST (state, id) {
    state.schemaLists = state.schemaLists.filter(list => list._id !== id)
  },
  UPDATE_SELECT (state, {id, list}) {
    state.schemaLists.forEach(s => {
      if (s._id === id) {
        s = Object.assign(s, list)
      }
    })
    if (state.startedLists.filter(s => s._id === id).length !== 0) { // update started lists if updated is already started
      state.startedLists.forEach(s => {
        if (s._id === id) {
          s = Object.assign(s, list)
        }
      })
    }
    // close add window
    if (process.type === 'renderer') {
      // hot reload, reset server whenever change a started schema, thanks to yueshuai
      if (state.isServerStarted === true && state.startedLists.filter(s => s._id === id).length !== 0) {
        ipcRenderer.send('restartServer')
      }
      ipcRenderer.send('addSchemaSuccess')
    }
  },
  TOGGLE_SELECT (state, list) {
    state.schemaLists.forEach(s => {
      if (s._id === list._id) {
        s.isSelect = !s.isSelect
      }
    })
  },
  DELAY_RESTART_SERVER (state) {
    state.startedLists = state.schemaLists.filter(s => s.isSelect === true)
    if (process.type === 'renderer') {
      ipcRenderer.send('restartServer')
    }
  },
  CHANGE_SERVER_STATUS (state) {
    state.isServerStarted = !state.isServerStarted
    if (state.isServerStarted === true) {
      state.startedLists = state.schemaLists.filter(s => s.isSelect === true)
    } else {
      state.startedLists = []
    }
  }
}

const actions = {
  loadLists ({ commit }) {
    // do something async
    db.find({}, function (err, docs) {
      if (err) throw err
      commit('LOAD_LIST', docs)
    })
  },
  addList ({ commit }, list) {
    // do something async
    db.insert(list, function (err, newDocs) {
      if (err) throw err
      commit('ADD_LIST', newDocs)
    })
  },
  deleteList ({ commit }, id) {
    // do something async
    db.remove({_id: id}, function (err, numRemoved) {
      if (err) throw err
      commit('DELETE_LIST', id)
    })
  },
  updateList ({ commit }, {id, list}) {
    // do something async
    db.update({_id: id}, list, function (err, numReplaced) {
      if (err) throw err
      commit('UPDATE_SELECT', {id, list})
    })
  },
  toggleSelect ({ commit, dispatch }, list) {
    // do something async
    db.update({_id: list._id}, { $set: { isSelect: !list.isSelect } }, function (err, numReplaced) {
      if (err) throw err
      commit('TOGGLE_SELECT', list)
      if (state.isServerStarted === true) {
        dispatch('delayRestartSever')
      }
    })
  },
  delayRestartSever ({commit}) {
    // if server is started, user toggle select, 1500ms delay for restart server
    clearTimeout(timer)
    timer = setTimeout(() => {
      commit('DELAY_RESTART_SERVER')
    }, 1500)
  }
}

export default {
  state,
  mutations,
  actions
}
