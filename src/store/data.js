import Vue from 'vue'
// import { Vue } from '.'
import { editModes, viewModes, isTableExt } from '@/utils/fileTypesUtils.js'

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
    dataviz: [],
    map: [],
    md: [],
    text: [],
    json: [],
    loading: [],

    // SORTING
    sorting: [],

    // FOREIGN KEYS
    shareableFiles: [],
    sharedData: [],
    loadingShared: { loadState: 'waiting' }, // 'waiting' | 'loading' | 'finished'
    loadingExtRessources: { loadState: 'waiting' }, // 'waiting' | 'loading' | 'finished'
    loadedSharedData: [],

    // DATA STORED
    buffer: [],
    notifications: [],
    errors: [],

    // DIFF DATA
    changesFields: [],
    changesData: []
  },
  getters: {
    getSetSharedFiles: (state, getters) => {
      const shareableSetFiles = state.shareableFiles.filter(sh => sh.isSet)
      return shareableSetFiles
    },
    areAllShareableSet: (state) => {
      return state.shareableFiles.every(b => b.isSet)
    },
    isInShareableAndSet: (state) => (ressource) => {
      return state.shareableFiles.filter(file => file.isSet && file.gitfile === ressource)
    },
    isInShareableAndLoaded: (state, getters) => (ressource) => {
      const shareableSet = getters.isInShareableAndSet(ressource)
      return shareableSet.filter(file => file.isLoaded)
    },
    getSharedDatasetByRessource: (state) => (ressource) => {
      return state.sharedData.filter(item => item.ressource === ressource)
    },
    getSharedDatasetByGitfile: (state) => (fromGitfile) => {
      return state.sharedData.filter(item => item.fromGitfile === fromGitfile)
    },
    getFileDataFromStore: (state) => (fileId, key) => {
      return state[key].find(item => item.uuid === fileId || item.fileUrl === fileId)
    },
    readyToCopyRessources: (state, getters) => {
      const setSharedFiles = getters.getSetSharedFiles.filter(sh => !sh.isLoaded)
      return setSharedFiles
    },
    readyToLoadExtRessources: (state) => {
      const shareableFiles = state.shareableFiles.filter(i => i.isSet).map(i => i.gitfile)
      const extRessources = state.sharedData.filter(i => !i.isLoaded && !shareableFiles.includes(i.ressource))
      return extRessources
    },

    // loadedSharedData
    getLoadingStateSharedAndExtRessource: (state) => (key) => {
      if (key === 'loadingShared') return state.loadingShared
      if (key === 'loadingExtRessources') return state.loadingExtRessources
    },
    getLoadedSharedData: (state) => (ressource) => {
      // console.log('\nS-data > G > getLoadedSharedDataField > ressource : ', ressource)
      // console.log('S-data > G > getLoadedSharedDataField > state.loadedSharedData : ', state.loadedSharedData)
      return state.loadedSharedData.find(d => d.ressource === ressource)
    },
    getLoadedSharedDataset: (state, getters) => (ressource) => {
      const loadedData = getters.getLoadedSharedData(ressource)
      return loadedData && loadedData.data
    },
    getLoadedSharedDataField: (state, getters) => (ressource, fields) => {
      // console.log('\nS-data > G > getLoadedSharedDataField > ressource : ', ressource)
      const loadedSharedData = getters.getLoadedSharedDataset(ressource)
      // console.log('S-data > G > getLoadedSharedDataField > loadedSharedData : ', loadedSharedData)
      const loadedField = loadedSharedData && loadedSharedData.headers.find(f => f.name === fields)
      return loadedField
    },
    getLoadedSharedDataItem: (state, getters) => (ressource, fields, value) => {
      // console.log('\nS-data > G > getLoadedSharedDataItem > ressource : ', ressource)
      // console.log('S-data > G > getLoadedSharedDataItem > fields : ', fields)
      // console.log('S-data > G > getLoadedSharedDataItem > value : ', value)
      const loadedField = getters.getLoadedSharedDataField(ressource, fields)
      // console.log('S-data > G > getLoadedSharedDataItem > loadedField : ', loadedField)
      const loadedSharedData = getters.getLoadedSharedDataset(ressource)
      // console.log('S-data > G > getLoadedSharedDataItem > loadedSharedData : ', loadedSharedData)
      const loadedObj = loadedSharedData && loadedSharedData.data.find(d => {
        return d[loadedField.field].toString() === value
      })
      // console.log('S-data > G > getLoadedSharedDataItem > loadedObj : ', loadedObj)
      return {
        headers: loadedSharedData && loadedSharedData.headers,
        item: loadedObj
      }
    },

    // flags
    fileNeedsReload: (state) => (fileId) => {
      return state.reloading.includes(fileId)
    },
    fileNeedsSaving: (state) => (fileId) => {
      return state.saving.includes(fileId)
    },
    fileNeedsDownloading: (state) => (fileId) => {
      return state.downloading.includes(fileId)
    },

    // token
    getFileToken: (state) => (fileId) => {
      return state.tokens[fileId]
    },

    // edit and view modes
    getEditViewMode: (state) => (fileId) => {
      if (state.preview.includes(fileId)) return 'preview'
      if (state.diff.includes(fileId)) return 'diff'
      if (state.edit.includes(fileId)) return 'edit'
    },
    getViewMode: (state) => (fileId) => {
      // console.log('\nS-data > G > getViewMode > fileId : ', fileId)
      // console.log('S-data > G > getViewMode > state.cards : ', state.cards)
      // console.log('S-data > G > getViewMode > state.map : ', state.map)
      if (state.loading.includes(fileId)) return 'loading'
      if (state.cards.includes(fileId)) return 'cards'
      if (state.table.includes(fileId)) return 'table'
      if (state.dataviz.includes(fileId)) return 'dataviz'
      if (state.map.includes(fileId)) return 'map'
      if (state.text.includes(fileId)) return 'text'
      if (state.md.includes(fileId)) return 'md'
      if (state.json.includes(fileId)) return 'json'
      return undefined
    },

    // commits
    fileIsCommitting: (state) => (fileId) => {
      return state.committing.includes(fileId)
    },
    getCommitData: (state) => (fileId) => {
      // console.log('\nS-data > G > getCommitData > state.buffer : ', state.buffer)
      return state.buffer.find(commitData => commitData.uuid === fileId)
    },

    // notifs
    getReqNotifications: (state) => (fileId) => {
      // console.log('\nS-data > G > getReqNotifications > state.notifications : ', state.notifications)
      const fielNotifs = state.notifications.find(notif => notif.uuid === fileId)
      return fielNotifs && fielNotifs.data
    },

    // errors
    checkIfErrorExists: (state) => (error) => {
      const errExists = state.errors.find(err => {
        const sameFileId = err.fileId === error.fileId
        const sameCode = err.code === error.code
        const sameUrl = err.url === error.url
        const sameFunc = err.function === error.function
        const allSame = sameFileId && sameUrl && sameCode && sameFunc
        return allSame
      })
      return !!errExists
    },
    getReqErrors: (state) => (fileId) => {
      // console.log('\nS-data > G > getErrors > state.errors : ', state.errors)
      const fileErrors = state.errors.filter(err => err.fileId === fileId)
      return fileErrors
    },

    // changes
    getChangesFields: (state) => (fileId) => {
      const fileChanges = state.changesFields.find(changes => changes.fileId === fileId)
      return (fileChanges && fileChanges.changes) || []
    },
    getChangesData: (state) => (fileId) => {
      const fileChanges = state.changesData.find(changes => changes.fileId === fileId)
      return (fileChanges && fileChanges.changes) || []
    }
  },
  mutations: {
    setShareableFile (state, gitfileInfos) {
      // console.log('S-data > M > setShareableFile > gitfileInfos : ', gitfileInfos)
      const index = state.shareableFiles.findIndex(fileInfos => fileInfos.gitfile === gitfileInfos.gitfile)
      if (index !== -1) {
        Vue.set(state.shareableFiles, index, gitfileInfos)
      } else {
        state.shareableFiles.push(gitfileInfos)
      }
    },
    setSharedData (state, sharedDataset) {
      // console.log('S-data > M > setSharedData > sharedDataset : ', sharedDataset)
      const index = state.sharedData.findIndex(data => {
        const sameTarget = data.ressource === sharedDataset.ressource
        const sameGitfile = data.fromGitfile === sharedDataset.fromGitfile
        return sameTarget && sameGitfile
      })
      if (index !== -1) {
        Vue.set(state.sharedData, index, sharedDataset)
      } else {
        state.sharedData.push(sharedDataset)
      }
    },
    setLoadingRessources (state, { key, loadInfos }) {
      switch (key) {
        case 'loadingShared':
          state.loadingShared = loadInfos
          break
        case 'loadingExtRessources':
          state.loadingExtRessources = loadInfos
          break
      }
    },
    setLoadedSharedData (state, payload) {
      const index = state.loadedSharedData.findIndex(data => data.ressource === payload.ressource)
      if (index !== -1) {
        Vue.set(state.loadedSharedData, index, payload)
      } else {
        state.loadedSharedData.push(payload)
      }
    },

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
    removeFromState (state, { key, fileId, debug }) {
      // debug && console.log('S-data > A > removeFromState > key : ', key)
      // debug && console.log('S-data > A > removeFromState > 1 > state[key] : ', state[key])
      state[key] = state[key].filter(uuid => uuid !== fileId)
      // debug && console.log('S-data > A > removeFromState > 2 > state[key] : ', state[key])
    },
    addToBuffer (state, commitData) {
      // console.log('S-data > M > addToBuffer > commitData : ', commitData)
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
    addToErrors (state, reqError) {
      state.errors.push(reqError)
    },
    removeFromErrors (state, reqError) {
      state.errors = state.errors.filter(err => err.errorId !== reqError.errorId)
    },
    resetFileErrors (state, fileId) {
      state.errors = state.errors.filter(err => err.fileId !== fileId)
    },
    addToChanges (state, fileChanges) {
      const storeChanges = fileChanges.isFields ? state.changesFields : state.changesData
      const index = storeChanges.findIndex(item => item.uuid === fileChanges.uuid)
      if (index !== -1) {
        Vue.set(storeChanges, index, fileChanges)
      } else {
        storeChanges.push(fileChanges)
      }
      // console.log('S-data > M > addToChanges > storeChanges : ', storeChanges)
    }
  },
  actions: {
    // shareableFiles
    updateShareableFiles ({ commit }, gitfileInfos) {
      const isTableFamily = isTableExt(gitfileInfos.gitfile) || gitfileInfos.isLoaded
      gitfileInfos.isLoaded = !!gitfileInfos.isLoaded
      isTableFamily && commit('setShareableFile', gitfileInfos)
    },
    // sharedData
    updateSharedData ({ commit }, sharedDataset) {
      commit('setSharedData', sharedDataset)
    },
    // loadingRessources
    updateLoadingRessources ({ commit, state, getters }, load) {
      const loadState = load.loadState
      const loadKey = load.key
      const from = load.from
      const payload = {
        key: loadKey,
        loadInfos: {
          loadState: loadState
        }
      }
      const currentLoadState = getters.getLoadingStateSharedAndExtRessource(loadKey)
      let canContinue = !currentLoadState.initiator
      if (loadState === 'loading') {
        canContinue = canContinue && currentLoadState.loadState === 'waiting'
        payload.loadInfos.initiator = from
      }
      // canContinue && console.log('\nS-data > A > updateLoadingRessources > loadState : ', loadState)
      // canContinue && console.log('S-data > A > updateLoadingRessources > loadState : ', loadState)
      // canContinue && console.log('S-data > A > updateLoadingRessources > loadKey : ', loadKey)
      // canContinue && console.log('S-data > A > updateLoadingRessources > from : ', from)
      // canContinue && console.log('S-data > A > updateLoadingRessources > currentLoadState : ', currentLoadState)
      canContinue && commit('setLoadingRessources', payload)
    },

    updateLoadedData ({ commit }, { fileId, data }) {
      commit('setState', { key: 'loadedData', fileId: fileId, data: data })
    },
    updateLoadedSharedData ({ commit }, payload) {
      commit('setLoadedSharedData', payload)
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
      // console.log('\nS-data > A > updateDownloading > fileId : ', fileId)
      if (isDownloading) {
        commit('addToState', { key: 'downloading', fileId: fileId })
      } else {
        commit('removeFromState', { key: 'downloading', fileId: fileId })
      }
    },
    updateCommitting ({ commit }, { fileId, isCommitting, data }) {
      // console.log('\nS-data > A > updateCommitting > fileId : ', fileId)
      // console.log('S-data > A > updateCommitting > isCommitting : ', isCommitting)
      // console.log('S-data > A > updateCommitting > data : ', data)
      const reqNotifsData = { uuid: fileId }

      if (isCommitting) {
        // commit('addToState', { key: 'committing', fileId: fileId })
        // commit('removeFromNotifications', reqNotifsData)
      } else {
        reqNotifsData.data = [data]
        // console.log('S-data > A > updateCommitting > reqNotifsData : ', reqNotifsData)

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
      // console.log('\nS-data > M > changeViewMode > fileId : ', fileId)
      // console.log('S-data > M > changeViewMode > mode : ', mode)
      commit('addToState', { key: mode, fileId: fileId })
      const switchOffModes = viewModes.filter(v => v !== mode)
      // console.log('S-data > M > changeViewMode > switchOffModes : ', switchOffModes)
      switchOffModes.forEach(v => {
        commit('removeFromState', { key: v, fileId: fileId })
      })
    },
    updateBuffer ({ commit }, { gitObj, edited, newBranch, token, addToBuffer }) {
      console.log('\nS-data > A > updateBuffer > gitObj : ', gitObj)
      console.log('S-data > A > updateBuffer > edited : ', edited)
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
    },
    resetReqErrors ({ commit }, fileId) {
      commit('resetFileErrors', fileId)
    },
    updateReqErrors ({ commit }, { error, addToErrors }) {
      if (addToErrors) {
        commit('addToErrors', error)
      } else {
        commit('removeFromErrors', error)
      }
    },
    updateFileChanges ({ commit }, fileChanges) {
      console.log('\nS-data > A > updateReqErrors > fileChanges : ', fileChanges)
      commit('addToChanges', fileChanges)
    }
  }
}
