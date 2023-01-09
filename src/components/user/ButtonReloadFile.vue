<template>
  <div class="ButtonReloadFile datami-component">
    <b-button
      size="is-small"
      :class="`ml-1 is-small ${isDarkMode ? 'has-background-dark has-text-white' : ''}`"
      :type="isDarkMode ? 'is-white' : ''"
      :outlined="isDarkMode"
      icon-left="reload"
      :loading="loading"
      @click="ReloadFile()"
      @mouseover="showGlobalTooltip($event, { position: 'top', type: 'info', label: t('actions.reloadFile', locale) })"
      @mouseleave="hideGlobalTooltip"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import { mixinTooltip, mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonReloadFile',
  mixins: [
    mixinTooltip,
    mixinGlobal
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
