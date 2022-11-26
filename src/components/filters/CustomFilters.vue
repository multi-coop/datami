<template>
  <div class="CustomFilters datami-component">
    <!-- FILTERS -->
    <div
      v-if="filtersDisplay"
      class="columns is-centered">
      <div
        v-for="filter in filtersDisplay"
        :key="`filter-${fileId}-${filter.field}`"
        class="column is-justify-content-center">
        <CustomFilter
          :file-id="fileId"
          :filter="filter"
          :field-active-tags="fieldActiveTags(filter.field)"
          :locale="locale"
          @action="SendActionToParent"/>
      </div>
    </div>

    <!-- DEBUGGING -->
    <div
      v-if="debug"
      class="columns is-multiline">
      CustomFilters
      <div class="column is-12">
        hasCustomFilters:
        <code>{{ hasCustomFilters }}</code>
      </div>
      <div class="column is-6">
        filtersDisplay:
        <br>
        <pre><code>{{ filtersDisplay }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinGlobal, mixinCsv } from '@/utils/mixins.js'

// import CustomFilter from '@/components/filters/CustomFilter'

export default {
  name: 'CustomFilters',
  components: {
    // CustomFilter
    CustomFilter: () => import(/* webpackChunkName: "CustomFilter" */ '@/components/filters/CustomFilter.vue')
  },
  mixins: [
    mixinGlobal,
    mixinCsv
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    activeTags: {
      default: null,
      type: Array
    },
    locale: {
      default: '',
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
    }
  },
  computed: {
    filtersDisplay () {
      let filters
      if (this.fileFilters && this.fileFilters.length) {
        filters = this.fileFilters.map(filter => {
          return {
            field: filter.field,
            label: filter.label,
            enumArr: Array.from(filter.enumArr).sort((a, b) => a.localeCompare(b))
          }
        })
      }
      return filters
    }
  },
  methods: {
    fieldActiveTags (field) {
      // console.log('\nC > CustomFilters > fieldActiveTags > field : ', field)
      return this.activeTags.filter(t => t.field === field)
    },
    SendActionToParent (event) {
      // console.log('\nC > CustomFilters > SendActionToParent > event.action : ', event.action)
      this.$emit('action', event)
    }
  }
}
</script>
