<template>
  <div class="ButtonImportData datami-component">
    <b-tooltip
      :label="t(`edit.uploadData`, locale)"
      type="is-dark"
      position="is-right">
      <b-button
        size="is-small"
        class="ml-1"
        :type="showUploadFileDialog ? 'is-dark' : ''"
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
    showUploadFileDialog: {
      default: false,
      type: Boolean
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
        action: 'toggleUploadFileDialog'
      }
      this.$emit('action', payload)

      // track with matomo
      this.trackEvent('click')
    }
  }
}
</script>
