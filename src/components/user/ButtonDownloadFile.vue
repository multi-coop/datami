<template>
  <div class="ButtonDownloadFile datami-component">
    <!-- <b-tooltip
      :label="t('actions.downloadFile', locale)"
      :type="`${isDarkMode ? 'is-white' : 'is-dark'}`"
      position="is-top">
      <b-button
        size="is-small"
        :class="`ml-1 is-small ${isDarkMode ? 'has-background-dark has-text-white' : ''}`"
        :type="isDarkMode ? 'is-white' : ''"
        :outlined="isDarkMode"
        :icon-left="'download'"
        :loading="downloading"
        @click="DownloadFile()"
        @mouseover="showGlobalTooltip($event, { position: 'top', type: 'info', label: t('actions.downloadFile', locale) })"
        @mouseleave="hideGlobalTooltip"/>
    </b-tooltip> -->
    <b-button
      size="is-small"
      :class="`ml-1 is-small ${isDarkMode ? 'has-background-dark has-text-white' : ''}`"
      :type="isDarkMode ? 'is-white' : ''"
      :outlined="isDarkMode"
      :icon-left="'download'"
      :loading="downloading"
      @click="DownloadFile()"
      @mouseover="showGlobalTooltip($event, { position: 'top', type: 'info', label: t('actions.downloadFile', locale) })"
      @mouseleave="hideGlobalTooltip"/>
  </div>
</template>

<script>
import { mixinTooltip, mixinGlobal, mixinDownload } from '@/utils/mixins.js'

export default {
  name: 'ButtonDownloadFile',
  mixins: [
    mixinTooltip,
    mixinGlobal,
    mixinDownload
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {
      downloading: false
    }
  },
  watch: {
    fileIsDownloading (next) {
      this.downloading = next
    }
  },
  methods: {
    async DownloadFile () {
      this.updateDownloading({ fileId: this.fileId, isDownloading: true })
      // console.log('C > ButtonDownloadFile > DownloadFile > this.gitObj : ', this.gitObj)
      if (this.gitObj.filetype !== 'wiki') {
        const respFileRaw = await this.getFileDataRaw(this.gitObj)
        // console.log('C > ButtonDownloadFile > DownloadFile > respFileRaw.data : ', respFileRaw.data)
        const dl = this.buildFileLink(respFileRaw.data, window)
        // console.log('C > ButtonDownloadFile > DownloadFile > dl : ', dl)
        this.removeLink(dl)
        this.updateDownloading({ fileId: this.fileId, isDownloading: false })
      }

      // track with matomo
      this.trackEvent('click')
    }
  }
}
</script>
