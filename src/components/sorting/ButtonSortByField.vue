<template>
  <div class="ButtonSortByField datami-component px-2">
    <!-- DEBUGGING -->
    <div v-if="debug">
      counter: {{ counter }}
      reset: {{ reset }}
      isAscending: {{ isAscending }}
    </div>

    <!-- FIELD'S SORT ICON -->
    <b-tooltip
      :label="t(getSortTooltip, locale)"
      :type="`${isDarkMode ? 'is-white' : 'is-dark'}`"
      position="is-top"
      append-to-body>
      <b-icon
        :icon="getSortIcon"
        :type="counter ? 'is-dark' : 'is-grey-light'"
        size="is-small"
        @click.native="updateAscending"/>
    </b-tooltip>
  </div>
</template>

<script>
import { mixinGlobal, mixinCsv } from '@/utils/mixins.js'

export default {
  name: 'ButtonSortByField',
  mixins: [
    mixinGlobal,
    mixinCsv
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    field: {
      default: null,
      type: Object
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
      counter: 0,
      reset: false,
      isAscending: false
    }
  },
  computed: {
    getSortIcon () {
      let icon
      switch (this.counter) {
        case 0:
          icon = 'sort'
          break
        case 1:
          icon = 'arrow-down-thick'
          break
        case 2:
          icon = 'arrow-up-thick'
          break
      }
      return icon
    },
    getSortTooltip () {
      let tooltip
      switch (this.counter) {
        case 0:
          tooltip = 'sort.label'
          break
        case 1:
          tooltip = 'sort.sortedDesc'
          break
        case 2:
          tooltip = 'sort.sortedAsc'
          break
      }
      return tooltip
    }
  },
  beforeMount () {
    // console.log('\nC > ButtonSortByField > beforeMount > this.fileSorting : ', this.fileSorting)
    const predefinedSortingField = this.fileSorting && this.fileSorting.find(f => f.field === this.field.field)
    if (predefinedSortingField) {
      // console.log('\nC > ButtonSortByField > beforeMount > this.field : ', this.field)
      // console.log('C > ButtonSortByField > beforeMount > predefinedSortingField : ', predefinedSortingField)
      const ascending = predefinedSortingField.ascending
      this.isAscending = !!ascending
      this.counter = ascending ? 2 : 1
    }
  },
  methods: {
    updateAscending () {
      // console.log('\nC > ButtonSortByField > SendActions > event : ', event)
      this.counter = (this.counter + 1) % 3
      this.reset = !(this.counter % 3)
      this.isAscending = this.counter === 2
      this.SendActionToParent()
    },
    SendActionToParent (event) {
      // console.log('\nC > ButtonSortByField > SendActions > event : ', event)
      const sortPayload = {
        header: this.field,
        reset: this.reset,
        ascending: this.isAscending
      }
      const payload = {
        action: 'sortBy',
        value: sortPayload
      }
      // console.log('\nC > ButtonSortByField > SendActions > payload : ', payload)
      this.$emit('action', payload)
    }
  }
}
</script>

<style>
.gt-label-sort {
  padding-top: 0.1em!important;
}
.ButtonSortBy > .field > .field-body > .field {
  margin-right: 0!important;
}
</style>
