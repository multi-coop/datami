import Vue from 'vue'
// import { Vue } from '.'
// import Vuex from 'vuex'
// import { user } from '@/store/user.js'
// import { data } from '@/store/data.js'
// import { filters } from '@/store/filters.js'
// import { sortings } from '@/store/sortings.js'
// import { translations } from '@/store/translations.js'
// import { storage } from '@/store/storage.js'

import { extractGitInfos } from '@/utils/utilsGitUrl.js'

// Vue.use(Vuex)

export const defaultStore = {
  state: {
    showTooltip: false,
    tooltipOptions: undefined,
    scrolled: { top: 0 },
    gitInfos: [],
    fileOptions: [],
    fileReqInfos: [],
    fileEditNavbar: [],
    trackAllOutlinks: [],
    urlMulti: 'https://multi.coop',
    urlDatamiWebiste: 'https://datami.multi.coop',
    urlDocumentation: 'https://datami-docs.multi.coop',
    urlSourceCode: 'https://gitlab.com/multi-coop/datami-project/datami',
    urlReportIssue: 'https://gitlab.com/multi-coop/datami-project/datami/-/issues/new'
  },
  getters: {
    getGitObj: (state) => {
      return state.gitInfos
    },
    getGitInfosObj: (state) => (uuid) => {
      const gitInfosObj = state.gitInfos.find(gitObj => gitObj.uuid === uuid)
      return gitInfosObj
    },
    getFileOptionsObj: (state) => (uuid) => {
      const fileOptionsObj = state.fileOptions.find(options => options.uuid === uuid)
      return fileOptionsObj
    },
    getFileReqInfosObj: (state) => (uuid) => {
      const fileReqInfosObj = state.fileReqInfos.find(fileReq => fileReq.uuid === uuid)
      return fileReqInfosObj
    },
    getFileEditNavbarStatus: (state) => (uuid) => {
      const fileEditNavbar = state.fileEditNavbar.find(fileEditStatus => fileEditStatus.uuid === uuid)
      return fileEditNavbar && fileEditNavbar.status
    },
    getTrackAllOutlinks: (state) => (uuid) => {
      const trackAllOutlinks = state.trackAllOutlinks.find(trackOutlinks => trackOutlinks.uuid === uuid)
      return trackAllOutlinks && trackAllOutlinks.val
    },
    buildNewBranchName: (state) => (filefullname, fileId) => {
      const now = Date.now()
      const today = new Date(now)
      const stringDate = today.toISOString().substring(0, 10)
      const fileFullnameClean = filefullname.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')
      return `datami-${stringDate}-${fileFullnameClean}-${fileId}`
    }
  },
  mutations: {
    setShowTooltip (state, bool) {
      state.showTooltip = bool
    },
    setTooltipOptions (state, options) {
      state.tooltipOptions = options
    },
    setScrolled (state, scrolled) {
      state.scrolled = scrolled
    },
    setState (state, { key, data }) {
      // console.log('S-index > M > setGitInfos > gitInfosObject : ', gitInfosObject)
      const index = state[key].findIndex(item => item.uuid === data.uuid)
      if (index !== -1) {
        Vue.set(state[key], index, data)
      } else {
        state[key].push(data)
      }
    }
  },
  actions: {
    showTooltip ({ commit }, options) {
      commit('setShowTooltip', true)
      commit('setTooltipOptions', options)
    },
    hideTooltip ({ commit }) {
      commit('setShowTooltip', false)
      commit('setTooltipOptions', undefined)
    },
    updateScrolled ({ commit }, scrolled) {
      commit('setScrolled', scrolled)
    },
    buildGitInfos ({ commit }, gitUrl) {
      // console.log('S-index > A > buildGitInfos > gitUrl : ', gitUrl)
      const gitInfosObject = extractGitInfos(gitUrl)
      // console.log('S-index > A > buildGitInfos > gitInfosObject : ', gitInfosObject)
      commit('setState', { key: 'gitInfos', data: gitInfosObject })
    },
    addGitInfos ({ commit }, gitInfosObject) {
      commit('setState', { key: 'gitInfos', data: gitInfosObject })
    },
    addFileOptions ({ commit }, fileOptionsObject) {
      // console.log('S-index > A > addFileOptions > fileOptionsObject : ', fileOptionsObject)
      commit('setState', { key: 'fileOptions', data: fileOptionsObject })
    },
    addFileReqInfos ({ commit }, fileReqInfos) {
      commit('setState', { key: 'fileReqInfos', data: fileReqInfos })
    },
    toggleEditNavbar ({ commit }, fileEditNavbar) {
      // console.log('S-index > A > toggleEditNavbar > fileEditNavbar : ', fileEditNavbar)
      commit('setState', { key: 'fileEditNavbar', data: fileEditNavbar })
    },
    activateTrackAllOutlinks ({ commit }, fileTrackOutlinks) {
      commit('setState', { key: 'trackAllOutlinks', data: fileTrackOutlinks })
    }
  }
}

// export const store = new Vuex.Store({
//   ...defaultStore,
//   modules: {
//     'git-translations': translations,
//     'git-user': user,
//     'git-filters': filters,
//     'git-sortings': sortings,
//     'git-data': data,
//     'git-storage': theme
//   }
// })
