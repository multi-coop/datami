<template>
  <div
    class="ButtonConsolidation"
    @mouseover="showGlobalTooltip($event, { position: 'right', type: 'info', label: t('actions.consolidate', locale) })"
    @mouseleave="hideGlobalTooltip">
    <!-- <b-tooltip
      :label="t('actions.consolidate', locale)"
      append-to-body
      position="is-right"
      :type="isDarkMode ? 'is-white' : 'is-dark'">
      <b-dropdown
        aria-role="list"
        append-to-body>
        <template #trigger>
          <b-button
            icon-left="wrench"
            class="mt-1"
            size="is-small"
            :type="isDarkMode ? 'is-white' : 'is-dark'"
            :loading="isConsolidating"
            expanded
            outlined/>
        </template>
        <b-dropdown-item
          v-for="api in activeApis"
          :key="api.api_name"
          aria-role="listitem"
          @click="consolidateRow(api)">
          <b-icon
            :icon="field.icon"
            class="ml-0 mr-2"
            type="is-grey-light"
            size="is-small"/>
          {{ api.api_name }}
        </b-dropdown-item>
      </b-dropdown>
    </b-tooltip> -->
    <b-dropdown
      aria-role="list"
      append-to-body>
      <template #trigger>
        <b-button
          icon-left="wrench"
          class="mt-1"
          size="is-small"
          :type="isDarkMode ? 'is-white' : 'is-dark'"
          :loading="isConsolidating"
          expanded
          outlined/>
      </template>
      <b-dropdown-item
        v-for="api in activeApis"
        :key="api.api_name"
        aria-role="listitem"
        @click="consolidateRow(api)">
        <b-icon
          :icon="field.icon"
          class="ml-0 mr-2"
          type="is-grey-light"
          size="is-small"/>
        {{ api.api_name }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>

import { mixinTooltip, mixinGlobal, mixinValue } from '@/utils/mixins.js'

export default {
  name: 'ButtonConsolidation',
  mixins: [
    mixinTooltip,
    mixinGlobal,
    mixinValue
  ],
  props: {
    isHeader: {
      default: false,
      type: Boolean
    },
    field: {
      default: null,
      type: Object
    },
    rowId: {
      default: null,
      type: String
    },
    isConsolidating: {
      default: false,
      type: Boolean
    },
    locale: {
      default: null,
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    activeApis () {
      return this.field.apis.filter(api => api.activate)
    }
  },
  methods: {
    consolidateRow (api) {
      // console.log('\nC > ButtonConsolidation > consolidateRow > ...')
      // console.log('C > ButtonConsolidation > consolidateRow > api :', api)
      // console.log('C > ButtonConsolidation > consolidateRow > this.field :', this.field)
      const payload = {
        action: 'consolidate',
        rowId: this.rowId,
        api: api
      }
      this.SendActionToParent(payload)
    },
    SendActionToParent (payload) {
      // console.log('\nC > ButtonConsolidation > SendActionToParent > payload : ', payload)
      this.$emit('action', payload)
    }
  }
}
</script>
