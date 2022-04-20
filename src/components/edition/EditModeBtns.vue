<template>
  <div class="EditModeBtns content is-flex is-justify-content-center">
    <!-- DEBUG -->
    <div
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
    </div>

    <!-- BUTTONS EDIT-->
    <b-field grouped>
      <b-field
        v-if="!onlyPreview"
        custom-class="is-small edit-mode-btns">
        <p
          v-for="btn in buttonsEdit"
          :key="`btn-edit-${btn.code}`"
          class="control">
          <b-tooltip
            :label="t(btn.textCode, locale)"
            type="is-dark"
            :position="`is-top`">
            <b-button
              :icon-left="btn.icon"
              :type="currentEditViewMode === btn.code ? 'is-dark' : ''"
              :active="currentEditViewMode === btn.code"
              size="is-small"
              @click="changeEdit(btn.code)"/>
          </b-tooltip>
        </p>
      </b-field>

      <!-- BUTTONS VIEWS -->
      <b-field
        v-if="fileTypeFamily === 'table' && hasCardsView"
        :class="`${ onlyPreview ? '' : 'ml-5'}`"
        custom-class="is-small edit-mode-btns">
        <p
          v-for="btn in buttonsView"
          :key="`btn-view-${btn.code}`"
          class="control">
          <b-tooltip
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
        </p>
      </b-field>
    </b-field>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import { mixinGlobal } from '@/utils/mixins.js'

import { editViewsOptions, viewsOptions } from '@/utils/fileTypesUtils.js'

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
      debug: false,
      buttonsView: viewsOptions,
      buttonsEdit: editViewsOptions
    }
  },
  beforeMount () {
    this.changeEdit('preview')
    this.changeView('table')
  },
  // computed: {
  //   getTooltipPosition () {
  //     const isFamilyTable = this.fileTypeFamily === 'table'
  //     // ${i === 0 ? 'left' : (i === buttonsEdit.length - 1) ? 'right' : 'top'}
  //   }
  // },
  methods: {
    ...mapActions({
      changeEditViewMode: 'git-data/changeEditViewMode',
      changeViewMode: 'git-data/changeViewMode'
    }),
    changeEdit (code) {
      // console.log('\nC > EditModeBtns > changeEditMode > code : ', code)
      this.changeEditViewMode({ fileId: this.fileId, mode: code })
    },
    changeView (code) {
      // console.log('\nC > EditModeBtns > changeViewMode > code : ', code)
      this.changeViewMode({ fileId: this.fileId, mode: code })
    }
  }
}
</script>

<style>

.EditModeBtns > .field > .field-body > .field.has-addons {
  justify-content: center !important;
}

</style>
