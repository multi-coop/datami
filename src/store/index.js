import Vue from 'vue'
import Vuex from 'vuex'
import { user } from '@/store/user.js'
import { data } from '@/store/data.js'
import { filters } from '@/store/filters.js'
import { translations } from '@/store/translations.js'

import { extractGitInfos } from '@/utils/utilsGitUrl.js'

Vue.use(Vuex)

// export default new Vuex.Store({
//   state: {
//     test: 'testing',
//     gitInfos: []
//   },
//   getters: {
//     getGitObj: (state) => {
//       return state.gitInfos
//     },
//     getGitInfosObj: (state) => (id) => {
//       const gitInfosObj = state.gitInfos.find(gitObj => gitObj.id === id)
//       return gitInfosObj
//     }
//   },
//   mutations: {
//     setGitInfos (state, gitInfosObject) {
//       // console.log('S-index > M > setGitInfos > gitInfosObject : ', gitInfosObject)
//       const index = state.gitInfos.findIndex(item => item.id === gitInfosObject.id)
//       if (index !== -1) {
//         Vue.set(state.gitInfos, index, gitInfosObject)
//       } else {
//         state.gitInfos.push(gitInfosObject)
//       }
//       // state.gitInfos[gitInfosObject.id] = gitInfosObject
//     }
//   },
//   actions: {
//     getGitInfos ({ commit }, gitUrl) {
//       // console.log('S-index > A > getGitInfos > gitUrl : ', gitUrl)
//       const gitInfosObject = extractGitInfos(gitUrl)
//       // console.log('S-index > A > getGitInfos > gitInfosObject : ', gitInfosObject)
//       commit('setGitInfos', gitInfosObject)
//     }
//   },
//   modules: {
//     'git-translations': translations,
//     'git-user': user,
//     'git-filters': filters,
//     'git-data': data
//   }
// })

const defaultStore = {
  state: {
    test: 'testing',
    gitInfos: []
  },
  getters: {
    getGitObj: (state) => {
      return state.gitInfos
    },
    getGitInfosObj: (state) => (id) => {
      const gitInfosObj = state.gitInfos.find(gitObj => gitObj.id === id)
      return gitInfosObj
    }
  },
  mutations: {
    setGitInfos (state, gitInfosObject) {
      // console.log('S-index > M > setGitInfos > gitInfosObject : ', gitInfosObject)
      const index = state.gitInfos.findIndex(item => item.id === gitInfosObject.id)
      if (index !== -1) {
        Vue.set(state.gitInfos, index, gitInfosObject)
      } else {
        state.gitInfos.push(gitInfosObject)
      }
      // state.gitInfos[gitInfosObject.id] = gitInfosObject
    }
  },
  actions: {
    getGitInfos ({ commit }, gitUrl) {
      // console.log('S-index > A > getGitInfos > gitUrl : ', gitUrl)
      const gitInfosObject = extractGitInfos(gitUrl)
      // console.log('S-index > A > getGitInfos > gitInfosObject : ', gitInfosObject)
      commit('setGitInfos', gitInfosObject)
    }
  }
  // modules: {
  //   'git-translations': translations,
  //   'git-user': user,
  //   'git-filters': filters,
  //   'git-data': data
  // }
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
