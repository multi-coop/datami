export const storage = {
  namespaced: true,
  state: {
    theme: { darkmode: undefined }
  },
  getters: {
    isDarkMode: (state) => {
      const userStorage = localStorage.getItem('datamiTheme') || { darkmode: false }
      return state.theme.darkmode || userStorage.darkmode
    }
  },
  mutations: {
    setDefaultContrastMode (state) {
      const userStorage = localStorage.getItem('datamiTheme') || undefined
      // console.log('S > storage > setDefaultContrastMode > userStorage : ', userStorage)
      if (!userStorage) {
        localStorage.setItem('datamiTheme', '{ "darkmode": false }')
        state.theme = { darkmode: false }
      } else {
        state.theme = JSON.parse(userStorage)
      }
    },
    changeContrastMode (state) {
      if (state.theme.darkmode) {
        localStorage.setItem('datamiTheme', '{ "darkmode": false }')
        state.theme = { darkmode: false }
      } else if (!state.theme.darkmode) {
        localStorage.setItem('datamiTheme', '{ "darkmode": true }')
        state.theme = { darkmode: true }
      }
    }
  },
  actions: {
    toggleContrastMode ({ commit }) {
      commit('changeContrastMode')
    },
    initializeStorage ({ commit }) {
      commit('setDefaultContrastMode')
    }
  }

}
