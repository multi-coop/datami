<template>
  <!-- HELPERS -->
  <div class="PreviewHelpers columns is-multiline is-mobile">
    <div
      v-for="helper in getSettings"
      :key="helper"
      class="column">
      <PreviewHelperDivider
        :icon="getIcon(currentViewMode)"
        :code="helper"
        :locale="locale"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { mixinIcons } from '@/utils/mixins.js'

import PreviewHelperDivider from '@/components/previews/PreviewHelperDivider'

export default {
  name: 'PreviewHelpers',
  components: {
    PreviewHelperDivider
  },
  mixins: [mixinIcons],
  props: {
    fileId: {
      default: '',
      type: String
    },
    fileFamily: {
      default: '',
      type: String
    },
    locale: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      settings: {
        text: {
          edit: ['edition', 'edited'],
          diff: ['edited', 'original'],
          preview: ['edited']
        },
        table: {
          edit: ['edition'],
          diff: ['edited'],
          preview: ['edited']
        },
        json: {
          edit: ['edition'],
          diff: ['edited', 'original'],
          preview: ['edited']
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation',
      getViewMode: 'git-data/getViewMode'
    }),
    currentViewMode () {
      return this.getViewMode(this.fileId)
    },
    getSettings () {
      const settingsFileFamily = this.settings[this.fileFamily]
      const settingsView = settingsFileFamily[this.currentViewMode]
      return settingsView
    }
  }
}
</script>
