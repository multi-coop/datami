<template>
  <b-button
    :type="isDarkMode ? 'is-white' : ''"
    :outlined="isDarkMode"
    :class="`ButtomOptionsSwitch datami-component ${isDarkMode ? 'datami-darkmode has-text-white' : ''}`"
    icon-left="cog-outline"
    size="is-small"
    @click="clickBtn"
    @mouseover="showGlobalTooltip($event, { position: 'top', type: 'info', label: t(`user.${showOptions ? 'hideOptions' : 'showOptions'}`, locale) })"
    @mouseleave="hideGlobalTooltip"/>
</template>

<script>

import { mapGetters } from 'vuex'

import { mixinTooltip } from '@/utils/mixins.js'

export default {
  name: 'ButtomOptionsSwitch',
  mixins: [mixinTooltip],
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
      showOptions: false
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation',
      getViewMode: 'git-data/getViewMode',
      isDarkMode: 'git-storage/isDarkMode'
    }),
    currentViewMode () {
      return this.getViewMode(this.fileId)
    }
  },
  beforeMount () {
    this.showOptions = this.onlyPreview
  },
  methods: {
    clickBtn () {
      this.showOptions = !this.showOptions
      this.$emit('click')
    }
  }
}
</script>
