<template>
  <div class="EditNavbarSkeleton container">
    <div
      v-if="gitObj"
      class="columns is-multiline mb-2">
      <!-- EDITION OPTIONS -->
      <!-- <div class="column is-5">
        Buttons for <code>{{ currentViewMode }}</code> view
        for <code>.{{ gitObj.filetype }}</code> file (<code>{{ fileTypeFamily }}</code>)
        &nbsp;
      </div> -->
      <!-- VIEW CHOICES -->
      <div class="column pl-5 is-2 is-offset-5">
        <EditModeBtns
          :file-id="fileId"
          :locale="locale"/>
      </div>
      <!-- EDIT OR SAVE/COMMIT BUTTON -->
      <div
        class="column is-3 is-offset-2">
        <b-button
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
import { mapGetters, mapActions } from 'vuex'

import EditModeBtns from '@/components/edition/EditModeBtns'

export default {
  name: 'EditNavbarSkeleton',
  components: {
    EditModeBtns
  },
  props: {
    fileId: {
      default: undefined,
      type: String
    },
    fileTypeFamily: {
      default: null,
      type: String
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
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation',
      getViewMode: 'git-data/getViewMode',
      getGitInfosObj: 'getGitInfosObj'
    }),
    gitObj () {
      return this.fileId && this.getGitInfosObj(this.fileId)
    },
    currentViewMode () {
      return this.getViewMode(this.fileId)
    }
  },
  methods: {
    ...mapActions({
      changeViewMode: 'git-data/changeViewMode',
      updateSaving: 'git-data/updateSaving'
    }),
    toggleButton () {
      if (this.currentViewMode === 'preview') {
        this.changeMode('edit')
      } else {
        this.commitChanges()
      }
    },
    changeMode (code) {
      // console.log('C > EditNavbarSkeleton > changeMode > code :', code)
      this.changeViewMode({ fileId: this.fileId, mode: code })
    },
    commitChanges () {
      this.updateSaving({ fileId: this.fileId, isSaving: true })
    }
  }
}
</script>
