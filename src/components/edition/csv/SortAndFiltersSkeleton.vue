<template>
  <div class="SortAndFiltersSkeleton gitribute-component container">
    <b-navbar
      type="is-white"
      class="is-align-items-center"
      style="background-color: transparent;">
      <!-- FULL TEXT SEARCH -->
      <template #start>
        <b-navbar-item
          tag="div"
          class="py-0">
          <SearchFullText
            :file-id="fileId"
            :locale="locale"
            @action="SendActionToParent"/>
        </b-navbar-item>
      </template>

      <!-- LOOP FILTERS -->
      <template #end>
        <CustomFilterDropdown
          v-for="filter in filtersDisplay"
          :key="`nav-filter-${fileId}-${filter.field}`"
          :filter="filter"
          :file-id="fileId"
          :field-active-tags="fieldActiveTags(filter.field)"
          :locale="locale"
          @action="SendActionToParent"/>
      </template>
    </b-navbar>

    <!-- DEBUGGING -->
    <div
      v-if="debug"
      class="columns is-multiline is-centered">
      <div class="column is-4">
        activeTags : <pre><code>{{ activeTags }}</code></pre>
      </div>
      <!-- <div class="column is-8">
        filtersDisplay : <pre><code>{{ filtersDisplay }}</code></pre>
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

import SearchFullText from '@/components/filters/SearchFullText'
import CustomFilterDropdown from '@/components/filters/CustomFilterDropdown'

export default {
  name: 'SortAndFiltersSkeleton',
  components: {
    SearchFullText,
    CustomFilterDropdown
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
  data () {
    return {
      search: undefined
    }
  },
  computed: {
    filtersDisplay () {
      let filters
      if (this.fileFilters && this.fileFilters.length) {
        filters = this.fileFilters.map(filter => {
          // console.log('\nC > SortAndFiltersSkeleton > filtersDisplay > filter : ', filter)
          const enumArr = filter.enumArr || []
          return {
            field: filter.field,
            label: filter.label,
            enumArr: enumArr,
            bgColor: filter.bgColor,
            foreignKey: filter.foreignKey,
            definitions: filter.definitions
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

<style>
.SortAndFiltersSkeleton > .navbar > .navbar-menu > .navbar-end {
  margin-right: .75rem;
}
</style>
