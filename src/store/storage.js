// import { changeViewMode } from '@/store/data'
export const storage = {
  namespaced: true,
  state: {
    theme: { darkmode: undefined },
    userLastView: undefined
  },
  getters: {
    isDarkMode: (state) => {
      const userStorage = localStorage.getItem('datamiTheme') || { darkmode: false }
      return state.theme.darkmode || userStorage.darkmode
    },
    getUserLastView: (state) => {
      const userLastView = localStorage.getItem('datamiUserLastView') || 'map'
      return state.userLastView || userLastView
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
    },
    setUserLastView (state, fileId) {
      const userLastView = localStorage.getItem('datamiUserLastView') || undefined
      if (!userLastView) {
        localStorage.setItem('datamiUserLastView', 'map')
        state.userLastView = 'map'
      } else {
        state.userLastView = userLastView
        console.log('initialization at', userLastView)
        // changeViewMode(fileId, state.userLastView)
        // Call changeViewMode
      }
    },
    changeUserLastView (state, lastView) {
      // if (state.userLastView) {
      localStorage.setItem('datamiUserLastView', lastView)
      // console.log('localstorage userLastView', localStorage.getItem('datamiUserLastView'))
      state.userLastView = lastView
      // }
    }
  },
  actions: {
    toggleContrastMode ({ commit }) {
      commit('changeContrastMode')
    },
    initializeStorage ({ commit }) {
      commit('setDefaultContrastMode')
    },
    initializeUserLastView ({ commit }, payload) {
      commit('setUserLastView', payload)
    },
    saveUserLastView ({ commit }, payload) {
      commit('changeUserLastView', payload)
    }
  }
}
