export const user = {
  namespaced: true,
  state: {
    test: 'testing user',
    locale: 'en',
    localeIsGlobal: false,
    tokenGitlab: undefined,
    tokenGithub: undefined
  },
  getters: {
    getLocale: (state) => {
      return state.locale
    }
  },
  mutations: {
    setLocale (state, locale) {
      state.locale = locale
    },
    setLocaleIsGlobal (state, bool) {
      state.localeIsGlobal = bool
    }
  },
  actions: {
    updateLocaleGlobally ({ commit, rootState }, locale) {
      console.log('\nS > user > A > updateLocaleGlobally > locale : ', locale)
      const allowedLocales = rootState['git-translations'].allowedLocales
      console.log('S > user > A > updateLocaleGlobally > allowedLocales : ', allowedLocales)
      if (allowedLocales.includes(locale)) {
        commit('setLocale', locale)
        commit('setLocaleIsGlobal', true)
      }
    }
  }
}
