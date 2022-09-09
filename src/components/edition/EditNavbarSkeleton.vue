<template>
  <div
    v-show="showEditNavbar && !noEditNavbarViews.includes(currentViewMode)"
    class="EditNavbarSkeleton datami-component container">
    <div
      v-if="gitObj"
      class="columns is-multiline is-mobile is-justify-content-end mb-2">
      <!-- UPLOAD FILE -->
      <div
        v-if="!onlyPreview"
        class="column py-0 is-5-mobile is-1-tablet">
        <ButtonImportData
          :locale="locale"
          :show-upload-file-dialog="showUploadFileDialog"
          @action="SendActionToParent"/>
      </div>

      <!-- EDIT VIEW CHOICES -->
      <div
        :class="`column py-0 is-4 is-offset-${ onlyPreview ? '4' : '3'} has-text-centered`">
        <EditModeBtns
          :only-preview="onlyPreview"
          :file-id="fileId"
          :locale="locale"/>
      </div>

      <!-- EDIT OR SAVE/COMMIT BUTTON -->
      <!-- class="column is-3 is-offset-1"> -->
      <div
        class="column py-0 is-12-mobile is-4-tablet is-3-desktop is-offset-1 edit-save-button">
        <b-button
          v-if="!onlyPreview"
          type="is-dark"
          expanded
          :loading="loading"
          :icon-left="currentEditViewMode === 'preview' ? 'pencil' : 'check' "
          size="is-small"
          @click="toggleButton()">
          <span v-if="currentEditViewMode === 'preview'">
            {{ t('actions.edit', locale) }}
          </span>
          <span v-else>
            {{ t('actions.save', locale) }}
          </span>
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { mixinGlobal } from '@/utils/mixins.js'

import ButtonImportData from '@/components/edition/ButtonImportData'
import EditModeBtns from '@/components/edition/EditModeBtns'

export default {
  name: 'EditNavbarSkeleton',
  components: {
    ButtonImportData,
    EditModeBtns
  },
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: undefined,
      type: String
    },
    onlyPreview: {
      default: false,
      type: Boolean
    },
    showUploadFileDialog: {
      default: false,
      type: Boolean
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {
      loading: false,
      noEditNavbarViews: ['dataviz']
    }
  },
  computed: {
    ...mapGetters({
      getEditNavbar: 'getFileEditNavbarStatus'
    }),
    showEditNavbar () {
      return this.getEditNavbar(this.fileId)
    }
  },
  methods: {
    ...mapActions({
      changeEditViewMode: 'git-data/changeEditViewMode',
      updateSaving: 'git-data/updateSaving'
    }),
    toggleButton () {
      if (this.currentEditViewMode === 'preview') {
        this.changeEditMode('edit')
      } else {
        this.commitChanges()
      }
      // track with matomo
      this.trackEvent('click', 'EditNavbarEditToggleBtn')
    },
    changeEditMode (code) {
      // console.log('C > EditNavbarSkeleton > changeEditMode > code :', code)
      this.changeEditViewMode({ fileId: this.fileId, mode: code })
    },
    SendActionToParent (event) {
      this.$emit('action', event)
    },
    commitChanges () {
      this.updateSaving({ fileId: this.fileId, isSaving: true })
    }
  }
}
</script>

<style scoped>

.edit-save-button {
  z-index: 3;
}

</style>
