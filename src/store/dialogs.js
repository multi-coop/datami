// import Vue from 'vue'
import { v4 as uuidv4 } from 'uuid'

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
    addToDialogs (state, { fileId, component, event }) {
      // console.log('S-dialogs > M > addToDialogs > fileId : ', fileId)
      state.fileDialogs.push({ fileId: fileId, component: component, event: event, dialogId: uuidv4() })
    },
    removeFromDialogsByComponent (state, { fileId, component, event }) {
      // console.log('S-dialogs > M > removeFromDialogs > component : ', component)
      // console.log('S-dialogs > M > removeFromDialogs > event : ', event)
      // console.log('S-dialogs > M > removeFromDialogs > state.fileDialogs : ', state.fileDialogs)
      state.fileDialogs = state.fileDialogs.filter(dialog => dialog.fileId !== fileId && dialog.component !== component)
    },
    removeFromDialogsByDialogId (state, dialogId) {
      state.fileDialogs = state.fileDialogs.filter(dial => dial.dialogId !== dialogId)
    },
    resetFileDialogs (state, { fileId }) {
      // console.log('S-dialogs > M > removeFromDialogs > fileId : ', fileId)
      state.fileDialogs = state.fileDialogs.filter(dialog => dialog.fileId !== fileId)
    }
  },
  actions: {
    updateFileDialog ({ commit }, { fileId, component, event, show, reset = false }) {
      // console.log('\nS-dialogs > M > updateFileDialog > fileId : ', fileId)
      // console.log('S-dialogs > M > updateFileDialog > component : ', component)
      // console.log('S-dialogs > M > updateFileDialog > show : ', show)
      // console.log('S-dialogs > M > updateFileDialog > event : ', event)
      // console.log('S-dialogs > M > updateFileDialog > reset : ', reset)
      if (reset) {
        commit('resetFileDialogs', { fileId: fileId })
      } else {
        if (show) {
          commit('addToDialogs', { fileId: fileId, component: component, event: event })
        } else {
          commit('removeFromDialogs', { fileId: fileId, component: component, event: event })
        }
      }
    },
    removeFileDialog ({ commit }, dialogId) {
      // console.log('\nS-dialogs > M > removeFileDialog > dialogId : ', dialogId)
      commit('removeFromDialogsByDialogId', dialogId)
    }
  }
}
