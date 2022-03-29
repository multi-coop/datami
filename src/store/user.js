export const user = {
  namespaced: true,
  state: {
    test: 'testing user',
    locale: 'en',
    tokenGitlab: undefined,
    tokenGithub: undefined
  },
  getters: {
    getLocale: (state) => {
      return state.locale
    }
  },
  mutations: {
  },
  actions: {
  }
}
