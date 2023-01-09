<template>
  <div
    class="EditModeBtns datami-component px-2 content mb-0 is-flex is-align-items-center is-justify-content-center"
    style="z-index: 2">
    <!-- DEBUG -->
    <!-- <div
      v-if="debug"
      class="columns">
      <div class="column is-6">
        <p>
          currentEditViewMode: <code>{{ currentEditViewMode }}</code>
        </p>
        <p>
          currentViewMode: <code>{{ currentViewMode }}</code>
        </p>
        <p>
          hasCardsView: <code>{{ hasCardsView }}</code>
        </p>
      </div>
      <div class="column is-6">
        <p>
          gitObj: <br><pre><code>{{ gitObj }}</code></pre>
        </p>
      </div>
    </div> -->

    <!-- BUTTONS EDIT-->
    <b-field grouped>
      <b-field
        v-if="!onlyPreview"
        custom-class="is-small edit-mode-btns">
        <p
          v-for="btn in buttonsEdit"
          :key="`btn-edit-${btn.code}`"
          class="control edit-mode-button mb-0">
          <b-tooltip
            :label="t(btn.textCode, locale)"
            :type="`${isDarkMode ? 'is-white' : 'is-dark'}`"
            :position="`is-top`">
            <b-button
              :class="`datami-darkmode-border-${isDarkMode ? 'white has-text-white' : 'dark' }`"
              :icon-left="btn.icon"
              :type="getBtnType(btn.code)"
              :active="currentEditViewMode === btn.code"
              size="is-small"
              @click="changeEdit(btn.code)"/>
          </b-tooltip>
        </p>
      </b-field>
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
    onlyPreview: {
      default: true,
      type: Boolean
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {
      // cssFiles: [
      //   'styles/components/edition/datami-edit-mode-buttons.css'
      // ],
      debug: false,
      buttonsEdit: editViewsOptions
    }
  },
  // beforeMount () {
  //   // console.log('\nC > EditModeBtns > beforeMount ... : ')
  //   this.changeEdit('preview')
  // },
  methods: {
    getBtnType (btnCode) {
      const isCurrentEditMode = this.currentEditViewMode === btnCode
      const isDarkMode = this.isDarkMode
      if (isCurrentEditMode && !isDarkMode) {
        return 'is-dark'
      } else if (isCurrentEditMode && isDarkMode) {
        return 'is-white'
      } else if (!isCurrentEditMode && isDarkMode) {
        return 'is-dark'
      } else if (!isCurrentEditMode && !isDarkMode) {
        return 'is-white'
      }
    },
    ...mapActions({
      changeEditViewMode: 'git-data/changeEditViewMode'
    }),
    changeEdit (code) {
      // console.log('\nC > EditModeBtns > changeEditMode > code : ', code)
      this.changeEditViewMode({ fileId: this.fileId, mode: code })

      // track with matomo
      this.trackEvent(code)
    }
  }
}
</script>
