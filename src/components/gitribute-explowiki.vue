<template>
  <div class="section">
    <!-- USER NAVBAR -->
    <div class="container mb-4">
      <NavbarSkeleton
        v-if="gitObj"
        :title="title"
        :file-id="fileId"
        :only-preview="onlypreview"
        :locale="locale"/>
    </div>

    <!-- DEBUG -->
    <div
      v-if="debug"
      class=" container columns is-multiline">
      <div class="column is-full">
        <p>
          fileType:
          <code>{{ fileType }}</code>
        </p>
      </div>
      <div class="column is-one-third">
        <p>
          gitObj:
          <br>
          <code>
            <pre>{{ gitObj }}</pre>
          </code>
        </p>
      </div>
      <div class="column is-one-third">
        <p>
          fileInfos:
          <br>
          <code>
            <pre>{{ fileInfos }}</pre>
          </code>
        </p>
      </div>
      <div class="column is-one-third">
        <p>
          fileRaw:
          <br>
          <code>
            <pre>{{ fileRaw }}</pre>
          </code>
        </p>
      </div>
    </div>

    <!-- ERRORS -->
    <div
      v-if="errors && errors.length"
      class="mb-6">
      <NotificationErrors
        v-for="(error, index) in errors"
        :key="`error-${fileId}-${index}-${error.code}`"
        :file-id="fileId"
        :error="error"
        :locale="locale"/>
    </div>

    <!-- LOADERS -->
    <LoaderEditNavbar v-if="fileIsReloading && !onlypreview"/>
    <!-- <LoaderCSV/> -->
    <LoaderCSV v-if="fileIsReloading && fileTypeFamily === 'table'"/>

    <!-- FILE NAVBAR BUTTONS -->
    <EditNavbarSkeleton
      v-if="!fileIsReloading"
      :only-preview="onlypreview"
      :file-id="fileId"
      :file-type-family="fileTypeFamily"
      :view-mode="currentViewMode"
      :locale="locale"/>

    <!-- PREVIEWS - SWITCH BY FILE TYPE -->

    <!-- PREVIEWS CARDS -->
    <!-- PREVIEWS CSV -->
    <div>
      <div
        v-if="fileTypeFamily === 'table'"
        class="container">
        <PreviewCsv
          v-show="!fileIsReloading"
          :only-preview="onlypreview"
          :file-id="fileId"
          :file-options="fileOptions"
          :file-raw="fileRaw"
          :locale="locale"
          :debug="debug"/>
      </div>
    </div>

    <!-- CREDITS -->
    <GitributeCredits
      :locale="locale"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

import { mixin } from '@/utils/mixins.js'
import { extractGitInfos } from '@/utils/utilsGitUrl.js'

import NavbarSkeleton from '@/components/navbar/NavbarSkeleton'

import NotificationErrors from '@/components/errors/NotificationErrors'

import EditNavbarSkeleton from '@/components/edition/EditNavbarSkeleton'

import PreviewCsv from '@/components/previews/PreviewCsv'

import LoaderEditNavbar from '@/components/loaders/LoaderEditNavbar'
import LoaderCSV from '@/components/loaders/LoaderCSV'

import GitributeCredits from '@/components/credits/GitributeCredits'

export default {
  name: 'GitributeExploWiki',
  components: {
    NavbarSkeleton,
    NotificationErrors,
    EditNavbarSkeleton,
    PreviewCsv,
    LoaderEditNavbar,
    LoaderCSV,
    GitributeCredits
  },
  mixins: [mixin],
  props: {
    title: {
      default: 'gitribute',
      type: String
    },
    wikifile: {
      default: '',
      type: String
    },
    options: {
      default: 'en',
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
      onlypreview: true,
      fileId: undefined,
      fileType: undefined,
      // gitObj: undefined,
      fileInfos: undefined,
      fileRaw: undefined,
      fileOptions: undefined
    }
  },
  computed: {
    ...mapGetters({
      getGitObj: 'getGitObj',
      getGitInfosObj: 'getGitInfosObj',
      fileNeedsReload: 'git-data/fileNeedsReload',
      getViewMode: 'git-data/getViewMode',
      getReqErrors: 'git-data/getReqErrors'
    }),
    gitObj () {
      return this.fileId && this.getGitInfosObj(this.fileId)
    },
    fileIsReloading () {
      // console.log('C > GitributeExploWiki > fileIsReloading > this.gitInfos : ', this.gitInfos)
      const resp = !this.gitObj || this.fileNeedsReload(this.fileId)
      // console.log('C > GitributeExploWiki > fileIsReloading > resp : ', resp)
      return resp
    },
    currentViewMode () {
      // return this.getViewMode(this.gitObj.uuid)
      return this.getViewMode(this.fileId)
    },
    errors () {
      return this.getReqErrors(this.fileId)
    }
  },
  watch: {
    fileIsReloading (next) {
      // console.log('C > GitributeExploWiki > watch > fileIsReloading > next : ', next)
      if (next) { this.reloadFile() }
    }
  },
  beforeMount () {
    console.log('\nC > GitributeExploWiki > beforeMount > this.wikifile : ', this.wikifile)
    const gitInfosObject = extractGitInfos(this.wikifile)
    const fileUuid = uuidv4()
    gitInfosObject.uuid = fileUuid
    console.log('C > GitributeExploWiki > beforeMount > gitInfosObject : ', gitInfosObject)
    this.fileId = gitInfosObject.uuid
    this.fileType = gitInfosObject.filetype
    if (!this.getGitInfosObj[this.fileId]) {
      // this.gitObj = gitInfosObject
      this.addGitInfos(gitInfosObject)
    }
    console.log('C > GitributeExploWiki > beforeMount > this.gitObj : ', this.gitObj)
    // build options object
    this.fileOptions = this.options && this.options.length ? JSON.parse(this.options) : {}
  },
  async mounted () {
    await this.reloadFile()
  },
  methods: {
    ...mapActions({
      addGitInfos: 'addGitInfos',
      addFileReqInfos: 'addFileReqInfos',
      updateReloading: 'git-data/updateReloading',
      updateReqErrors: 'git-data/updateReqErrors'
    }),
    async reloadFile () {
      // Update reloading in store - true
      this.updateReloading({ fileId: this.fileId, isLoading: true })
      this.updateReqErrors({ fileId: this.fileId, addToErrors: false })

      // Request API for file infos
      const respData = await this.getFileData(this.gitObj)
      // console.log('\nC > GitributeExploWiki > reloadFile > respData : ', respData)
      const fileInfos = respData.data
      const fileInfosErrors = respData.errors
      fileInfos.uuid = this.fileId
      this.addFileReqInfos(fileInfos)
      this.fileInfos = fileInfos
      // console.log('C > GitributeExploWiki > reloadFile > this.fileInfos : ', this.fileInfos)

      // Request API for file content
      const respDataRaw = await this.getFileDataRaw(this.gitObj)
      // console.log('C > GitributeExploWiki > reloadFile > respDataRaw : ', respDataRaw)
      const fileRaw = respDataRaw.data
      const fileRawErrors = respDataRaw.errors
      this.fileRaw = fileRaw

      // update errors if any
      if (fileInfosErrors.length || fileRawErrors.length) {
        const errors = [...fileInfosErrors, ...fileRawErrors]
        this.updateReqErrors({ fileId: this.fileId, errors: errors, addToErrors: true })
      }

      // Update reloading in store - false
      this.updateReloading({ fileId: this.fileId, isLoading: false })
    }
  }
}
</script>

<style>

.no-text-transform {
  text-transform: none!important;
}

</style>
