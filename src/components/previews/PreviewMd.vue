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
        :class="`column is-full`">
        <!-- <ShowDownEditDiff
          :edited.sync="edited"
          :content="content"/> -->
        <!-- <pre><code>{{ edited }}</code></pre> -->
        <div
          v-if="content"
          v-html="getDiffHtml"/>
        <!-- <code v-if="content">
          {{ getDiff }}
        </code> -->
      </div>
      <!-- PREVIEW -->
      <div
        v-show="currentViewMode !== 'diff'"
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
import { createTwoFilesPatch } from 'diff'

import * as Diff2Html from 'diff2html'
import 'diff2html/bundles/css/diff2html.min.css'

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
    },
    getDiff () {
      // console.log('C > PreviewMd > getDiff  > diffChars : \n', diffChars)
      const fileName = this.gitObj.filefullname
      const diffStr = createTwoFilesPatch(fileName, fileName, this.content, this.edited)
      return diffStr
    },
    getDiffHtml () {
      const diff = this.getDiff
      const options = {
        drawFileList: false,
        matching: 'lines',
        outputFormat: 'side-by-side'
        // outputFormat: 'line-by-line'
      }
      return Diff2Html.html(diff, options)
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
