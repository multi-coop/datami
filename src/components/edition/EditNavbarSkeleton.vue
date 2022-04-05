<template>
  <div class="EditNavbarSkeleton content">
    <div class="columns is-multiline mb-4">
      <!-- FILE TITLE -->
      <div class="column is-2">
        <EditModeBtns
          :git-obj="gitObj"
          :locale="locale"/>
      </div>
      <!-- EDITION OPTIONS -->
      <div
        v-if="viewMode !== 'preview'"
        class="column is-8">
        buttons edition for <code>.{{ gitObj.filetype }}</code> file
      </div>
      <!-- SAVE/COMMIT -->
      <div
        v-if="viewMode !== 'preview'"
        class="column is-2">
        <b-button
          type="is-dark"
          expanded
          icon-left="check"
          size="is-small">
          {{ t( 'save', locale) }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import EditModeBtns from '@/components/edition/EditModeBtns'

export default {
  name: 'EditNavbarSkeleton',
  components: {
    EditModeBtns
  },
  props: {
    gitObj: {
      default: undefined,
      type: Object
    },
    viewMode: {
      default: 'preview',
      type: String
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation'
    })
  }
}
</script>
