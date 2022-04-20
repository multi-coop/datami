import Vue from 'vue'
import Vuex from 'vuex'
import { user } from '@/store/user.js'
import { data } from '@/store/data.js'
import { filters } from '@/store/filters.js'
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
    setGitInfos (state, gitInfosObject) {
      // console.log('S-index > M > setGitInfos > gitInfosObject : ', gitInfosObject)
      const index = state.gitInfos.findIndex(item => item.uuid === gitInfosObject.uuid)
      if (index !== -1) {
        Vue.set(state.gitInfos, index, gitInfosObject)
      } else {
        state.gitInfos.push(gitInfosObject)
      }
    },
    setFileOptions (state, fileOptionsObject) {
      const index = state.fileOptions.findIndex(item => item.uuid === fileOptionsObject.uuid)
      if (index !== -1) {
        Vue.set(state.fileOptions, index, fileOptionsObject)
      } else {
        state.fileOptions.push(fileOptionsObject)
      }
    },
    setFileInfos (state, fileReqInfosObject) {
      // console.log('S-index > M > setFileInfos > fileReqInfosObject : ', fileReqInfosObject)
      const index = state.fileReqInfos.findIndex(item => item.uuid === fileReqInfosObject.uuid)
      if (index !== -1) {
        Vue.set(state.fileReqInfos, index, fileReqInfosObject)
      } else {
        state.fileReqInfos.push(fileReqInfosObject)
      }
    }
  },
  actions: {
    buildGitInfos ({ commit }, gitUrl) {
      // console.log('S-index > A > buildGitInfos > gitUrl : ', gitUrl)
      const gitInfosObject = extractGitInfos(gitUrl)
      // console.log('S-index > A > buildGitInfos > gitInfosObject : ', gitInfosObject)
      commit('setGitInfos', gitInfosObject)
    },
    addGitInfos ({ commit }, gitInfosObject) {
      commit('setGitInfos', gitInfosObject)
    },
    addFileOptions ({ commit }, fileOptionsObject) {
      commit('setFileOptions', fileOptionsObject)
    },
    addFileReqInfos ({ commit }, fileReqInfos) {
      commit('setFileInfos', fileReqInfos)
    }
  }
}

export const store = new Vuex.Store({
  ...defaultStore,
  modules: {
    'git-translations': translations,
    'git-user': user,
    'git-filters': filters,
    'git-data': data
  }
})
