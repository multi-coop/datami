<template>
  <div class="PreviewMd datami-component content">
    <!-- DEBUG -->
    <div
      v-if="debug"
      class="columns is-multiline">
      <div class="column is-full">
        <p>
          currentEditViewMode : <code>{{ currentEditViewMode }}</code>
        </p>
      </div>
      <div class="column is-6">
        <p>
          contentData:
          <code>
            <pre>{{ contentData }}</pre>
          </code>
        </p>
        <p>
          content:
          <code>
            <pre>{{ content }}</pre>
          </code>
        </p>
      </div>
      <div class="column is-6">
        <p>
          contentDataEdited:
          <code>
            <pre>{{ contentDataEdited }}</pre>
          </code>
        </p>
        <p>
          contentEdited:
          <code>
            <pre>{{ contentEdited }}</pre>
          </code>
        </p>
      </div>
    </div>

    <!-- LOADERS -->
    <div v-if="fileIsLoading">
      <LoaderEditNavbar
        :file-id="fileId"
        :only-preview="onlyPreview"/>
      <LoaderMD/>
    </div>

    <div v-if="!fileIsLoading">
      <!-- HELPERS -->
      <PreviewHelpers
        v-if="!onlyPreview"
        :file-id="fileId"
        :file-family="'text'"
        :locale="locale"/>

      <!-- DEBUGGING -->
      <div
        v-if="debug"
        class="columns is-multiline">
        <!-- DEBUG EDITED -->
        <div
          v-if="true && fileContentData"
          class="column is-6">
          <p>
            fileContentData:<br>
            <pre>{{ JSON.stringify(fileContentData, null, 2) }}</pre>
          </p>
        </div>
        <div
          v-if="true && fileContent"
          class="column is-6">
          <p>
            fileContent:<br>
            <pre>{{ JSON.stringify(fileContent, null, 2) }}</pre>
          </p>
        </div>
        <div
          v-if="true && fileContentDataEdited"
          class="column is-6">
          <p>
            fileContentDataEdited:<br>
            <pre>{{ JSON.stringify(fileContentDataEdited, null, 2) }}</pre>
          </p>
        </div>
        <div
          v-if="true && fileContentEdited"
          class="column is-6">
          <p>
            fileContentEdited:<br>
            <pre>{{ JSON.stringify(fileContentEdited, null, 2) }}</pre>
          </p>
        </div>
      </div>

      <!-- VIEWS -->
      <div
        v-if="contentEdited"
        class="columns is-mobile">
        <!-- EDIT VIEW -->
        <div
          v-show="currentEditViewMode === 'edit'"
          :class="`column is-half pr-3`">
          <p class="is-italic">
            {{ t('preview.yamlPart', locale) }}
          </p>
          <div class="is-flex is-flex-direction-column">
            <b-field class="edit-md-data-wrapper">
              <!-- :rows="numberLinesData" -->
              <b-input
                v-model="contentDataEdited"
                custom-class="edit-md mb-4 edit-md-data"
                type="textarea"
                @input="resizeTextarea('edit-md-data')"/>
            </b-field>
          </div>
          <p class="is-italic">
            {{ t('preview.textPart', locale) }}
          </p>
          <div class="is-flex is-flex-direction-column">
            <b-field class="edit-md-content-wrapper">
              <!-- :rows="numberLines" -->
              <b-input
                v-model="contentEdited"
                custom-class="edit-md edit-md-content"
                type="textarea"
                @input="resizeTextarea('edit-md-content')"/>
            </b-field>
          </div>
        </div>

        <!-- DIFF VIEW -->
        <div
          v-show="currentEditViewMode === 'diff'"
          :class="`column is-half pr-3`">
          <p class="is-italic">
            {{ t('preview.yamlPart', locale) }}
          </p>
          <div
            class="diff-data"
            v-html="getMdDiffHtmlCharsData"/>
          <p class="is-italic">
            {{ t('preview.textPart', locale) }}
          </p>
          <ShowDown
            v-if="content"
            :markdown="getMdDiffHtmlChars"
            flavor="github"/>
        </div>

        <!-- DIVIDER -->
        <div
          v-show="currentEditViewMode !== 'preview'"
          class="divider is-vertical mx-0">
          <b-icon
            v-if="currentEditViewMode === 'diff'"
            :icon="getIcon(currentEditViewMode)"
            size="is-small"/>
          <b-icon
            v-if="currentEditViewMode === 'edit'"
            :icon="getIcon(currentEditViewMode)"
            size="is-small"/>
        </div>

        <!-- PREVIEW -->
        <div
          :class="`column ${currentEditViewMode !== 'preview' ? 'is-6 pl-3 pr-5' : ''}`">
          <p
            v-if="currentEditViewMode !== 'preview'"
            class="is-italic">
            {{ t('preview.yamlPart', locale) }}
          </p>
          <div
            v-if="currentEditViewMode !== 'preview'"
            :class="diff-data"
            v-html="currentEditViewMode === 'diff' ? getDataString(contentData) : contentDataEdited"/>
          <p
            v-if="currentEditViewMode !== 'preview'"
            class="is-italic">
            {{ t('preview.textPart', locale) }}
          </p>
          <ShowDown
            :markdown="currentEditViewMode === 'diff' ? content : contentEdited"
            flavor="github"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import {
  mixinGlobal,
  mixinData,
  mixinCommit,
  mixinIcons,
  mixinDiff,
  mixinMd
} from '@/utils/mixins.js'

import LoaderEditNavbar from '@/components/loaders/LoaderEditNavbar'
import LoaderMD from '@/components/loaders/LoaderMD'

import PreviewHelpers from '@/components/previews/PreviewHelpers'
import ShowDown from '@/components/previews/ShowDown'

// // see : https://github.com/kpdecker/jsdiff
// import { createTwoFilesPatch, diffWords } from 'diff'

// import * as Diff2Html from 'diff2html'
// import 'diff2html/bundles/css/diff2html.min.css'

export default {
  name: 'PreviewMd',
  components: {
    LoaderEditNavbar,
    LoaderMD,
    PreviewHelpers,
    ShowDown
  },
  mixins: [
    mixinGlobal,
    mixinData,
    mixinCommit,
    mixinIcons,
    mixinDiff,
    mixinMd
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    fileRaw: {
      default: '',
      type: String
    },
    fileClientRaw: {
      default: '',
      type: String
    },
    locale: {
      default: '',
      type: String
    },
    onlyPreview: {
      default: false,
      type: Boolean
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      contentIsSet: false,
      beginEdit: false,
      contentData: null,
      contentDataEdited: null,
      content: null,
      contentEdited: null
    }
  },
  computed: {
    dataAsMarkdown () {
      return this.objectAsMarkdown(this.contentData)
    },
    numberLines () {
      let result = 2
      if (this.contentEdited) { result = this.contentEdited.split(/\r\n|\r|\n/).length + result }
      return result
    },
    numberLinesData () {
      let result = 0
      if (this.contentDataEdited) {
        result = this.contentDataEdited.split(/\r\n|\r|\n/).length - 1
      }
      return result
    },
    getUnifiedDiff () {
      // console.log('C > PreviewMd > getUnifiedDiff  > createTwoFilesPatch : \n', createTwoFilesPatch)
      const fileName = this.gitObj.filefullname
      const diffStr = this.createTwoFilesPatch(fileName, fileName, this.content, this.contentEdited)
      return diffStr
    },
    // getCharDiff () {
    //   // console.log('C > PreviewMd > getCharDiff  > diffChars : \n', diffChars)
    //   // const diffStr = diffChars(this.content, this.contentEdited)
    //   const diffStr = this.diffWords(this.content, this.contentEdited)
    //   return diffStr
    // },
    getCharDiffData () {
      const dataAsMarkdown = this.getDataString(this.contentData)
      const diffStr = this.diffWords(dataAsMarkdown, this.contentDataEdited)
      return diffStr
    },
    // getDiffHtmlUnified () {
    //   const diff = this.getUnifiedDiff
    //   const options = {
    //     drawFileList: false,
    //     matching: 'lines',
    //     outputFormat: 'side-by-side'
    //     // outputFormat: 'line-by-line'
    //   }
    //   return Diff2Html.html(diff, options)
    // },
    getMdDiffHtmlChars () {
      const charDiff = this.getCharDiff(this.content, this.contentEdited)
      const diffText = this.diffHtmlChars(charDiff)
      return diffText
    },
    getMdDiffHtmlCharsData () {
      const diffText = this.diffHtmlChars(this.getCharDiffData)
      return diffText
    }
  },
  watch: {
    currentEditViewMode (next) {
      if (next === 'edit') {
        // console.log('\nC > PreviewMd > watch > currentEditViewMode > next :', next)
        this.resizeTextarea('edit-md-data')
        this.resizeTextarea('edit-md-content')
      }
    },
    fileRaw (next) {
      if (next && next !== '') {
        // console.log('\nC > PreviewMd > watch > fileRaw > !!next : ', !!next)
        // console.log('C > PreviewMd > watch > fileRaw > this.fileOptions : ', this.fileOptions)
        const dataRaw = this.mdToObject(next, this.fileOptions)
        const contentData = dataRaw.data
        const content = dataRaw.content
        this.contentData = contentData
        this.content = content
        if (!this.contentIsSet) { this.contentIsSet = true }
      }
    },
    fileClientRaw (next) {
      if (next) {
        // console.log('\nC > PreviewMd > watch > fileClientRaw > !!next : ', !!next)
        const dataRaw = this.mdToObject(next, this.fileOptions)
        const contentDataEdited = this.objectToMd('', dataRaw.data)
        const contentEdited = dataRaw.content
        this.contentDataEdited = contentDataEdited
        this.contentEdited = contentEdited
      }
    },
    contentIsSet (next) {
      if (next) {
        // console.log('\nC > PreviewMd > watch > contentIsSet > next : ', next)
        const contentDataEdited = this.objectToMd('', this.contentData)
        const contentEdited = this.content
        this.contentDataEdited = contentDataEdited
        this.contentEdited = contentEdited
        // this.resizeTextarea('edit-md-data')
        // this.resizeTextarea('edit-md-content')
      }
    },
    contentDataEdited (next) {
      if (next) {
        // console.log('C > PreviewMd > watch > contentDataEdited > !!next : ', !!next)
        // this.resizeTextarea('edit-md-data')
        this.bufferizeEdited()

        // track with matomo
        this.trackEvent('contentDataEdited')
      }
    },
    contentEdited (next, prev) {
      if (next && !prev) {
        // console.log('C > PreviewMd > watch > contentEdited > !!next : ', !!next)
        // this.resizeTextarea('edit-md-content')
        this.bufferizeEdited()

        // track with matomo
        this.trackEvent('contentEdited')
      }
    },
    fileIsSaving (next) {
      if (next) {
        // console.log('C > PreviewMd > watch > fileIsSaving > next : ', next)
        this.bufferizeEdited()
      }
    }
  },
  methods: {
    ...mapActions({
      updateBuffer: 'git-data/updateBuffer'
    }),
    formatAsYaml (str) {
      return '```yaml\n' + str + '\n```\n'
    },
    getDataString (obj) {
      return this.objectToMd('', obj)
    },
    objectAsMarkdown (obj) {
      const dataString = this.getDataString(obj)
      return this.formatAsYaml(dataString)
    },
    bufferizeEdited () {
      const edited = `${this.contentDataEdited}\n${this.contentEdited}`
      const commitData = {
        gitObj: this.gitObj,
        edited: edited,
        newBranch: this.buildNewBranchName(this.gitObj.filefullname, this.fileId)
      }
      this.updateBuffer({ ...commitData, addToBuffer: true })
    },
    resizeTextarea (pointer) {
      // console.log('\nC > PreviewMd > resizeTextarea > pointer : ', pointer)
      const textArea = document.querySelector(`.${pointer}`)
      if (textArea && textArea.scrollHeight) {
        const height = textArea.scrollHeight
        textArea.style.height = `${height}px`
      } else if (textArea && !textArea.scrollHeight) {
        setTimeout(() => {
          const height = textArea.scrollHeight
          textArea.style.height = `${height + 4}px`
        }, 100)
      }
    }
  }
}
</script>

<style>

.edit-md-full-height {
  height: 100% !important;
}
.edit-md {
  color: white;
  font-family: monospace;
  background-color: #191919;
  max-height: 100% !important;
  overflow: hidden;
}
.diff-data {
  overflow-x: auto;
  white-space: pre;
  background-color: #f5f5f5;
  padding: 1.25em 1.5em;
  font-size: .875em;
  word-wrap: normal;
  font-weight: 400;
  -webkit-font-smoothing: auto;
  font-family: monospace;
  margin-bottom: 3em;
}

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
