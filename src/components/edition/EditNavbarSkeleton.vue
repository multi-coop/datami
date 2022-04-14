<template>
  <div class="EditNavbarSkeleton container">
    <div
      v-if="gitObj"
      class="columns is-multiline mb-2">
      <!-- EDIT VIEW CHOICES -->
      <div
        class="column pl-5 is-2 is-offset-5">
        <EditModeBtns
          v-show="!onlyPreview"
          :file-id="fileId"
          :locale="locale"/>
      </div>
      <!-- EDIT OR SAVE/COMMIT BUTTON -->
      <div
        class="column is-3 is-offset-2">
        <b-button
          v-if="!onlyPreview"
          type="is-dark"
          expanded
          :loading="loading"
          :icon-left="currentViewMode === 'preview' ? 'pencil' : 'check' "
          size="is-small"
          @click="toggleButton()">
          <span v-if="currentViewMode === 'preview'">
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
import { mapActions } from 'vuex'

import { mixinGlobal } from '@/utils/mixins.js'

// import ViewModeBtns from '@/components/previews/ViewModeBtns'
import EditModeBtns from '@/components/edition/EditModeBtns'

export default {
  name: 'EditNavbarSkeleton',
  components: {
    // ViewModeBtns,
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
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    ...mapActions({
      changeEditViewMode: 'git-data/changeEditViewMode',
      updateSaving: 'git-data/updateSaving'
    }),
    toggleButton () {
      if (this.currentViewMode === 'preview') {
        this.changeEditMode('edit')
      } else {
        this.commitChanges()
      }
    },
    changeEditMode (code) {
      // console.log('C > EditNavbarSkeleton > changeEditMode > code :', code)
      this.changeEditViewMode({ fileId: this.fileId, mode: code })
    },
    commitChanges () {
      this.updateSaving({ fileId: this.fileId, isSaving: true })
    }
  }
}
</script>
