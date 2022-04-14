<template>
  <div class="ButtonDownloadFile">
    <b-tooltip
      :label="t('actions.downloadFile', locale)"
      type="is-dark"
      position="is-top">
      <b-button
        size="is-small"
        class="ml-1"
        :icon-left="'download'"
        :loading="loading"
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
      loading: false
    }
  },
  methods: {
    async DownloadFile () {
      this.loading = true
      console.log('C > ButtonDownloadFile > DownloadFile > this.gitObj : ', this.gitObj)
      const respFileRaw = await this.getFileDataRaw(this.gitObj)
      const fileRaw = respFileRaw.data
      const fileName = this.gitObj.filefullname
      const fileUrl = window.URL.createObjectURL(new Blob([fileRaw]))
      console.log('C > ButtonDownloadFile > DownloadFile > fileUrl : ', fileUrl)
      const fileLink = document.createElement('a')
      fileLink.href = fileUrl
      fileLink.setAttribute('download', fileName)
      document.body.appendChild(fileLink)
      this.loading = false
      fileLink.click()
    }
  }
}
</script>
