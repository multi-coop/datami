<template>
  <div class="ButtonDarkMode datami-component">
    <b-tooltip
      :label="t(isDarkMode ? 'actions.setLightMode' : 'actions.setDarkMode', locale)"
      :type="`${isDarkMode ? 'is-white' : 'is-dark'}`">
      <b-button
        :class="`ml-1 is-small ${isDarkMode ? 'has-background-dark has-text-white' : ''}`"
        :type="isDarkMode ? 'is-white' : ''"
        :outlined="isDarkMode"
        :icon-left="`${isDarkMode ?'white-balance-sunny' : 'weather-night' }`"
        @click="switchContrast"/>
    </b-tooltip>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonDarkMode',
  mixins: [mixinGlobal],
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
