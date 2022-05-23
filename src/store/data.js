import Vue from 'vue'
import { editModes, viewModes } from '@/utils/fileTypesUtils.js'

export const data = {
  namespaced: true,
  state: {
    loadedData: {},
    tokens: {},

    // IO
    reloading: [],
    saving: [],
    committing: [],
    downloading: [],

    // EDIT MODES
    preview: [],
    edit: [],
    diff: [],

    // VIEW MODES
    cards: [],
    table: [],

    // DATA STORED
    buffer: [],
    notifications: [],
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
    fileNeedsDownloading: (state) => (fileId) => {
      return state.downloading.includes(fileId)
    },
    getFileToken: (state) => (fileId) => {
      return state.tokens[fileId]
    },
    getEditViewMode: (state) => (fileId) => {
      if (state.preview.includes(fileId)) return 'preview'
      if (state.diff.includes(fileId)) return 'diff'
      if (state.edit.includes(fileId)) return 'edit'
    },
    getViewMode: (state) => (fileId) => {
      if (state.cards.includes(fileId)) return 'cards'
      if (state.table.includes(fileId)) return 'table'
    },
    fileIsCommitting: (state) => (fileId) => {
      return state.committing.includes(fileId)
    },
    getCommitData: (state) => (fileId) => {
      // console.log('\nS-data > G > getCommitData > state.buffer : ', state.buffer)
      return state.buffer.find(commitData => commitData.uuid === fileId)
    },
    getReqNotifications: (state) => (fileId) => {
      // console.log('\nS-data > G > getReqNotifications > state.notifications : ', state.notifications)
      const fielNotifs = state.notifications.find(notif => notif.uuid === fileId)
      return fielNotifs && fielNotifs.data
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
    addToNotifications (state, reqNotifs) {
      const index = state.notifications.findIndex(notifs => notifs.uuid === reqNotifs.uuid)
      if (index !== -1) {
        Vue.set(state.notifications, index, reqNotifs)
      } else {
        state.notifications.push(reqNotifs)
      }
      // console.log('S-data > M > addToNotifications > state.notifications : ', state.notifications)
    },
    removeFromNotifications (state, reqNotifs) {
      // console.log('S-data > M > removeFromNotifications > state.notifications : ', state.notifications)
      state.errors = state.notifications.filter(notifs => notifs.uuid !== reqNotifs.uuid)
      // console.log('S-data > M > removeFromNotifications > state.notifications : ', state.notifications)
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
    updateDownloading ({ commit }, { fileId, isDownloading }) {
      console.log('\nS-data > A > updateDownloading > fileId : ', fileId)
      if (isDownloading) {
        commit('addToState', { key: 'downloading', fileId: fileId })
      } else {
        commit('removeFromState', { key: 'downloading', fileId: fileId })
      }
    },
    updateCommitting ({ commit }, { fileId, isCommitting, data }) {
      console.log('\nS-data > A > updateCommitting > fileId : ', fileId)
      console.log('S-data > A > updateCommitting > isCommitting : ', isCommitting)
      console.log('S-data > A > updateCommitting > data : ', data)
      const reqNotifsData = { uuid: fileId }

      if (isCommitting) {
        commit('addToState', { key: 'committing', fileId: fileId })
        commit('removeFromNotifications', reqNotifsData)
      } else {
        // spread data into notifs
        // const notifBranch = {
        //   action: 'addBranch',
        //   data: data.respPostBranch
        // }
        // const notifCommit = {
        //   action: 'addCommit',
        //   data: data.respPutCommit
        // }
        // const notifMergeRequest = {
        //   action: 'addMergeRequest',
        //   data: data.respPostMergeRequest
        // }
        // const notifs = [
        //   notifBranch,
        //   notifCommit,
        //   notifMergeRequest
        // ]
        reqNotifsData.data = [data]

        console.log('S-data > A > updateCommitting > reqNotifsData : ', reqNotifsData)
        commit('removeFromState', { key: 'committing', fileId: fileId })
        commit('addToNotifications', reqNotifsData)
      }
    },
    updateToken ({ commit }, { fileId, token }) {
      commit('setState', { key: 'tokens', fileId: fileId, data: token })
    },
    changeEditViewMode ({ commit }, { fileId, mode }) {
      // console.log('S-data > M > changeEditViewMode > mode : ', mode)
      commit('addToState', { key: mode, fileId: fileId })
      const switchOffModes = editModes.filter(v => v !== mode)
      switchOffModes.forEach(v => {
        commit('removeFromState', { key: v, fileId: fileId })
      })
    },
    changeViewMode ({ commit }, { fileId, mode }) {
      // console.log('S-data > M > changeViewMode > mode : ', mode)
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
