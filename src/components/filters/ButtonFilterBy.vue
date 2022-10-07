<template>
  <div class="ButtonFilterBy datami-component px-2">
    <b-field
      grouped
      custom-class="gt-label-filter mr-2 is-align-content-center">
      <!-- LABEL SLOT -->
      <template #label>
        <div class="is-flex">
          <b-tooltip
            :label="t(`filters.filterBy`, locale)"
            :type=" `${isDarkMode ? 'is-white' : 'is-dark'}`"
            position="is-top">
            <b-icon
              icon="filter"
              class="mr-2"
              size="is-small"/>
          </b-tooltip>
          {{ t('filters.label', locale) }}
        </div>
      </template>

      <!-- FIELD SELECTOR -->
      <b-select
        size="is-small"
        class="mr-0"
        :placeholder="getActiveHeader"
        @input="updateActiveHeader">
        <option
          :value="undefined">
          <!-- {{ t('filters.noSelect', locale) }} -->
          {{ defaultLabel }}
        </option>
        <option
          v-for="h in headers"
          :key="h.field"
          :value="h">
          {{ h.label }}
        </option>
      </b-select>

      <!-- FILTER VALUE FROM USER INPUT -->
      <!-- INPUT -->
      <b-input
        v-if="activeHeader"
        v-model="searchValue"
        class="gt-filter-input mr-0"
        size="is-small"
        icon="magnify"
        type="search"
        :placeholder="`${t('actions.search', locale)}...`"/>
      <!-- RESET -->
      <b-tooltip
        v-if="isActiveTags"
        :label="t(`filters.removeFilters`, locale)"
        type="is-dark"
        position="is-top">
        <b-button
          size="is-small"
          type="is-dark"
          class="ml-0"
          :icon-left="'close'"
          @click="SendActionToParent"/>
      </b-tooltip>
    </b-field>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

import { debounce } from '@/utils/globalUtils'

export default {
  name: 'ButtonFilterBy',
  mixins: [mixinGlobal],
  props: {
    headers: {
      default: null,
      type: Array
    },
    isActiveTags: {
      default: null,
      type: Boolean
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {
      counter: 0,
      activeHeader: undefined,
      searchValue: undefined,
      defaultLabel: '---'
    }
  },
  computed: {
    getActiveHeader () {
      const activeHeaderLabel = this.activeHeader && this.activeHeader.label
      return activeHeaderLabel || this.defaultLabel
    }
  },
  watch: {
    searchValue: debounce(function () {
      this.SendActionToParent()
    }, 750)
  },
  methods: {
    updateActiveHeader (event) {
      // console.log('\nC > ButtonFilterBy > updateActiveHeader > event : ', event)
      this.activeHeader = event
    },
    // updateSearch (event) {
    //   console.log('\nC > ButtonFilterBy > updateSearch > event : ', event)
    //   // this.SendActionToParent()
    //   this.debounce(this.SendActionToParent(), 500)
    // },
    removeAllFilters () {
      // console.log('\nC > ButtonFilterBy > removeAllFilters > ... : ')
      this.SendActionToParent(true)
    },
    SendActionToParent (remove = false) {
      // console.log('\nC > ButtonFilterBy > SendActionToParent > ... : ')
      const filterPayload = {
        id: this.counter,
        field: this.activeHeader && this.activeHeader.field,
        value: this.searchValue,
        reset: remove
      }
      const payload = {
        action: 'filterBy',
        value: filterPayload
      }
      if (remove) {
        this.$emit('action', payload)
      }
      if (this.searchValue && this.searchValue.length) {
        this.$emit('action', payload)
        this.searchValue = undefined
      }
    }
  }
}
</script>

<style>
.gt-label-filter {
  padding-top: 0.1em!important;
}
.ButtonFilterBy > .field > .field-body > .field {
  margin-right: 0!important;
  /* :nth-last-child(2) */
  /* margin-right: .75em!important; */
}
</style>
