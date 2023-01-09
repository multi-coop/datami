<template>
  <div class="MultiFilesTabsPosition mt-2">
    <b-field>
      <p
        v-for="btn in buttons"
        :key="btn.id"
        class="control">
        <b-button
          :icon-left="btn.icon"
          size="is-small"
          :class="`ml-1 is-small ${isDarkMode ? 'has-background-dark has-text-white' : ''}`"
          :type="isDarkMode ? 'is-white' : 'is-grey'"
          outlined
          @mouseover="showGlobalTooltip($event, { position: 'right', type: 'info', label: `${t('tabs.switchPosition', locale)}: ${t('tabs.' + btn.id, locale)}` })"
          @mouseleave="hideGlobalTooltip"
          @click="changePosition(btn)"/>
      </p>
    </b-field>
  </div>
</template>

<script>
import { mixinTooltip, mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'MultiFilesTabsPosition',
  mixins: [
    mixinTooltip,
    mixinGlobal
  ],
  props: {
    defaultDisplay: {
      default: 'horizontal',
      type: String
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {
      activeButton: undefined,
      buttons: [
        {
          id: 'horizontal',
          icon: 'table-row',
          position: 'horizontal'
        },
        {
          id: 'vertical',
          icon: 'table-column',
          position: 'vertical'
        }
      ]
    }
  },
  beforeMount () {
    const defaultDisplay = this.buttons.find(btn => btn.id === this.defaultDisplay)
    this.activeButton = defaultDisplay
  },
  methods: {
    isActive (btn) {
      return btn.id === this.activeButton.id
    },
    changePosition (btn) {
      // console.log('C > MultiFilesTabsPosition > changePosition > btn : ', btn)
      this.activeButton = btn
      this.$emit('switch', btn)

      // track with matomo
      this.trackEvent(btn.id)
    }
  }

}
</script>
