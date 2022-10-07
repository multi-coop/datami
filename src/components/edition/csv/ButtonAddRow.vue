<template>
  <div class="ButtonAddRow datami-component">
    <b-tooltip
      :label="t(`editCsv.addRow`, locale)"
      :type=" `${isDarkMode ? 'is-white' : 'is-dark'}`"
      position="is-left">
      <b-button
        size="is-small"
        class="ml-1"
        icon-left="table-row-plus-after"
        @click="SendActionToParent"/>
    </b-tooltip>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonAddRow',
  mixins: [mixinGlobal],
  props: {
    locale: {
      default: 'en',
      type: String
    }
  },
  methods: {
    SendActionToParent () {
      // console.log('\nC > ButtonAddRow > SendActions > this.headers : ', this.headers)
      const payload = {
        action: 'openAddRowDialog'
      }
      this.$emit('action', payload)
    }
  }
}
</script>
