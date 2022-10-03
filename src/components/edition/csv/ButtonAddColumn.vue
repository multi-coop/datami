<template>
  <div class="ButtonAddColumn datami-component">
    <b-tooltip
      :label="t(`editCsv.addColumn`, locale)"
      type="is-dark"
      position="is-left">
      <b-button
        size="is-small"
        class="ml-1"
        icon-left="table-column-plus-after"
        @click="SendActionToParent"/>
    </b-tooltip>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonAddColumn',
  mixins: [mixinGlobal],
  props: {
    locale: {
      default: 'en',
      type: String
    }
  },
  methods: {
    SendActionToParent () {
      console.log('\nC > ButtonAddColumn > SendActions > this.headers : ', this.headers)
      const payload = {
        action: 'openAddColumnDialog'
      }
      this.$emit('action', payload)
    }
  }
}
</script>
