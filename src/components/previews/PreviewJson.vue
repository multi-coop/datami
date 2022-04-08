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

    <PreviewHelpers
      :file-id="fileId"
      :file-family="'json'"
      :locale="locale"/>

    <!-- PREVIEW -->
    <div>
      <code><pre>{{ data }}</pre></code>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { mixinDiff, mixinJson } from '@/utils/mixins.js'

import PreviewHelpers from '@/components/previews/PreviewHelpers'

export default {
  name: 'PreviewJson',
  components: {
    PreviewHelpers
  },
  mixins: [mixinDiff, mixinJson],
  props: {
    fileId: {
      default: null,
      type: String
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
      beginEdit: false,
      data: undefined,
      edited: null
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation',
      getViewMode: 'git-data/getViewMode'
    }),
    gitObj () {
      return this.fileId && this.getGitInfosObj(this.fileId)
    },
    currentViewMode () {
      return this.getViewMode(this.gitObj.uuid)
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
