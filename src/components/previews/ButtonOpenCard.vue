<template>
  <div class="ButtonOpenCard">
    <b-tooltip
      :label="t('field.openDatamiCard', locale)"
      append-to-body
      position="is-right"
      :type="isDarkMode ? 'is-white' : 'is-dark'">
      <b-button
        icon-left="eye"
        class="mt-1"
        size="is-small"
        :type="isDarkMode ? 'is-white' : 'is-dark'"
        :loading="isConsolidating"
        outlined
        @click="SendActionToParent"/>
    </b-tooltip>
  </div>
</template>

<script>

import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonOpenCard',
  mixins: [
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
