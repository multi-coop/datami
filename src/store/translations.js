export const translations = {
  namespaced: true,
  state: {
    test: 'translations',
    dict: {
      reclaim: {
        en: 'An open source widget coded with 🤍  by',
        fr: 'Un widget open source codé avec 🤍  par'
      },
      code: {
        en: 'Source code',
        fr: 'Code source'
      }
    }
  },
  getters: {
    getTranslation: (state, getters, rootState, rootGetters) => (key) => {
      // console.log('\nS > translatioons > G > getTranslation > rootGetters : ', rootGetters)
      // console.log('S > translatioons > G > getTranslation > key : ', key)
      const locale = rootGetters['git-user/getLocale']
      // console.log('S > translatioons > G > getTranslation > locale : ', locale)
      return state.dict[key][locale] || key
    }
  },
  mutations: {
  },
  actions: {
  }
}
