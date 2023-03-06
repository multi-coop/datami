<template>
  <div
    class="FileTitle datami-component"
    style="z-index: 2">
    <div
      class="is-flex is-align-items-center"
      @click="toggleDialog">
      <span :class="`px-2 is-size-6-mobile is-size-5-tablet is-size-4-desktop ${currentViewMode === 'map' ? 'text-shadow' : ''} ${isDarkMode && currentViewMode !== 'map' ? 'datami-darkmode-white-text' : 'has-text-dark'}`">
        {{ title }}
      </span>
      <HoverableIconWithTooltip
        :custom-class="'ml-1 mr-6 has-text-grey-light'"
        :size="'is-small'"
        :icon="'information-outline'"
        :position="'right'"
        :type="'info'"
        :label="t('file.fileInfos', locale)"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  mixinGlobal
} from '@/utils/mixins.js'

export default {
  name: 'FileTitle',
  components: {
    HoverableIconWithTooltip: () => import(/* webpackChunkName: "HoverableIconWithTooltip" */ '@/components/user/HoverableIconWithTooltip.vue')
  },
  mixins: [
    mixinGlobal
  ],
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
