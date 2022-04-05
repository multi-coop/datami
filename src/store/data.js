import { viewModes } from '@/utils/fileTypesUtils.js'

export const data = {
  namespaced: true,
  state: {
    test: 'data module',
    loadedData: {},
    tokens: {},
    reloading: [],

    preview: [],
    edit: [],
    diff: []

  },
  getters: {
    getLoadedData: (state) => (fileId) => {
      return state.loadedData[fileId]
    },
    fileNeedsReload: (state) => (fileId) => {
      // console.log('S-data > G > fileNeedsReload > state.reloading : ', state.reloading)
      return state.reloading.includes(fileId)
    },
    getFileToken: (state) => (fileId) => {
      return state.tokens[fileId]
    },
    getViewMode: (state) => (fileId) => {
      if (state.preview.includes(fileId)) return 'preview'
      if (state.diff.includes(fileId)) return 'diff'
      if (state.edit.includes(fileId)) return 'edit'
    }
  },
  mutations: {
    setState (state, { key, fileId, data }) {
      // console.log('\nS-data > M > setState > key : ', key)
      // console.log('S-data > M > setState > fileId : ', fileId)
      // console.log('S-data > M > setState > data : ', data)
      state[key][fileId] = data
      // console.log('S-data > M > setState > state : ', state)
    },
    addToState (state, { key, fileId }) {
      state[key].push(fileId)
    },
    removeFromState (state, { key, fileId }) {
      state[key] = state[key].filter(id => id !== fileId)
    }
  },
  actions: {
    updateLoadedData ({ commit }, { fileId, data }) {
      commit('setState', { key: 'loadedData', fileId: fileId, data: data })
    },
    updateReloading ({ commit }, { fileId, isLoading }) {
      // console.log('\nS-data > A > updateReloading > fileId : ', fileId)
      // console.log('S-data > A > updateReloading > isLoading : ', isLoading)
      if (isLoading) {
        commit('addToState', { key: 'reloading', fileId: fileId })
      } else {
        commit('removeFromState', { key: 'reloading', fileId: fileId })
      }
    },
    updateToken ({ commit }, { fileId, token }) {
      // console.log('S-data > A > updateToken > fileId : ', fileId)
      commit('setState', { key: 'tokens', fileId: fileId, data: token })
    },
    changeViewMode ({ commit }, { fileId, mode }) {
      // console.log('S-data > A > changeViewMode > fileId : ', fileId)
      // console.log('S-data > A > changeViewMode > mode : ', mode)
      commit('addToState', { key: mode, fileId: fileId })
      const switchOffModes = viewModes.filter(v => v !== mode)
      switchOffModes.forEach(v => {
        commit('removeFromState', { key: v, fileId: fileId })
      })
    }
  }
}
