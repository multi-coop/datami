<template>
  <div class="ButtonReloadFile">
    <b-tooltip
      :label="t('reloadFile', locale)"
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
    gitObj: {
      default: undefined,
      type: Object
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
      t: 'git-translations/getTranslation'
    }),
    fileIsReloading () {
      // console.log('C > ButtonReloadFile > this.gitObj : ', this.gitObj)
      return this.gitObj && this.fileNeedsReload(this.gitObj.uuid)
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
      this.updateReloading({ fileId: this.gitObj.uuid, isLoading: true })
    }
  }
}
</script>
