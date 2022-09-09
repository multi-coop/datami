<template>
  <div class="ButtonSortBy datami-component px-2">
    <b-field
      grouped
      custom-class="gt-label-sort mr-2 is-align-content-center">
      <template #label>
        <div class="is-flex">
          <b-tooltip
            :label="t(`sort.sortBy`, locale)"
            type="is-dark"
            position="is-top">
            <b-icon
              icon="sort"
              class="mr-2"
              size="is-small"/>
          </b-tooltip>
          {{ t('sort.label', locale) }}
        </div>
      </template>

      <!-- SORT SELECTION BY FIELD -->
      <b-select
        size="is-small"
        class="gt-label-sort-select mr-0"
        :placeholder="getActiveHeader"
        @input="updateActiveHeader">
        <option
          :value="undefined">
          {{ defaultLabel }}
        </option>
        <option
          v-for="h in headers"
          :key="h.field"
          :value="h">
          {{ h.label }}
        </option>
      </b-select>

      <!-- ASCENDING / DESCENDING -->
      <b-tooltip
        :label="t(`sort.sortAscending`, locale)"
        type="is-dark"
        position="is-top">
        <p class="control mb-0">
          <b-button
            icon-left="arrow-down"
            size="is-small"
            :type="activeHeader && isAscending ? 'is-dark' : ''"
            @click="updateAscending(true)"/>
        </p>
      </b-tooltip>
      <b-tooltip
        :label="t(`sort.sortDescending`, locale)"
        type="is-dark"
        position="is-top">
        <p class="control mb-0">
          <b-button
            icon-left="arrow-up"
            size="is-small"
            :type="activeHeader && !isAscending ? 'is-dark' : ''"
            @click="updateAscending(false)"/>
        </p>
      </b-tooltip>
    </b-field>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonSortBy',
  mixins: [mixinGlobal],
  props: {
    headers: {
      default: null,
      type: Array
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {
      activeHeader: undefined,
      isAscending: true,
      defaultLabel: '---'
    }
  },
  computed: {
    getActiveHeader () {
      const activeHeaderLabel = this.activeHeader && this.activeHeader.label
      // return activeHeaderLabel || this.t('editCsv.noSelect', this.locale)
      return activeHeaderLabel || this.defaultLabel
    }
  },
  methods: {
    updateAscending (bool) {
      // console.log('\nC > ButtonSortBy > SendActions > event : ', event)
      this.isAscending = bool
      this.SendActionToParent()
    },
    updateActiveHeader (event) {
      // console.log('\nC > ButtonSortBy > SendActions > event : ', event)
      this.activeHeader = event
      this.SendActionToParent()
    },
    SendActionToParent (event) {
      // console.log('\nC > ButtonSortBy > SendActions > event : ', event)
      const sortPayload = {
        header: this.activeHeader,
        ascending: this.isAscending
      }
      const payload = {
        action: 'sortBy',
        value: sortPayload
      }
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
