import Vue from 'vue'

export const user = {
  namespaced: true,
  state: {
    userLocale: 'en',
    userBranches: []
  },
  getters: {
    getUserLocale: (state) => {
      return state.userLocale
    },
    getUserBranches: (state) => (fileId) => {
      // console.log('\nS-user > G > getUserBranches > state.userBranches : ', state.userBranches)
      const userBranches = state.userBranches.find(branches => branches.uuid === fileId)
      return userBranches
    }
  },
  mutations: {
    setUserLocale (state, locale) {
      state.userLocale = locale
    },
    addToBranches (state, userBranches) {
      const index = state.userBranches.findIndex(branches => branches.uuid === userBranches.uuid)
      if (index !== -1) {
        Vue.set(state.userBranches, index, userBranches)
      } else {
        state.userBranches.push(userBranches)
      }
    },
    removeFromBranches (state, userBranches) {
      state.userBranches = state.userBranches.filter(branches => branches.uuid !== userBranches.uuid)
    }
  },
  actions: {
    updateUserLocale ({ commit }, locale) {
      commit('setUserLocale', locale)
    },
    updateUserBranches ({ commit }, { fileId, branches, addToBranches }) {
      const userBranches = {
        uuid: fileId,
        branches: branches
      }
      if (addToBranches) {
        commit('addToBranches', userBranches)
      } else {
        commit('removeFromBranches', userBranches)
      }
    }
  }
}
