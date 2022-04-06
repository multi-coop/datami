export const user = {
  namespaced: true,
  state: {
    userLocale: 'en'
  },
  getters: {
    getUserLocale: (state) => {
      return state.userLocale
    }
  },
  mutations: {
    setUserLocale (state, locale) {
      state.userLocale = locale
    }
  },
  actions: {
    updateUserLocale ({ commit }, locale) {
      commit('setUserLocale', locale)
    }
  }
}
