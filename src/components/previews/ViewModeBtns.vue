<template>
  <div class="ViewModeBtns">
    <!-- BUTTONS -->
    <b-field custom-class="is-small edit-mode-btns">
      <b-tooltip
        v-for="btn in buttons"
        :key="btn.code"
        :label="`${t(btn.textCode, locale)} ... 🚧 work in progress`"
        type="is-dark"
        position="is-top">
        <b-button
          :icon-left="btn.icon"
          :type="currentViewMode === btn.code ? 'is-dark' : ''"
          :active="currentViewMode === btn.code"
          size="is-small"
          disabled
          @click="changeMode(btn.code)"/>
      </b-tooltip>
    </b-field>
    <!-- DEBUG -->
    <div v-if="false">
      <p>
        currentViewMode: {{ currentViewMode }}
      </p>
      <p>
        currentEditViewMode: {{ currentEditViewMode }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import { mixinGlobal } from '@/utils/mixins.js'
import { viewsOptions } from '@/utils/fileTypesUtils.js'

export default {
  name: 'ViewModeBtns',
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: undefined,
      type: String
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {
      // debug: false,
      // active: 'preview',
      buttons: viewsOptions
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
      // this.changeViewMode({ fileId: this.fileId, mode: code })
    }
  }
}
</script>

<style>

/* .EditModeBtns > .field > .field-body > .field.has-addons {
  justify-content: center !important;
} */

</style>
