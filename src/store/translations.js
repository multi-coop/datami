import { allowedLanguages, translate } from '@/utils/utilsTranslations.js'

export const translations = {
  namespaced: true,
  state: {
    test: 'translations',
    allowedLocales: allowedLanguages
  },
  getters: {
    getTranslation: (state, getters, rootState, rootGetters) => (key, locale = undefined) => {
      // console.log('S > translatioons > G > getTranslation > key : ', key)
      // console.log('S > translatioons > G > getTranslation > rootGetters : ', rootGetters)
      // console.log('S > translatioons > G > getTranslation > locale : ', locale)
      const localeIsGlobal = rootState['git-user'].localeIsGlobal
      // console.log('S > translatioons > G > getTranslation > localeIsGlobal : ', localeIsGlobal)
      let loc
      if (!locale || localeIsGlobal) {
        loc = rootGetters['git-user/getLocale']
      } else {
        loc = state.allowedLocales.includes(locale) ? locale : 'en'
      }
      // console.log('S > translatioons > G > getTranslation > loc : ', loc)
      // return state.dict[key][loc] || key
      return translate(key, loc)
    }
  },
  mutations: {
  },
  actions: {
  }
}
