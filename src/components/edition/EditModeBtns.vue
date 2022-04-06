<template>
  <div class="EditModeBtns content">
    <div v-if="debug">
      <p>
        currentViewMode: {{ currentViewMode }}
      </p>
    </div>
    <b-field custom-class="is-small">
      <p
        v-for="btn in buttons"
        :key="btn.code"
        class="control">
        <b-tooltip
          :label="t(btn.textCode, locale)"
          type="is-dark"
          position="is-top">
          <b-button
            :icon-left="btn.icon"
            :type="currentViewMode === btn.code ? 'is-dark' : ''"
            :active="currentViewMode === btn.code"
            size="is-small"
            @click="changeMode(btn.code)"/>
        </b-tooltip>
      </p>
    </b-field>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { filesViewsOptions } from '@/utils/fileTypesUtils.js'

export default {
  name: 'EditModeBtns',
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
      debug: false,
      // active: 'preview',
      buttons: filesViewsOptions
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation',
      getViewMode: 'git-data/getViewMode'
    }),
    currentViewMode () {
      return this.getViewMode(this.gitObj.uuid)
    }
  },
  beforeMount () {
    this.changeMode('preview')
  },
  methods: {
    ...mapActions({
      changeViewMode: 'git-data/changeViewMode'
    }),
    changeMode (code) {
      // this.active = code
      // console.log('\nC > EditModeBtns > changeMode > code : ', code)
      this.changeViewMode({ fileId: this.gitObj.uuid, mode: code })
    }
  }
}
</script>
