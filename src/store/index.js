import Vue from 'vue'
import Vuex from 'vuex'
import { user } from '@/store/user.js'
import { data } from '@/store/data.js'
import { filters } from '@/store/filters.js'

import { extractGitInfos } from '@/utils/utilsGitUrl.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    test: 'testing',
    gitInfos: undefined
  },
  getters: {
  },
  mutations: {
    setGitInfos (state, gitInfos) {
      // console.log('S-index > M > setGitInfos > gitInfos : ', gitInfos)
      state.gitInfos = gitInfos
    }
  },
  actions: {
    getGitInfos ({ commit }, gitUrl) {
      // console.log('S-index > A > getGitInfos > gitUrl : ', gitUrl)
      const gitInfos = extractGitInfos(gitUrl)
      // console.log('S-index > A > getGitInfos > gitInfos : ', gitInfos)
      commit('setGitInfos', gitInfos)
    }
  },
  modules: {
    'git-user': user,
    'git-filters': filters,
    'git-data': data
  }
})
