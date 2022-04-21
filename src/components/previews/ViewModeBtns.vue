<template>
  <div class="ViewModeBtns">
    <!-- BUTTONS -->
    <!-- :class="`${ onlyPreview ? '' : 'ml-5'}`" -->
    <b-field
      v-if="fileTypeFamily === 'table' && hasCardsView"
      class="mr-4"
      custom-class="is-small edit-mode-btns">
      <b-tooltip
        v-for="btn in buttonsView"
        :key="btn.code"
        :label="`${t(btn.textCode, locale)}`"
        type="is-dark"
        position="is-top">
        <b-button
          :icon-left="btn.icon"
          :type="currentViewMode === btn.code ? 'is-dark' : ''"
          :active="currentViewMode === btn.code"
          size="is-small"
          @click="changeView(btn.code)"/>
      </b-tooltip>
    </b-field>

    <!-- DEBUG -->
    <div v-if="false">
      <p>
        currentViewMode: {{ currentViewMode }}
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
      buttonsView: viewsOptions
    }
  },
  beforeMount () {
    this.changeView('table')
  },
  methods: {
    ...mapActions({
      changeViewMode: 'git-data/changeViewMode'
    }),
    changeView (code) {
      this.changeViewMode({ fileId: this.fileId, mode: code })
    }
  }
}
</script>

<style>

/* .EditModeBtns > .field > .field-body > .field.has-addons {
  justify-content: center !important;
} */

</style>
