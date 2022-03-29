export const translations = {
  namespaced: true,
  state: {
    test: 'translations',
    allowedLocales: ['en', 'fr'],
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
    getTranslation: (state, getters, rootState, rootGetters) => (key, locale = undefined) => {
      // console.log('S > translatioons > G > getTranslation > key : ', key)
      // console.log('S > translatioons > G > getTranslation > rootGetters : ', rootGetters)
      // console.log('S > translatioons > G > getTranslation > locale : ', locale)
      const updateLocaleGlobally = rootState['git-user'].localeIsGlobal
      // console.log('S > translatioons > G > getTranslation > updateLocaleGlobally : ', updateLocaleGlobally)
      let loc
      if (!locale || updateLocaleGlobally) {
        loc = rootGetters['git-user/getLocale']
      } else {
        loc = state.allowedLocales.includes(locale) ? locale : 'en'
      }
      // console.log('S > translatioons > G > getTranslation > loc : ', loc)
      return state.dict[key][loc] || key
    }
  },
  mutations: {
  },
  actions: {
  }
}
