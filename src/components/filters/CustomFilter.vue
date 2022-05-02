<template>
  <div class="CustomFilter">
    <b-field
      grouped
      custom-class="gt-label-filter mr-2 is-align-content-center">
      <!-- LABEL SLOT -->
      <template #label>
        <div class="is-flex">
          <b-tooltip
            :label="`${ t(`filters.filterByField`, locale) } : ${filter.label}`"
            type="is-dark"
            position="is-top">
            <b-icon
              icon="filter"
              class="mr-2"
              size="is-small"/>
          </b-tooltip>
          {{ filter.label }}
          <!-- <code>{{ fieldActiveTags || 'none' }}</code> -->
          <!-- <code>{{ activeTag || 'none' }}</code> -->
        </div>
      </template>

      <!-- FIELD SELECTOR -->
      <b-select
        v-model="activeTag"
        size="is-small"
        class="mr-0"
        :placeholder="`${ t('filters.filterByField', locale) } : ${ filter.label }`"
        @input="updateActiveTag">
        <option
          :value="undefined">
          {{ defaultLabel }}
        </option>
        <option
          v-for="(h, i) in filter.choices"
          :key="`${filter.field}-${i}`"
          :value="h">
          {{ h }}
        </option>
      </b-select>

      <!-- RESET -->
      <b-tooltip
        v-if="activeTag"
        :label="t(`filters.removeFilters`, locale)"
        type="is-dark"
        position="is-top">
        <b-button
          size="is-small"
          type="is-dark"
          class="ml-0"
          :icon-left="'close'"
          @click="removeAllFilters"/>
      </b-tooltip>
    </b-field>
  </div>
</template>

<script>

import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'CustomFilter',
  mixins: [mixinGlobal],
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
  data () {
    return {
      activeTag: undefined,
      defaultLabel: '---'
    }
  },
  watch: {
    fieldActiveTags (next) {
      if (!next || !next.length) {
        this.activeTag = undefined
      }
    }
  },
  methods: {
    updateActiveTag (event) {
      this.activeTag = event
      this.SendActionToParent()
    },
    removeAllFilters () {
      // console.log('\nC > CustomFilter > removeAllFilters > ... : ')
      this.activeTag = undefined
      this.SendActionToParent(true)
    },
    SendActionToParent (remove = false) {
      // console.log('\nC > CustomFilter > SendActionToParent > ... : ')
      const filterPayload = {
        field: this.filter.field,
        value: this.activeTag,
        reset: remove
      }
      const payload = {
        action: 'filterBy',
        value: filterPayload
      }
      if (remove) {
        this.$emit('action', payload)
      } else {
        this.$emit('action', payload)
        this.searchValue = undefined
      }
    }
  }
}
</script>
