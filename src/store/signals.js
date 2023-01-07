// import Vue from 'vue'

export const signals = {
  namespaced: true,
  state: {
    fileSignals: []
  },
  getters: {
    getSignalsByFileId: (state) => (fileId) => {
      const signals = state.fileSignals.filter(signal => signal.fileId === fileId)
      return signals
    }
  },
  mutations: {
    addToSignals (state, { fileId, signalId, action, event }) {
      // console.log('\nS-signals > M > addToSignals > fileId : ', fileId)
      // console.log('S-signals > M > addToSignals > signalId : ', signalId)
      // console.log('S-signals > M > addToSignals > action : ', action)
      // console.log('S-signals > M > addToSignals > event : ', event)
      state.fileSignals.push({ fileId: fileId, signalId: signalId, action: action, event: event })
    },
    removeFromSignals (state, { signalId }) {
      // console.log('\nS-signals > M > removeFromSignals > fileId : ', fileId)
      // console.log('S-signals > M > removeFromSignals > signalId : ', signalId)
      state.fileSignals = state.fileSignals.filter(signal => signal.signalId !== signalId)
    }
  },
  actions: {
    addSignal ({ commit }, { fileId, signalId, action, event }) {
      // console.log('\nS-signals > M > addSignal > fileId : ', fileId)
      // console.log('S-signals > M > addSignal > signalId : ', signalId)
      // console.log('S-signals > M > addSignal > event : ', event)
      commit('addToSignals', { fileId, signalId, action, event })
    },
    removeSignal ({ commit }, { signalId }) {
      // console.log('\nS-signals > M > removeSignal > fileId : ', fileId)
      commit('removeFromSignals', { signalId })
    }
  }
}
