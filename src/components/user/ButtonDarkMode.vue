<template>
  <div class="ButtonDarkMode datami-component">
    <b-button
      :class="`ml-1 is-small ${isDarkMode ? 'has-background-dark has-text-white' : ''}`"
      :type="isDarkMode ? 'is-white' : ''"
      :outlined="isDarkMode"
      :icon-left="`${isDarkMode ?'white-balance-sunny' : 'weather-night' }`"
      @click="switchContrast"
      @mouseover="showGlobalTooltip($event, { position: 'top', type: 'info', label: t(isDarkMode ? 'actions.setLightMode' : 'actions.setDarkMode', locale) })"
      @mouseleave="hideGlobalTooltip"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { mixinTooltip, mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonDarkMode',
  mixins: [
    mixinTooltip,
    mixinGlobal
  ],
  props: {
    locale: {
      default: 'en',
      type: String
    }
  },
  methods: {
    ...mapActions({
      toggleContrastMode: 'git-storage/toggleContrastMode'
    }),
    switchContrast () {
      this.toggleContrastMode()
    }
  }
}
</script>
