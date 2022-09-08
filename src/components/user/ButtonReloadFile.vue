<template>
  <div class="ButtonReloadFile datami-component">
    <b-tooltip
      :label="t('actions.reloadFile', locale)"
      type="is-dark"
      position="is-top">
      <b-button
        size="is-small"
        class="ml-1"
        icon-left="reload"
        :loading="loading"
        @click="ReloadFile()"/>
    </b-tooltip>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonReloadFile',
  mixins: [mixinGlobal],
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
  watch: {
    fileIsLoading (next) {
      if (!next) { this.loading = false }
    }
  },
  methods: {
    ...mapActions({
      updateReloading: 'git-data/updateReloading'
    }),
    ReloadFile () {
      this.loading = true
      // console.log('C > ButtonReloadFile > ReloadFile > this.gitObj : ', this.gitObj)
      this.updateReloading({ fileId: this.fileId, isLoading: true })

      // track with matomo
      this.trackEvent('click')
    }
  }
}
</script>
