<template>
  <div class="EditModeBtns gitribute-component content is-flex is-justify-content-center">
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
      debug: false,
      buttonsEdit: editViewsOptions
    }
  },
  beforeMount () {
    this.changeEdit('preview')
    // this.changeView('table')
  },
  methods: {
    ...mapActions({
      changeEditViewMode: 'git-data/changeEditViewMode'
    }),
    changeEdit (code) {
      // console.log('\nC > EditModeBtns > changeEditMode > code : ', code)
      this.changeEditViewMode({ fileId: this.fileId, mode: code })
    }
  }
}
</script>

<style>

.EditModeBtns > .field > .field-body > .field.has-addons {
  justify-content: center !important;
}

@media(max-width: 768px){
  .EditModeBtns{
    justify-content: end !important;
  }
}

</style>
