<template>
  <div class="PreviewMd content">
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
    <div>
      <ShowDown
        :markdown="content"
        flavor="github"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { mixinMd } from '@/utils/mixins.js'
import ShowDown from '@/components/previews/ShowDown'

export default {
  name: 'PreviewMd',
  components: {
    ShowDown
    // VueShowdown
  },
  mixins: [mixinMd],
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
      default: '',
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
      data: null,
      content: null
    }
  },
  computed: {
    ...mapState({
    }),
    ...mapGetters({
      t: 'git-translations/getTranslation'
    })
  },
  watch: {
    fileRaw (next) {
      if (next && next !== '') {
        // console.log('C > PreviewMd > watch > fileRaw > next : \n', next)
        // console.log('C > PreviewMd > watch > fileRaw > this.fileOptions : ', this.fileOptions)
        const dataRaw = this.mdToObject(next, this.fileOptions)
        this.data = dataRaw.data
        this.content = dataRaw.content
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
