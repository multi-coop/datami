<template>
  <div class="EditModeBtns content">
    <!-- DEBUG -->
    <div v-if="debug">
      <p>
        currentEditViewMode: {{ currentEditViewMode }}
      </p>
    </div>
    <!-- BUTTONS -->
    <b-field custom-class="is-small edit-mode-btns">
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
            :type="currentEditViewMode === btn.code ? 'is-dark' : ''"
            :active="currentEditViewMode === btn.code"
            size="is-small"
            @click="changeMode(btn.code)"/>
        </b-tooltip>
      </p>
    </b-field>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import { mixinGlobal } from '@/utils/mixins.js'

import { editViewsOptions } from '@/utils/fileTypesUtils.js'

export default {
  name: 'EditModeBtns',
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
      debug: false,
      // active: 'preview',
      buttons: editViewsOptions
    }
  },
  beforeMount () {
    this.changeMode('preview')
  },
  methods: {
    ...mapActions({
      changeEditViewMode: 'git-data/changeEditViewMode'
    }),
    changeMode (code) {
      // this.active = code
      // console.log('\nC > EditModeBtns > changeMode > code : ', code)
      this.changeEditViewMode({ fileId: this.fileId, mode: code })
    }
  }
}
</script>

<style>

.EditModeBtns > .field > .field-body > .field.has-addons {
  justify-content: center !important;
}

</style>
