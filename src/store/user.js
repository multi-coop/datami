import Vue from 'vue'

export const user = {
  namespaced: true,
  state: {
    userLocale: 'en',
    userGit: [],
    userBranches: []
  },
  getters: {
    getUserLocale: (state) => {
      return state.userLocale
    },
    getUserGit: (state) => (fileId) => {
      const userGit = state.userGit.find(user => user.uuid === fileId)
      return userGit
    },
    getUserBranches: (state) => (fileId) => {
      // console.log('\nS-user > G > getUserBranches > state.userBranches : ', state.userBranches)
      const userBranches = state.userBranches.find(fileBranches => fileBranches.uuid === fileId)
      return userBranches && userBranches.branches
    },
    getRefBranch: (state, getters) => (fileId) => {
      const userBranches = getters.getUserBranches(fileId)
      return userBranches && userBranches.find(branch => branch.isRefBranch)
    },
    getUserBranchesNotRef: (state, getters) => (fileId) => {
      const userBranches = getters.getUserBranches(fileId)
      return userBranches && userBranches.filter(branch => !branch.isRefBranch)
    },
    getUserActiveBranch: (state, getters) => (fileId) => {
      const userBranches = getters.getUserBranchesNotRef(fileId)
      return userBranches && userBranches.find(branch => branch.activeBranch)
    }
  },
  mutations: {
    setUserLocale (state, locale) {
      state.userLocale = locale
    },
    setUserGit (state, userGitInfos) {
      const index = state.userGit.findIndex(user => user.uuid === userGitInfos.uuid)
      if (index !== -1) {
        Vue.set(state.userGit, index, userGitInfos)
      } else {
        state.userGit.push(userGitInfos)
      }
    },
    addToBranches (state, userBranches) {
      console.log('\nS-user > G > addToBranches > state.userBranches : ', state.userBranches)
      console.log('S-user > G > addToBranches > userBranches : ', userBranches)
      const index = state.userBranches.findIndex(branches => branches.uuid === userBranches.uuid)
      if (index !== -1) {
        const userBranchesUpdated = { ...state.userBranches[index] }
        const userNewBranch = userBranches.branches
        userBranchesUpdated.branches.push(userNewBranch)
        Vue.set(state.userBranches, index, userBranchesUpdated)
      } else {
        state.userBranches.push(userBranches)
      }
    }
  },
  actions: {
    updateUserLocale ({ commit }, locale) {
      commit('setUserLocale', locale)
    },
    updateUserGit ({ commit }, { fileId, userGitInfos }) {
      console.log('\nS-user > G > updateUserGit > userGitInfos : ', userGitInfos)
      const userGit = {
        uuid: fileId,
        username: userGitInfos.username,
        userGit: userGitInfos.gitInfos
      }
      commit('setUserGit', userGit)
    },
    updateUserBranches ({ commit }, { fileId, branches }) {
      console.log('\nS-user > G > getUserBranches > branches : ', branches)
      const userBranches = {
        uuid: fileId,
        branches: branches
      }
      commit('addToBranches', userBranches)
    },
    changeActiveUserBranch ({ commit }, { fileId, userBranch }) {
      console.log('\nS-user > G > getUserBranches > userBranch : ', userBranch)
    }
  }
}
