import Vue from 'vue'

export const dialogs = {
  namespaced: true,
  state: {
    fileDialogs: []
  },
  getters: {
    getDialogsById: (state) => (fileId) => {
      const dialogs = state.fileDialogs.filter(dialog => dialog.fileId === fileId)
      return dialogs
    }
  },
  mutations: {
    setState (state, { key, data }) {
      console.log('S-dialogs > M > setState > key : ', key)
      console.log('S-dialogs > M > setState > data : ', data)
      const index = state[key].findIndex(item => item.fileId === data.fileId)
      if (index !== -1) {
        Vue.set(state[key], index, data)
      } else {
        state[key].push(data)
      }
    },
    addToDialogs (state, event) {
      console.log('S-dialogs > M > addToErrors > event : ', event)
      const index = state.fileDialogs.findIndex(dialog => dialog.fileId === event.fileId)
      if (index !== -1) {
        Vue.set(state.fileDialogs, index, event)
      } else {
        state.fileDialogs.push(event)
      }
      // console.log('S-dialogs > M > addToErrors > state.fileDialogs : ', state.fileDialogs)
    },
    removeFromDialogs (state, event) {
      // console.log('S-dialogs > M > removeFromDialogs > state.fileDialogs : ', state.fileDialogs)
      state.fileDialogs = state.fileDialogs.filter(dialog => dialog.fileId !== event.fileId)
      // console.log('S-dialogs > M > removeFromDialogs > state.fileDialogs : ', state.fileDialogs)
    }
  },
  actions: {
    updateFileDialog ({ commit }, event) {
      console.log('\nS-dialogs > M > updateFileDialog > event : ', event)
      // console.log('S-dialogs > M > updateFileDialog > fileId : ', fileId)
      // console.log('S-dialogs > M > updateFileDialog > data : ', data)
      // commit('setState', { key: 'fileDialogs', fileId: fileId, data: data })
      commit('setState', { key: 'fileDialogs', data: event })
    }
  }
}
