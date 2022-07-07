import Vue from 'vue'

export const filters = {
  namespaced: true,
  state: {
    fileFilters: []
  },
  getters: {
    getFiltersById: (state) => (fileId) => {
      const filters = state.fileFilters.filter(filter => filter.fileId === fileId)
      return filters
    }
  },
  mutations: {
    updateFilter (state, { fileId, field, enumArr }) {
      // console.log('S-filters > M > updateFilter > fileId : ', fileId)
      // console.log('S-filters > M > updateFilter > field : ', field)
      // console.log('S-filters > M > updateFilter > enumArr : ', enumArr)
      // console.log('S-filters > M > updateFilter > state.fileFilters : ', state.fileFilters)
      const index = state.fileFilters.findIndex(filter => filter.fileId === fileId && filter.field === field)
      // console.log('S-filters > M > updateFilter > index : ', index)
      // console.log('S-filters > M > updateFilter > state.fileFilters[index] : ', state.fileFilters[index])
      const fileFilter = { ...state.fileFilters[index] }
      // console.log('S-filters > M > updateFilter > fileFilters : ', fileFilter)

      // enumArr.forEach(item => fileFilter.enumArr.add(item))
      const filterEnumSet = new Set(fileFilter.enumArr)
      // console.log('S-filters > M > updateFilter > filterEnumSet : ', filterEnumSet)
      enumArr.forEach(item => filterEnumSet.add(item))
      fileFilter.enumArr = Array.from(filterEnumSet)

      Vue.set(state.fileFilters, index, fileFilter)
    },
    setFilter (state, filterInfos) {
      const index = state.fileFilters.findIndex(filter => filter.fileId === filterInfos.fileId && filter.field === filterInfos.field)
      if (index !== -1) {
        Vue.set(state.fileFilters, index, filterInfos)
      } else {
        state.fileFilters.push(filterInfos)
      }
    }
  },
  actions: {
    updateFiltersSettings ({ commit }, filterInfos) {
      commit('updateFilter', filterInfos)
    },
    setFiltersSettings ({ commit }, filterInfos) {
      // console.log('S-filters > A > setFiltersSettings > filterInfos : ', filterInfos)
      commit('setFilter', filterInfos)
    }
  }
}
