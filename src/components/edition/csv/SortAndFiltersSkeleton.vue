<template>
  <div
    class="SortAndFiltersSkeleton datami-component columns is-multiline"
    style="z-index: 3;">
    <div class="datami-search-text-container column is-12-mobile is-12-tablet is-5-desktop is-4-widescreen is-3-fullhd">
      <SearchFullText
        :file-id="fileId"
        :locale="locale"
        @action="SendActionToParent"/>
    </div>
    <div class="datami-custom-filters-container column is-12-mobile is-12-tablet is-7-desktop is-8-widescreen is-9-fullhd">
      <div
        class="columns is-flex is-multiline mx-0 is-justify-content-end"
        style="width: 100%; margin-top: 0.1em;">
        <!-- v-for="(filter, idx) in [...filtersDisplay, ...filtersDisplay]" -->
        <div
          v-for="(filter, idx) in filtersDisplay"
          :key="`nav-filter-${fileId}-${filter.field}-${idx}`"
          class="column px-1 py-1 is-12-mobile is-6-tablet is-4-desktop is-3-widescreen is-2-fullhd">
          <CustomFilterDropdown
            :class="`${isDarkMode ? 'is-dark' : 'is-white'}`"
            :filter="filter"
            :file-id="fileId"
            :field-active-tags="fieldActiveTags(filter.field)"
            :locale="locale"
            @action="SendActionToParent"/>
        </div>
      </div>
    </div>

    <!-- DEBUGGING -->
    <!-- <div
      v-if="debug"
      class="columns is-multiline is-centered">
      <div class="column is-4">
        activeTags : <pre><code>{{ activeTags }}</code></pre>
      </div>
    </div> -->

    <!-- DEBUG -->
    <!-- <div
      v-if="debug"
      class="columns is-multiline">
      <div class="column is-6">
        filtersDisplay : <pre><code>{{ filtersDisplay }}</code></pre>
      </div>
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
    </div> -->
  </div>
</template>

<script>
import { mixinGlobal, mixinCsv } from '@/utils/mixins.js'

export default {
  name: 'SortAndFiltersSkeleton',
  components: {
    SearchFullText: () => import(/* webpackChunkName: "SearchFullText" */ '@/components/filters/SearchFullText.vue'),
    CustomFilterDropdown: () => import(/* webpackChunkName: "CustomFilterDropdown" */ '@/components/filters/CustomFilterDropdown.vue')
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
      cssFiles: [
        'styles/components/edition/csv/datami-sort-and-filters-skeleton.css'
      ],
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
            title: filter.title,
            label: filter.label,
            enumArr: enumArr,
            bgColor: filter.bgColor,
            foreignKey: filter.foreignKey,
            filtering: filter.filtering,
            definitions: filter.definitions
          }
        })
      }
      // console.log('C > SortAndFiltersSkeleton > filtersDisplay > filters : ', filters)
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
