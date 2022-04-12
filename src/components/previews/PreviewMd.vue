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

    <!-- LOADERS -->
    <div v-if="fileIsLoading">
      <LoaderEditNavbar v-if="!onlyPreview"/>
      <LoaderMD/>
    </div>

    <div v-if="!fileIsLoading">
      <!-- HELPERS -->
      <PreviewHelpers
        v-if="!onlyPreview"
        :file-id="fileId"
        :file-family="'text'"
        :locale="locale"/>

      <!-- VIEWS -->
      <div
        v-if="edited"
        class="columns is-mobile">
        <!-- EDIT VIEW -->
        <div
          v-show="currentViewMode === 'edit'"
          :class="`column is-half pr-6`">
          <p class="is-italic">
            {{ t('preview.yamlPart', locale) }}
          </p>
          <b-field>
            <b-input
              v-model="dataEdited"
              custom-class="edit-md mb-4"
              type="textarea"
              :rows="numberLinesData"/>
          </b-field>
          <p class="is-italic">
            {{ t('preview.textPart', locale) }}
          </p>
          <b-field>
            <b-input
              v-model="edited"
              custom-class="edit-md"
              type="textarea"
              :rows="numberLines"/>
          </b-field>
        </div>

        <!-- DIFF VIEW -->
        <div
          v-show="currentViewMode === 'diff'"
          :class="`column is-half pr-6`">
          <p class="is-italic">
            {{ t('preview.yamlPart', locale) }}
          </p>
          <div
            class="diff-data"
            v-html="getDiffHtmlCharsData"/>
          <p class="is-italic">
            {{ t('preview.textPart', locale) }}
          </p>
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
            :icon="getIcon(currentViewMode)"
            size="is-small"/>
          <b-icon
            v-if="currentViewMode === 'edit'"
            :icon="getIcon(currentViewMode)"
            size="is-small"/>
        </div>

        <!-- PREVIEW -->
        <div
          :class="`column ${currentViewMode !== 'preview' ? 'pl-6' : ''}`">
          <p
            v-if="currentViewMode !== 'preview'"
            class="is-italic">
            {{ t('preview.yamlPart', locale) }}
          </p>
          <div
            v-if="currentViewMode !== 'preview'"
            class="diff-data"
            v-html="currentViewMode === 'diff' ? getDataString(data) : dataEdited"/>
          <p
            v-if="currentViewMode !== 'preview'"
            class="is-italic">
            {{ t('preview.textPart', locale) }}
          </p>
          <ShowDown
            :markdown="currentViewMode === 'diff' ? content : edited"
            flavor="github"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { mixinIcons, mixinDiff, mixinMd } from '@/utils/mixins.js'

import LoaderEditNavbar from '@/components/loaders/LoaderEditNavbar'
import LoaderMD from '@/components/loaders/LoaderMD'

import PreviewHelpers from '@/components/previews/PreviewHelpers'
import ShowDown from '@/components/previews/ShowDown'

// // see : https://github.com/kpdecker/jsdiff
// import { createTwoFilesPatch, diffWords } from 'diff'

import * as Diff2Html from 'diff2html'
import 'diff2html/bundles/css/diff2html.min.css'

export default {
  name: 'PreviewMd',
  components: {
    LoaderEditNavbar,
    LoaderMD,
    PreviewHelpers,
    ShowDown
  },
  mixins: [
    mixinIcons,
    mixinDiff,
    mixinMd
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    fileOptions: {
      default: undefined,
      type: Object
    },
    fileIsLoading: {
      default: true,
      type: Boolean
    },
    fileIsSaving: {
      default: true,
      type: Boolean
    },
    fileRaw: {
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
      data: null,
      dataEdited: null,
      content: null,
      edited: null
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation',
      getViewMode: 'git-data/getViewMode',
      getGitInfosObj: 'getGitInfosObj',
      buildNewBranchName: 'buildNewBranchName',
      fileNeedsSaving: 'git-data/fileNeedsSaving'
    }),
    gitObj () {
      return this.fileId && this.getGitInfosObj(this.fileId)
    },
    currentViewMode () {
      return this.getViewMode(this.gitObj.uuid)
    },
    dataAsMarkdown () {
      return this.objectAsMarkdown(this.data)
    },
    numberLines () {
      let result = 2
      if (this.edited) { result = this.edited.split(/\r\n|\r|\n/).length + result }
      return result
    },
    numberLinesData () {
      let result = 0
      if (this.dataEdited) {
        result = this.dataEdited.split(/\r\n|\r|\n/).length - 1
      }
      return result
    },
    getUnifiedDiff () {
      // console.log('C > PreviewMd > getUnifiedDiff  > createTwoFilesPatch : \n', createTwoFilesPatch)
      const fileName = this.gitObj.filefullname
      const diffStr = this.createTwoFilesPatch(fileName, fileName, this.content, this.edited)
      return diffStr
    },
    getCharDiff () {
      // console.log('C > PreviewMd > getCharDiff  > diffChars : \n', diffChars)
      // const diffStr = diffChars(this.content, this.edited)
      const diffStr = this.diffWords(this.content, this.edited)
      return diffStr
    },
    getCharDiffData () {
      const dataAsMarkdown = this.getDataString(this.data)
      const diffStr = this.diffWords(dataAsMarkdown, this.dataEdited)
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
      const diffText = this.diffHtmlChars(this.getCharDiff)
      return diffText
    },
    getDiffHtmlCharsData () {
      const diffText = this.diffHtmlChars(this.getCharDiffData)
      return diffText
    }
    // fileIsSaving () {
    //   const resp = !this.gitObj || this.fileNeedsSaving(this.fileId)
    //   return resp
    // }
  },
  watch: {
    fileRaw (next) {
      if (next && next !== '') {
        // console.log('C > PreviewMd > watch > fileRaw > next : \n', next)
        // console.log('C > PreviewMd > watch > fileRaw > this.fileOptions : ', this.fileOptions)
        const dataRaw = this.mdToObject(next, this.fileOptions)
        this.data = dataRaw.data
        this.content = dataRaw.content
        if (!this.contentIsSet) { this.contentIsSet = true }
      }
    },
    contentIsSet (next) {
      // console.log('C > PreviewMd > watch > fileRaw > next : \n', next)
      if (next) {
        this.edited = this.content
        this.dataEdited = this.objectToMd('', this.data)
      }
    },
    edited (next, prev) {
      if (next && !prev) {
        this.bufferizeEdited()
      }
    },
    dataEdited (next) {
      if (next) {
        this.bufferizeEdited()
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
      // const edited = this.objectToMd(this.edited, this.data)
      const edited = `${this.dataEdited}\n${this.edited}`
      const commitData = {
        gitObj: this.gitObj,
        // edited: this.edited,
        edited: edited,
        newBranch: this.buildNewBranchName(this.gitObj.filefullname, this.fileId)
      }
      this.updateBuffer({ ...commitData, addToBuffer: true })
    }
  }
}
</script>

<style>

.edit-md {
  color: white;
  font-family: monospace;
  background-color: #191919;
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
