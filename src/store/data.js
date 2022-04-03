export const data = {
  namespaced: true,
  state: {
    test: 'data module',
    reloading: [],
    tokens: {}
  },
  getters: {
    fileNeedsReload: (state) => (fileId) => {
      return state.reloading.includes(fileId)
    },
    getFileToken: (state) => (fileId) => {
      return state.tokens[fileId]
    }
  },
  mutations: {
    addReloading (state, fileId) {
      state.reloading.push(fileId)
    },
    removeReloading (state, fileId) {
      state.reloading = state.reloading.filter(id => id !== fileId)
    },
    setToken (state, { fileId, token }) {
      state.tokens[fileId] = token
    }
  },
  actions: {
    updateReloading ({ commit }, { fileId, action }) {
      // console.log('S-data > A > updateReloading > fileId : ', fileId)
      if (action === 'add') { commit('addReloading', fileId) }
      if (action === 'remove') { commit('removeReloading', fileId) }
    },
    updateToken ({ commit }, { fileId, token }) {
      // console.log('S-data > A > updateToken > fileId : ', fileId)
      commit('setToken', { fileId: fileId, token: token })
    }
  }
}
