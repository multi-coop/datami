import { allowedLanguages, translate } from '@/utils/utilsTranslations.js'

export const translations = {
  namespaced: true,
  state: {
    locale: 'en',
    localeIsGlobal: false,
    defaultLocale: 'en',
    allowedLocales: allowedLanguages
  },
  getters: {
    getAllowedLocales: (state) => {
      return state.allowedLocales.map(l => l.locale)
    },
    getCurrentLocale: (state, getters, rootState, rootGetters) => (locale) => {
      const localeIsGlobal = state.localeIsGlobal
      // console.log('\nS > translatioons > G > getCurrentLocale > localeIsGlobal : ', localeIsGlobal)
      let loc
      if (!locale || localeIsGlobal) {
        loc = rootGetters['git-user/getUserLocale'] || state.defaultLocale
      } else {
        loc = getters.getAllowedLocales.includes(locale) ? locale : state.defaultLocale
      }
      // console.log('S > translatioons > G > getCurrentLocale > loc : ', loc)
      return loc
    },
    getTranslation: (state, getters, rootState, rootGetters) => (key, locale = undefined, params = undefined, debug = false) => {
      // console.log('S > translatioons > G > getTranslation > key : ', key)
      // console.log('S > translatioons > G > getTranslation > rootGetters : ', rootGetters)
      // console.log('S > translatioons > G > getTranslation > locale : ', locale)
      const loc = getters.getCurrentLocale(locale)
      // console.log('S > translatioons > G > getTranslation > loc : ', loc)
      // return state.dict[key][loc] || key
      return translate(key, loc, params, debug)
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
    updateLocaleGlobally ({ commit }, locale) {
      commit('setLocaleIsGlobal', true)
      commit('setLocale', locale)
    }
  }
}
