<template>
  <div class="ButtonOpenCard">
    <b-button
      icon-left="eye"
      class="mt-1"
      size="is-small"
      :type="isDarkMode ? 'is-white' : 'is-dark'"
      :loading="isConsolidating"
      outlined
      @click="SendActionToParent"
      @mouseover="showGlobalTooltip($event, { position: 'right', type: 'info', label: t('field.openDatamiCard', locale) })"
      @mouseleave="hideGlobalTooltip"/>
  </div>
</template>

<script>

import { mixinTooltip, mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonOpenCard',
  mixins: [
    mixinTooltip,
    mixinGlobal
  ],
  props: {
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
  methods: {
    SendActionToParent () {
      const payload = {
        action: 'openCard',
        rowId: this.rowId
      }
      this.$emit('action', payload)
    }
  }
}
</script>
