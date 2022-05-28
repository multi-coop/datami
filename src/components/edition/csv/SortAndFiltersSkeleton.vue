<template>
  <div class="SortAndFiltersSkeleton gitribute-component container">
    <div class="columns is-multiline is-centered">
      <!-- SORTING -->
      <div
        :class="`column is-4 is-flex is-flex-direction-row is-align-items-end is-justify-content-center`">
        <ButtonSortBy
          :headers="sortingHeaders"
          :locale="locale"
          @action="SendActionToParent"/>
      </div>

      <!-- FILTERS -->
      <div
        v-if="!hasCustomFilters"
        :class="`column is-4 is-flex is-flex-direction-row is-align-content-end is-justify-content-center`">
        <ButtonFilterBy
          :headers="columns"
          :is-active-tags="isActiveTags"
          :locale="locale"
          @action="SendActionToParent"/>
      </div>
      <!-- <div
        v-if="hasCustomFilters"
        :class="`column is-flex is-flex-direction-row is-align-content-end is-justify-content-center`">
        <CustomFilters
          :file-id="fileId"
          :active-tags="activeTags"
          :locale="locale"
          @action="SendActionToParent"/>
      </div> -->
      <!-- FILTERS -->
      <div
        v-for="filter in filtersDisplay"
        :key="`filter-${fileId}-${filter.field}`"
        :class="`column is-4 is-flex is-flex-direction-row is-align-content-end is-justify-content-center`">
        <CustomFilter
          v-if="hasCustomFilters && filtersDisplay"
          :file-id="fileId"
          :filter="filter"
          :field-active-tags="fieldActiveTags(filter.field)"
          :locale="locale"
          @action="SendActionToParent"/>
      </div>

      <!-- EDIT BUTTONS -->
      <!-- <div
        v-if="currentEditViewMode === 'edit'"
        :class="`column is-2 is-flex is-flex-direction-row is-align-items-end is-justify-content-center`">
        <ButtonAddRow
          :locale="locale"
          @action="SendActionToParent"/>
        <ButtonDeleteRows
          :checked-rows="checkedRows"
          :locale="locale"
          @action="SendActionToParent"/>
      </div> -->
    </div>

    <!-- DEBUG -->
    <div
      v-if="debug"
      class="columns is-multiline">
      <div class="column is-6">
        columns :
        <code>
          <pre>{{ columns }}</pre>
        </code>
      </div>
      <div class="column is-6">
        checkedRows :
        <code>
          <pre>{{ checkedRows }}</pre>
        </code>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinGlobal, mixinCsv } from '@/utils/mixins.js'

// import ViewModeBtns from '@/components/previews/ViewModeBtns'

// import ButtonAddRow from '@/components/edition/csv/ButtonAddRow'
// import ButtonImportData from '@/components/edition/csv/ButtonImportData'
import ButtonSortBy from '@/components/sorting/ButtonSortBy'
import ButtonFilterBy from '@/components/filters/ButtonFilterBy'
import CustomFilter from '@/components/filters/CustomFilter'
// import ButtonDeleteRows from '@/components/edition/csv/ButtonDeleteRows'

export default {
  name: 'SortAndFiltersSkeleton',
  components: {
    // ViewModeBtns,
    // ButtonAddRow,
    // ButtonImportData,
    ButtonSortBy,
    ButtonFilterBy,
    CustomFilter
    // ButtonDeleteRows
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
    // checkedRows: {
    //   default: null,
    //   type: Array
    // },
    activeTags: {
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
  computed: {
    sortingHeaders () {
      let sortingHeaders = this.columns
      if (this.hasCustomSorting) {
        sortingHeaders = this.fileSorting.fields
      }
      return sortingHeaders
    },
    filtersDisplay () {
      let filters
      if (this.fileFilters && this.fileFilters.length) {
        filters = this.fileFilters.map(filter => {
          // console.log('\nC > SortAndFiltersSkeleton > filtersDisplay > filter : ', filter)
          const enumArr = filter.enumArr || []
          return {
            field: filter.field,
            label: filter.label,
            enumArr: Array.from(enumArr).sort((a, b) => a.localeCompare(b))
          }
        })
      }
      return filters
    },
    isActiveTags () {
      return this.activeTags && !!this.activeTags.length
    }
  },
  methods: {
    fieldActiveTags (field) {
      // console.log('\nC > SortAndFiltersSkeleton > fieldActiveTags > field : ', field)
      return this.activeTags.filter(t => t.field === field)
    },
    SendActionToParent (event) {
      // console.log('\nC > SortAndFiltersSkeleton > SendActionToParent > event.action : ', event.action)
      this.$emit('action', event)
    }
  }
}
</script>
