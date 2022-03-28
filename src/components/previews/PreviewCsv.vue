<template>
  <div class="">
    PreviewCsv
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
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { mixinCsv } from '@/utils/mixins.js'

export default {
  name: 'PreviewCsv',
  mixins: [mixinCsv],
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
    }
  },
  data () {
    return {
      debug: true,
      data: undefined
    }
  },
  computed: {
    ...mapState({
    }),
    ...mapGetters({
    })
  },
  watch: {
    fileRaw (next) {
      if (next && next !== '') {
        // console.log('C > PreviewCsv > watch > fileRaw > next : \n', next)
        // console.log('C > PreviewCsv > watch > fileRaw > this.fileOptions : ', this.fileOptions)
        this.data = this.csvToObject(next, this.fileOptions)
      }
    }
  },
  beforeMount () {
    // console.log('C > PreviewCsv > beforeMount > ...')
  },
  mounted () {
  },
  methods: {
    ...mapActions({
    })
  }
}
</script>
