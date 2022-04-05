<template>
  <div class="PreviewMd content">
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
        <p>
          currentViewMode : {{ currentViewMode }}
        </p>
      </div>
    </div>
    <div class="columns is-mobile">
      <!-- EDIT VIEW -->
      <div
        v-show="currentViewMode === 'edit'"
        :class="`column is-half`">
        <b-input
          v-model="edited"
          type="textarea"
          :rows="numberLines"/>
      </div>
      <!-- DIFF VIEW -->
      <div
        v-show="currentViewMode === 'diff'"
        :class="`column is-half`">
        <!-- <ShowDownEditDiff
          :edited.sync="edited"
          :content="content"/> -->
        <pre><code>{{ edited }}</code></pre>
      </div>
      <!-- PREVIEW -->
      <div
        :class="`column`">
        <ShowDown
          :markdown="currentViewMode === 'diff' ? content : edited"
          flavor="github"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mixinMd } from '@/utils/mixins.js'
import ShowDown from '@/components/previews/ShowDown'

export default {
  name: 'PreviewMd',
  components: {
    ShowDown
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
      // viewMode: 'preview',
      data: null,
      content: null,
      edited: null
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation',
      getViewMode: 'git-data/getViewMode'
    }),
    currentViewMode () {
      return this.getViewMode(this.gitObj.id)
    },
    numberLines () {
      let result = 2
      if (this.edited) { result = this.edited.split(/\r\n|\r|\n/).length + result }
      return result
    }
  },
  watch: {
    fileRaw (next) {
      if (next && next !== '') {
        // console.log('C > PreviewMd > watch > fileRaw > next : \n', next)
        // console.log('C > PreviewMd > watch > fileRaw > this.fileOptions : ', this.fileOptions)
        const dataRaw = this.mdToObject(next, this.fileOptions)
        this.data = dataRaw.data
        this.content = dataRaw.content
        this.edited = dataRaw.content
      }
    }
  }
}
</script>
