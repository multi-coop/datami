<template>
  <div class="ButtonDownloadFile gitribute-component">
    <b-tooltip
      :label="t('actions.downloadFile', locale)"
      type="is-dark"
      position="is-top">
      <b-button
        size="is-small"
        class="ml-1"
        :icon-left="'download'"
        :loading="downloading"
        @click="DownloadFile()"/>
    </b-tooltip>
  </div>
</template>

<script>
import { mixinGlobal, mixinDownload } from '@/utils/mixins.js'

export default {
  name: 'ButtonDownloadFile',
  mixins: [
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
        console.log('C > ButtonDownloadFile > DownloadFile > dl : ', dl)
        // this.removeLink(dl)
        this.updateDownloading({ fileId: this.fileId, isDownloading: false })
      }

      // track with matomo
      this.trackEvent('click')
    }
  }
}
</script>
