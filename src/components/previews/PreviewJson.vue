<template>
  <div class="PreviewJson content">
    <!-- DEBUG -->
    <div
      v-if="debug"
      class="columns is-multiline">
      <div class="column is-full">
        <p>
          data:
          <code>
            <pre>{{ data }}</pre>
          </code>
        </p>
      </div>
    </div>
    <EditNavbarSkeleton
      :git-obj="gitObj"
      :locale="locale"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import EditNavbarSkeleton from '@/components/edition/EditNavbarSkeleton'

export default {
  name: 'PreviewJson',
  components: {
    EditNavbarSkeleton
  },
  mixins: [],
  props: {
    gitObj: {
      default: undefined,
      type: Object
    },
    fileInfos: {
      default: undefined,
      type: Object
    },
    fileOptions: {
      default: undefined,
      type: Object
    },
    fileRaw: {
      default: undefined,
      type: String
    },
    locale: {
      default: '',
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      data: undefined
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation',
      getViewMode: 'git-data/getViewMode'
    }),
    currentViewMode () {
      return this.getViewMode(this.gitObj.id)
    }
  },
  watch: {
    fileRaw (next) {
      if (next) {
        this.data = this.fileRaw
      }
    }
  },
  beforeMount () {
  },
  mounted () {
  },
  methods: {
    ...mapActions({
    })
  }
}
</script>
