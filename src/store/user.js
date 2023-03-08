import Vue from 'vue'

export const user = {
  namespaced: true,
  state: {
    userLocale: 'en',
    userGit: [],
    userBranches: [],
    multifileActiveTab: '',
    multifileTabsPosition: 1,
    fullscreens: [],
    urlParameters: undefined
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
    },
    getUserFullscreen: (state) => (fileId) => {
      const userFullscreen = state.fullscreens.find(fullscreen => fullscreen.fileId === fileId)
      return userFullscreen && userFullscreen.isFullscreen
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
      // console.log('\nS-user > M > addToBranches > state.userBranches : ', state.userBranches)
      // console.log('S-user > M > addToBranches > userBranches : ', userBranches)
      const index = state.userBranches.findIndex(branches => branches.uuid === userBranches.uuid)
      if (index !== -1) {
        const userBranchesUpdated = { ...state.userBranches[index] }
        const userNewBranch = userBranches.branches
        userBranchesUpdated.branches.push(userNewBranch)
        Vue.set(state.userBranches, index, userBranchesUpdated)
      } else {
        state.userBranches.push(userBranches)
      }
    },
    setUserFullscreen (state, fullscreenInfos) {
      const index = state.fullscreens.findIndex(fullscreen => fullscreen.uuid === fullscreenInfos.uuid)
      if (index !== -1) {
        Vue.set(state.fullscreens, index, fullscreenInfos)
      } else {
        state.fullscreens.push(fullscreenInfos)
      }
    },
    switchMultifileTabsPosition (state) {
      state.multifileTabsPosition *= -1
    },
    updateMultifileActiveTab (state, { fileId, activeTab }) {
      // console.log('\nS-user > M > updateMultifileActiveTab > fileId : ', fileId)
      // console.log('S-user > M > updateMultifileActiveTab > activeTab : ', activeTab)
      state.multifileActiveTab = activeTab
    },
    setUrlParameters (state, params) {
      state.urlParameters = params
    }
  },
  actions: {
    updateUserLocale ({ commit }, locale) {
      commit('setUserLocale', locale)
    },
    updateUserGit ({ commit }, { fileId, userGitInfos }) {
      // console.log('\nS-user > G > updateUserGit > userGitInfos : ', userGitInfos)
      const userGit = {
        uuid: fileId,
        username: userGitInfos.username,
        userGit: userGitInfos.gitInfos
      }
      commit('setUserGit', userGit)
    },
    updateUserBranches ({ commit }, { fileId, branches }) {
      // console.log('\nS-user > G > getUserBranches > fileId : ', fileId)
      // console.log('S-user > G > getUserBranches > branches : ', branches)
      const userBranches = {
        uuid: fileId,
        branches: branches
      }
      commit('addToBranches', userBranches)
    },
    changeActiveUserBranch ({ commit }, { fileId, userBranch }) {
      console.log('\nS-user > G > getUserBranches > userBranch : ', userBranch)
      // TO DO ...
    },
    updateFullscreen ({ commit }, fullscreenInfos) {
      commit('setUserFullscreen', fullscreenInfos)
    },
    toggleMultifileTabsPosition ({ commit }) {
      commit('switchMultifileTabsPosition')
    },
    toggleMultifileActiveTab ({ commit }, { fileId, activeTab }) {
      const multifileActiveTab = {
        fileId: fileId,
        activeTab: activeTab
      }
      commit('updateMultifileActiveTab', multifileActiveTab)
    },
    updateUrlParameters ({ commit }, params) {
      commit('setUrlParameters', params)
    }
  }
}
