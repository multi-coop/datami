<template>
  <div class="EditNavbarSkeleton content">
    <div class="columns is-multiline mb-4">
      <!-- FILE TITLE -->
      <div class="column is-3">
        <EditModeBtns
          :git-obj="gitObj"
          :locale="locale"/>
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
