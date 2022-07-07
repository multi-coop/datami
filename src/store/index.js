import Vue from 'vue'
import Vuex from 'vuex'
import { user } from '@/store/user.js'
import { data } from '@/store/data.js'
import { filters } from '@/store/filters.js'
import { sortings } from '@/store/sortings.js'
import { translations } from '@/store/translations.js'

import { extractGitInfos } from '@/utils/utilsGitUrl.js'

Vue.use(Vuex)

const defaultStore = {
  state: {
    gitInfos: [],
    fileOptions: [],
    fileReqInfos: []
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
    buildNewBranchName: (state) => (filefullname, fileId) => {
      const now = Date.now()
      const today = new Date(now)
      const stringDate = today.toISOString().substring(0, 10)
      const fileFullnameClean = filefullname.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')
      return `gitribute-${stringDate}-${fileFullnameClean}-${fileId}`
    }
  },
  mutations: {
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
    }
  }
}

export const store = new Vuex.Store({
  ...defaultStore,
  modules: {
    'git-translations': translations,
    'git-user': user,
    'git-filters': filters,
    'git-sortings': sortings,
    'git-data': data
  }
})
