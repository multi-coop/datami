import Vue from 'vue'

export const sortings = {
  namespaced: true,
  state: {
    filesSortings: []
  },
  getters: {
    getSortingById: (state) => (fileId) => {
      const filters = state.filesSortings.find(fileSort => fileSort.fileId === fileId)
      return filters && filters.sortings
    }
  },
  mutations: {
    setSorting (state, sortingInfos) {
      const index = state.filesSortings.findIndex(fileSort => fileSort.fileId === sortingInfos.fileId)
      const sortingField = sortingInfos.field
      const sortingReset = sortingInfos.resetSort
      // console.log('S-filters > A > setSortingSettings > sortingField : ', sortingField)
      const fileSorting = {
        fileId: sortingInfos.fileId
      }
      delete sortingInfos.fileId
      if (index !== -1) {
        let sortings = [...state.filesSortings[index].sortings]
        // console.log('S-filters > A > setSortingSettings > sortings (A) : ', sortings)
        sortings = sortings.filter(s => s.field !== sortingField)
        if (!sortingReset) {
          delete sortingInfos.resetSort
          sortings.push(sortingInfos)
        }
        // console.log('S-filters > A > setSortingSettings > sortings (B) : ', sortings)
        // console.log('S-filters > A > setSortingSettings > sortings (C) : ', sortings)
        fileSorting.sortings = sortings
        Vue.set(state.filesSortings, index, fileSorting)
      } else {
        delete sortingInfos.resetSort
        fileSorting.sortings = [sortingInfos]
        state.filesSortings.push(fileSorting)
      }
    }
  },
  actions: {
    setSortingSettings ({ commit }, sortingInfos) {
      // console.log('\nS-filters > A > setSortingSettings > sortingInfos : ', sortingInfos)
      commit('setSorting', sortingInfos)
    },
    setSortingsSettings ({ commit }, sortingsInfos) {
      // console.log('\nS-filters > A > setSortingSettings > sortingsInfos : ', sortingsInfos)
      sortingsInfos.fields.forEach(sorting => {
        commit('setSorting', { fileId: sortingsInfos.fileId, ...sorting })
      })
    }
  }
}
