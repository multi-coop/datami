<template>
  <div class="EditNavbarSkeleton container">
    <div
      v-if="gitObj"
      class="columns is-multiline mb-2">
      <!-- EDITION OPTIONS -->
      <div
        class="column is-6">
        buttons edition for <code>.{{ gitObj.filetype }}</code> file (<code>{{ fileTypeFamily }}</code>)
      </div>
      <!-- FILE TITLE -->
      <div class="column is-3">
        <EditModeBtns
          :file-id="fileId"
          :locale="locale"/>
      </div>
      <!-- EDIT OR SAVE/COMMIT BUTTON -->
      <div
        class="column is-3">
        <b-button
          type="is-dark"
          expanded
          :loading="loading"
          :icon-left="currentViewMode === 'preview' ? 'pencil' : 'check' "
          size="is-small"
          @click="toggleButton()">
          <span v-if="currentViewMode === 'preview'">
            {{ t( 'edit', locale) }}
          </span>
          <span v-else>
            {{ t( 'save', locale) }}
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
      return this.getViewMode(this.gitObj.uuid)
    }
  },
  methods: {
    ...mapActions({
      changeViewMode: 'git-data/changeViewMode'
    }),
    toggleButton () {
      if (this.currentViewMode === 'preview') {
        this.changeMode('edit')
      } else {
        this.commitChanges(this.gitObj.uuid)
      }
    },
    commitChanges (fileId) {
      console.log('C > EditNavbarSkeleton > commitChanges > fileId :', fileId)
    },
    changeMode (code) {
      // console.log('C > EditNavbarSkeleton > changeMode > code :', code)
      this.changeViewMode({ fileId: this.gitObj.uuid, mode: code })
    }
  }
}
</script>
