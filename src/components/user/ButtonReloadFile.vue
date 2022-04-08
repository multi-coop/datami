<template>
  <div class="ButtonReloadFile">
    <b-tooltip
      :label="t('actions.reloadFile', locale)"
      type="is-dark"
      position="is-left">
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
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ButtonReloadFile',
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
  computed: {
    ...mapGetters({
      fileNeedsReload: 'git-data/fileNeedsReload',
      t: 'git-translations/getTranslation',
      getGitInfosObj: 'getGitInfosObj'
    }),
    gitObj () {
      return this.fileId && this.getGitInfosObj(this.fileId)
    },
    fileIsReloading () {
      // console.log('C > ButtonReloadFile > this.gitObj : ', this.gitObj)
      return this.gitObj && this.fileNeedsReload(this.fileId)
    }
  },
  watch: {
    fileIsReloading (next) {
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
    }
  }
}
</script>
