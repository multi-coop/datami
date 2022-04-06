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

    <!-- HELPERS -->
    <div class="columns is-mobile">
      <!-- EDITED -->
      <div
        v-show="currentViewMode !== 'preview'"
        class="column is-6 has-text-centered">
        <div
          v-show="currentViewMode !== 'preview'"
          class="divider my-0">
          <span class="is-capitalized is-size-6 has-text-grey-light">
            <b-icon
              :icon="getIconEdit"
              size="is-small"/>
            {{ t( 'edited', locale) }}
          </span>
        </div>
      </div>
      <!-- ORIGINAL -->
      <div
        class="column has-text-centered">
        <div
          v-show="currentViewMode === 'preview'"
          class="divider my-0">
          <span class="is-capitalized is-size-6 has-text-grey-light">
            <b-icon
              :icon="getIconPreview"
              size="is-small"/>
            {{ t( 'previewView', locale) }}
          </span>
        </div>
        <span
          v-show="currentViewMode === 'diff'"
          class="is-size-6 has-text-weight-bold has-text-grey-light">
          <div
            class="divider my-0 pl-4">
            <span class="is-capitalized is-size-6 has-text-grey-light">
              <b-icon
                :icon="getIconPreview"
                size="is-small"/>
              {{ t( 'original', locale) }}
            </span>
          </div>
        </span>
        <span
          v-show="currentViewMode === 'edit'"
          class="is-size-6 has-text-weight-bold has-text-grey-light">
          <div
            class="divider my-0 pl-4">
            <span class="is-capitalized is-size-6 has-text-grey-light">
              <b-icon
                :icon="getIconPreview"
                size="is-small"/>
              {{ t( 'editedPreview', locale) }}
            </span>
          </div>
        </span>
      </div>
    </div>

    <!-- VIEWS -->
    <div class="columns is-mobile">
      <!-- EDIT VIEW -->
      <div
        v-show="currentViewMode === 'edit'"
        :class="`column is-half pr-3`">
        <b-field>
          <b-input
            v-model="edited"
            custom-class="has-background-light"
            type="textarea"
            :rows="numberLines"/>
        </b-field>
      </div>

      <!-- DIFF VIEW -->
      <!-- <div
        v-show="currentViewMode === 'diff'"
        :class="`column is-full`">
        <div
          v-if="content"
          v-html="getDiffHtmlUnified"/>
      </div> -->
      <div
        v-show="currentViewMode === 'diff'"
        :class="`column is-half pr-6`">
        <ShowDown
          v-if="content"
          :markdown="getDiffHtmlChars"
          flavor="github"/>
      </div>

      <!-- DIVIDER -->
      <div
        v-show="currentViewMode !== 'preview'"
        class="divider is-vertical mx-0">
        <b-icon
          v-if="currentViewMode === 'diff'"
          :icon="getIconDiff"
          size="is-small"/>
        <b-icon
          v-if="currentViewMode === 'edit'"
          :icon="getIconEdit"
          size="is-small"/>
      </div>

      <!-- PREVIEW -->
      <div
        :class="`column ${currentViewMode !== 'preview' ? 'pl-6' : ''}`">
        <ShowDown
          :markdown="currentViewMode === 'diff' ? content : edited"
          flavor="github"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { mixinMd } from '@/utils/mixins.js'
import ShowDown from '@/components/previews/ShowDown'

import { filesViewsOptions } from '@/utils/fileTypesUtils.js'

// see : https://github.com/kpdecker/jsdiff
import { createTwoFilesPatch, diffWords } from 'diff'

import * as Diff2Html from 'diff2html'
import 'diff2html/bundles/css/diff2html.min.css'

export default {
  name: 'PreviewMd',
  components: {
    ShowDown
  },
  mixins: [mixinMd],
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
      getViewMode: 'git-data/getViewMode',
      getGitInfosObj: 'getGitInfosObj',
      getFileToken: 'git-data/getFileToken',
      fileNeedsSaving: 'git-data/fileNeedsSaving'
    }),
    gitObj () {
      return this.fileId && this.getGitInfosObj(this.fileId)
    },
    currentViewMode () {
      return this.getViewMode(this.gitObj.uuid)
    },
    getIconDiff () {
      return filesViewsOptions.find(i => i.code === 'diff').icon
    },
    getIconEdit () {
      return filesViewsOptions.find(i => i.code === 'edit').icon
    },
    getIconPreview () {
      return filesViewsOptions.find(i => i.code === 'preview').icon
    },
    numberLines () {
      let result = 2
      if (this.edited) { result = this.edited.split(/\r\n|\r|\n/).length + result }
      return result
    },
    getUnifiedDiff () {
      // console.log('C > PreviewMd > getUnifiedDiff  > createTwoFilesPatch : \n', createTwoFilesPatch)
      const fileName = this.gitObj.filefullname
      const diffStr = createTwoFilesPatch(fileName, fileName, this.content, this.edited)
      return diffStr
    },
    getCharDiff () {
      // console.log('C > PreviewMd > getCharDiff  > diffChars : \n', diffChars)
      // const diffStr = diffChars(this.content, this.edited)
      const diffStr = diffWords(this.content, this.edited)
      return diffStr
    },
    getDiffHtmlUnified () {
      const diff = this.getUnifiedDiff
      const options = {
        drawFileList: false,
        matching: 'lines',
        outputFormat: 'side-by-side'
        // outputFormat: 'line-by-line'
      }
      return Diff2Html.html(diff, options)
    },
    getDiffHtmlChars () {
      const diff = this.getCharDiff
      // console.log('C > PreviewMd > getDiffHtmlChars  > diff : \n', diff)
      let diffText = ''
      diff.forEach((part) => {
        // green for additions, red for deletions
        // grey for common parts
        let fragment
        const spanClass = part.added ? 'git-ins' : part.removed ? 'git-del' : null
        if (spanClass) {
          fragment = `<span class="${spanClass}">${part.value}</span>`
        } else {
          fragment = part.value
        }
        diffText += fragment
      })
      // console.log('C > PreviewMd > getDiffHtmlChars  > diffText : \n', diffText)
      return diffText
    },
    fileIsSaving () {
      const resp = !this.gitObj || this.fileNeedsSaving(this.fileId)
      return resp
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
    },
    fileIsSaving (next) {
      if (next) {
        console.log('C > PreviewMd > watch > fileIsSaving > next : ', next)
        this.bufferizeEdited()
      }
    }
  },
  methods: {
    ...mapActions({
      updateBuffer: 'git-data/updateBuffer'
    }),
    bufferizeEdited () {
      const fileFullnameClean = this.gitObj.filefullname.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')
      const commitData = {
        gitObj: this.gitObj,
        edited: this.edited,
        newBranch: `branch-${fileFullnameClean}-${this.fileId}`,
        token: this.getFileToken(this.fileId)
      }
      this.updateBuffer({ ...commitData, addToBuffer: true })
    }
  }
}
</script>

<style>

.git-ins {
  text-decoration: none !important;
  background-color: #d4fcbc !important;
}
.git-del {
  text-decoration: line-through !important;
  background-color: #fbb6c2 !important;
  color: #555 !important;
}

</style>
