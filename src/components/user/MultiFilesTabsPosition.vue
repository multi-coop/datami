<template>
  <div class="MultiFilesTabsPosition mt-2">
    <b-field>
      <p
        v-for="btn in buttons"
        :key="btn.id"
        class="control">
        <b-tooltip
          type="is-dark"
          multiline
          :label="`${t('tabs.switchPosition', locale)}: ${btn.id}`">
          <b-button
            :icon-left="btn.icon"
            type="is-grey"
            size="is-small"
            outlined
            @click="changePosition(btn)"/>
        </b-tooltip>
      </p>
    </b-field>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'MultiFilesTabsPosition',
  mixins: [
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
