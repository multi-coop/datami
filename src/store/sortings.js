import Vue from 'vue'

export const sortings = {
  namespaced: true,
  state: {
    fileSortings: []
  },
  getters: {
    getSortingById: (state) => (fileId) => {
      const filters = state.fileSortings.find(filter => filter.fileId === fileId)
      return filters
    }
  },
  mutations: {
    setSorting (state, sortingInfos) {
      const index = state.fileSortings.findIndex(filter => filter.fileId === sortingInfos.fileId)
      if (index !== -1) {
        Vue.set(state.fileSortings, index, sortingInfos)
      } else {
        state.fileSortings.push(sortingInfos)
      }
    }
  },
  actions: {
    setSortingSettings ({ commit }, sortingInfos) {
      // console.log('S-filters > A > setSortingSettings > sortingInfos : ', sortingInfos)
      commit('setSorting', sortingInfos)
    }
  }
}
