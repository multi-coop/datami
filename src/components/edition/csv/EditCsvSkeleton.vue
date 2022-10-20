<template>
  <div class="EditCsvSkeleton datami-component container">
    <div :class="`columns is-mobile is-vcentered ${currentViewMode === 'map' ? 'px-3' : ''}`">
      <!-- RESULTS -->
      <div
        class="column is-3 has-text-left"
        style="z-index: 1;">
        <p :class="`has-text-weight-bold is-size-6 ml-1 ${currentViewMode === 'map' ? 'text-shadow' : ''} ${isDarkMode && currentViewMode !== 'map' ? 'datami-darkmode-white-text' : 'has-text-dark'}`">
          <span>
            {{ (dataEditedFiltered && dataEditedFiltered.length)|| 0 }}
          </span>
          <span class="is-size-7">
            /
            {{ itemsTotal || 0 }}
          </span>
          <span class="ml-2">
            {{ t(`edit${gitObj.filetype === 'wiki' ? 'Wiki' : 'Csv'}.results`, locale) }}
          </span>
        </p>
      </div>

      <div
        class="column is-6 has-text-centered"
        style="z-index: 1;">
        <!-- FILTER TAGS -->
        <div
          v-if="filterTags && filterTags.length">
          <FilterTags
            :file-id="fileId"
            :headers="headers"
            :tags="filterTags"
            :locale="locale"
            @action="SendActionToParent"/>
        </div>
      </div>

      <!-- EDIT BUTTONS -->
      <div
        v-if="currentEditViewMode === 'edit'"
        :class="`column is-3 is-justify-content-end is-flex is-flex-direction-row is-align-content-end`">
        <ButtonAddRow
          :locale="locale"
          @action="SendActionToParent"/>
        <ButtonDeleteRows
          :checked-rows="checkedRows"
          :locale="locale"
          @action="SendActionToParent"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinGlobal, mixinCsv } from '@/utils/mixins.js'

import FilterTags from '@/components/filters/FilterTags'
import ButtonAddRow from '@/components/edition/csv/ButtonAddRow'
import ButtonDeleteRows from '@/components/edition/csv/ButtonDeleteRows'

export default {
  name: 'EditCsvSkeleton',
  components: {
    FilterTags,
    ButtonAddRow,
    ButtonDeleteRows
  },
  mixins: [
    mixinGlobal,
    mixinCsv
  ],
  props: {
    fileId: {
      default: undefined,
      type: String
    },
    columns: {
      default: null,
      type: Array
    },
    checkedRows: {
      default: null,
      type: Array
    },
    dataEditedFiltered: {
      default: null,
      type: Array
    },
    itemsTotal: {
      default: null,
      type: Number
    },
    headers: {
      default: null,
      type: Array
    },
    filterTags: {
      default: null,
      type: Array
    },
    locale: {
      default: 'en',
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    SendActionToParent (event) {
      // console.log('\nC > EditCsvSkeleton > SendActionToParent > event.action : ', event.action)
      this.$emit('action', event)
    }
  }
}
</script>

<style scoped>
.text-shadow {
  text-shadow: 0 0 10px white, 0 0 10px white;
}
.datami-darkmode-white-text{
  color: white !important;
}
</style>
