<template>
  <div class="ButtonImportData datami-component">
    <b-tooltip
      :label="t(`edit.uploadData`, locale)"
      :type="`${isDarkMode ? 'is-white' : 'is-dark'}`"
      position="is-left">
      <b-button
        size="is-small"
        class="ml-1"
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
    fileId: {
      default: undefined,
      type: String
    },
    // showUploadFileDialog: {
    //   default: false,
    //   type: Boolean
    // },
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
      console.log('\nC > ButtonImportData > SendActionToParent ...')
      // const payload = {
      //   action: 'toggleUploadFileDialog'
      // }
      // this.$emit('action', payload)
      this.updateFileDialogs('UploadFile', {})

      // track with matomo
      // this.trackEvent('click')
    }
  }
}
</script>
