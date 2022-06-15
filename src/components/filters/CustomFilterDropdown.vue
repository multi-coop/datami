<template>
  <b-navbar-dropdown
    hoverable
    arrowless
    right
    tag="div">
    <!-- LABEL SLOT -->
    <template #label>
      <b-tooltip
        :label="`${ t('filters.filterByField', locale) } : ${filter.label}`"
        type="is-dark"
        position="is-left">
        <b-icon
          icon="filter"
          class="mr-2"
          :type="isActiveField ? 'is-dark' : 'is-grey'"
          size="is-small"/>
        <span
          :class="`${isActiveField ? 'has-text-weight-bold' : '' }`">
          {{ filter.label }}
        </span>
      </b-tooltip>
    </template>

    <!-- TAG VALUES LOOP -->
    <b-navbar-item
      v-for="filterVal, idx in filter.enumArr"
      :key="`nav-filter-${fileId}-${filter.field}-${idx}-${filterVal}`"
      @click.native="updateActiveTag(filterVal)">
      <b-icon
        v-if="isActive(filterVal)"
        class="mr-2"
        size="is-small"
        icon="close-thick"/>
      <span
        :class="`${isActive(filterVal) ? 'has-text-weight-bold' : '' }`">
        {{ filterVal }}
      </span>
    </b-navbar-item>

    <hr class="mx-0">

    <b-navbar-item
      @click.native="removeAllFilters">
      <b-icon
        icon="close-thick"
        class="mr-2"
        size="is-small"/>
      <span class="has-text-weight-bold">
        {{ t('filters.resetFilter', locale) }}
      </span>
    </b-navbar-item>
  </b-navbar-dropdown>
</template>

<script>

import { mixinGlobal, mixinValue } from '@/utils/mixins.js'

export default {
  name: 'CustomFilterDropdown',
  mixins: [
    mixinGlobal,
    mixinValue
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    filter: {
      default: null,
      type: Object
    },
    fieldActiveTags: {
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
  computed: {
    isActiveField () {
      return this.fieldActiveTags.length
    }
  },
  methods: {
    isActive (filterVal) {
      const activeTags = this.fieldActiveTags.map(t => t.value)
      return activeTags.includes(filterVal)
    },
    updateActiveTag (filterVal) {
      // console.log('\nC > CustomFilterDropdown > updateActiveTag > filterVal : ', filterVal)
      const remove = this.isActive(filterVal)
      this.SendActionToParent(filterVal, remove)
    },
    removeAllFilters () {
      this.SendActionToParent(null, false, true)
    },
    SendActionToParent (filterVal, remove = false, reset = false) {
      // console.log('\nC > CustomFilterDropdown > SendActionToParent > filterVal : ', filterVal)
      // console.log('C > CustomFilterDropdown > SendActionToParent > remove : ', remove)
      const filterPayload = {
        field: this.filter.field,
        value: filterVal,
        reset: reset
      }
      const payload = {
        action: remove ? 'removeTag' : 'filterBy',
        value: filterPayload
      }
      this.$emit('action', payload)
    }
  }
}
</script>
