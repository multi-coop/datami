import { viewModes } from '@/utils/fileTypesUtils.js'

export const data = {
  namespaced: true,
  state: {
    loadedData: {},
    tokens: {},

    reloading: [],
    saving: [],

    preview: [],
    edit: [],
    diff: [],

    buffer: []

  },
  getters: {
    getLoadedData: (state) => (fileId) => {
      return state.loadedData[fileId]
    },
    fileNeedsReload: (state) => (fileId) => {
      return state.reloading.includes(fileId)
    },
    fileNeedsSaving: (state) => (fileId) => {
      return state.saving.includes(fileId)
    },
    getFileToken: (state) => (fileId) => {
      return state.tokens[fileId]
    },
    getViewMode: (state) => (fileId) => {
      if (state.preview.includes(fileId)) return 'preview'
      if (state.diff.includes(fileId)) return 'diff'
      if (state.edit.includes(fileId)) return 'edit'
    },
    getCommitData: (state) => (fileId) => {
      console.log('\nS-data > M > setState > state.buffer : ', state.buffer)
      return state.buffer.find(commitData => commitData.uuid === fileId)
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
      state[key] = state[key].filter(uuid => uuid !== fileId)
    },
    addToBuffer (state, commitData) {
      state.buffer.push(commitData)
      // console.log('S-data > M > addToBuffer > state.buffer : ', state.buffer)
    },
    removeFromBuffer (state, commitData) {
      state.buffer = state.buffer.filter(data => data.uuid !== commitData.uuid)
      // console.log('S-data > M > removeFromBuffer > state.buffer : ', state.buffer)
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
    updateSaving ({ commit }, { fileId, isSaving }) {
      if (isSaving) {
        commit('addToState', { key: 'saving', fileId: fileId })
      } else {
        commit('removeFromState', { key: 'saving', fileId: fileId })
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
    },
    updateBuffer ({ commit }, { gitObj, edited, newBranch, token, addToBuffer }) {
      console.log('\nS-data > A > updateBuffer > gitObj : ', gitObj)
      // console.log('S-data > A > updateBuffer > edited : ', edited)
      console.log('S-data > A > updateBuffer > newBranch : ', newBranch)
      console.log('S-data > A > updateBuffer > token : ', token)
      const commitData = { uuid: gitObj.uuid }
      if (addToBuffer) {
        commitData.gitObj = gitObj
        commitData.edited = edited
        commitData.newBranch = newBranch
        commitData.token = token
        commit('addToBuffer', commitData)
      } else {
        commit('removeFromBuffer', commitData)
      }
    }
  }
}
