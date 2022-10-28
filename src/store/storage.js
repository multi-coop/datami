// import { changeViewMode } from '@/store/data'
export const storage = {
  namespaced: true,
  state: {
    theme: { darkmode: undefined },
    userLastView: {
      fileId: undefined,
      lastView: undefined,
      defaultView: undefined
    }
  },
  getters: {
    isDarkMode: (state) => {
      const userStorage = localStorage.getItem('datamiTheme') || { darkmode: false }
      return state.theme.darkmode || userStorage.darkmode
    },
    getUserLastView: (state) => {
      const userLastView = state.userLastView.lastView || state.userLastView.defaultView
      return userLastView
    }
  },
  mutations: {
    setDefaultContrastMode (state) {
      const userStorage = localStorage.getItem('datamiTheme') || undefined
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
    setUserLastView (state, payload) {
      // localStorage.removeItem('datamiUserLastView')
      const userLastView = localStorage.getItem('datamiUserLastView') || undefined
      if (!userLastView) {
        const datamiUserLastView = `{"fileId": "${payload.fileId}", "lastView": "${payload.defaultView}", "defaultView": "${payload.defaultView}"}`
        localStorage.setItem('datamiUserLastView', datamiUserLastView)
        state.userLastView = { fileId: payload.fileId, lastView: payload.defaultView, defaultView: payload.defaultView }
      } else {
        state.userLastView = JSON.parse(userLastView)
        // console.log('initialization at', JSON.parse(userLastView).lastView)
      }
    },
    changeUserLastView (state, payload) {
      localStorage.setItem('datamiUserLastView', `{"fileId": "${payload.fileId}", "lastView": "${payload.lastView}", "defaultView": "${state.defaultView}"}`)
      state.userLastView.fileId = payload.fileId
      state.userLastView.lastView = payload.lastView
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
