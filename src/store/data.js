import Vue from 'vue'
import { viewModes } from '@/utils/fileTypesUtils.js'

export const data = {
  namespaced: true,
  state: {
    loadedData: {},
    tokens: {},

    reloading: [],
    saving: [],
    committing: [],

    preview: [],
    edit: [],
    diff: [],

    buffer: [],
    errors: []

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
    fileIsCommitting: (state) => (fileId) => {
      return state.committing.includes(fileId)
    },
    getCommitData: (state) => (fileId) => {
      // console.log('\nS-data > G > getCommitData > state.buffer : ', state.buffer)
      return state.buffer.find(commitData => commitData.uuid === fileId)
    },
    getReqErrors: (state) => (fileId) => {
      // console.log('\nS-data > G > getErrors > state.errors : ', state.errors)
      const fileErrors = state.errors.find(err => err.uuid === fileId)
      return fileErrors && fileErrors.errors
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
      const index = state.buffer.findIndex(item => item.uuid === commitData.uuid)
      if (index !== -1) {
        Vue.set(state.buffer, index, commitData)
      } else {
        state.buffer.push(commitData)
      }
      // console.log('S-data > M > addToBuffer > state.buffer : ', state.buffer)
    },
    removeFromBuffer (state, commitData) {
      state.buffer = state.buffer.filter(data => data.uuid !== commitData.uuid)
      // console.log('S-data > M > removeFromBuffer > state.buffer : ', state.buffer)
    },
    addToErrors (state, reqErrors) {
      const index = state.errors.findIndex(err => err.uuid === reqErrors.uuid)
      if (index !== -1) {
        Vue.set(state.errors, index, reqErrors)
      } else {
        state.errors.push(reqErrors)
      }
      // console.log('S-data > M > addToErrors > state.errors : ', state.errors)
    },
    removeFromErrors (state, reqErrors) {
      // console.log('S-data > M > removeFromErrors > state.errors : ', state.errors)
      state.errors = state.errors.filter(err => err.uuid !== reqErrors.uuid)
      // console.log('S-data > M > removeFromErrors > state.errors : ', state.errors)
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
    updateCommitting ({ commit }, { fileId, isCommitting }) {
      if (isCommitting) {
        commit('addToState', { key: 'committing', fileId: fileId })
      } else {
        commit('removeFromState', { key: 'committing', fileId: fileId })
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
      // console.log('\nS-data > A > updateBuffer > gitObj : ', gitObj)
      // console.log('S-data > A > updateBuffer > edited : ', edited)
      // console.log('S-data > A > updateBuffer > newBranch : ', newBranch)
      // console.log('S-data > A > updateBuffer > token : ', token)
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
    },
    updateReqErrors ({ commit }, { fileId, errors, addToErrors }) {
      // console.log('\nS-data > A > updateReqErrors > fileId : ', fileId)
      // console.log('S-data > A > updateReqErrors > errors : ', errors)
      // console.log('S-data > A > updateReqErrors > addToErrors : ', addToErrors)
      const reqErrorData = {
        uuid: fileId,
        errors: errors
      }
      if (addToErrors) {
        commit('addToErrors', reqErrorData)
      } else {
        commit('removeFromErrors', reqErrorData)
      }
    }
  }
}
