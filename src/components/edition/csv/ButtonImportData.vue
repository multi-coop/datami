<template>
  <div class="ButtonImportData">
    <b-tooltip
      :label="t(`editCsv.importData`, locale)"
      type="is-dark"
      position="is-top">
      <b-button
        size="is-small"
        class="ml-1"
        disabled
        :icon-left="'upload'"
        @click="SendActionToParent"/>
    </b-tooltip>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonImportData',
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
    return {}
  },
  methods: {
    SendActionToParent () {
      // console.log('\nC > ButtonImportData > SendActions > this.headers : ', this.headers)
      const payload = {
        action: 'importData'
      }
      this.$emit('action', payload)
    }
  }
}
</script>
