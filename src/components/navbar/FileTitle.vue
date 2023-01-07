<template>
  <div
    class="FileTitle datami-component"
    style="z-index: 2">
    <div class="is-flex is-align-items-center">
      <span :class="`px-2 is-size-6-mobile is-size-5-tablet is-size-4-desktop ${currentViewMode === 'map' ? 'text-shadow' : ''} ${isDarkMode && currentViewMode !== 'map' ? 'datami-darkmode-white-text' : 'has-text-dark'}`">
        {{ title }}
      </span>
      <b-tooltip
        :label="t('file.fileInfos', locale)"
        :type="`${isDarkMode ? 'is-white' : 'is-dark'}`"
        position="is-top">
        <b-icon
          icon="information-outline"
          size="is-small"
          class="ml-1 mr-6 has-text-grey-light"
          @click.native="toggleDialog"/>
      </b-tooltip>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'FileTitle',
  mixins: [mixinGlobal],
  props: {
    title: {
      default: '',
      type: String
    },
    fileId: {
      default: '',
      type: String
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  computed: {
    ...mapGetters({
      isDarkMode: 'git-storage/isDarkMode'
    })
  },
  methods: {
    toggleDialog () {
      this.updateFileDialogs('FileInfos', { action: 'toggleFileInfos' })
      this.$emit('toggleInfos')
    }
  }
}
</script>

<style scoped>
.file-infos {
  min-width: 37em;
}
.text-shadow {
  text-shadow: 0 0 10px white, 0 0 10px white;
}
.datami-darkmode-white-text{
  color: white !important;
}
</style>
