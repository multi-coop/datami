<template>
  <div class="section">
    <div class="container mb-4">
      <div class="columns is-mobile mb-4">
        <!-- FILE TITLE -->
        <div class="column is-9">
          <FileTitle
            :show-file-infos="showFileInfos"
            :title="title"
            :file-id="fileId"
            :locale="locale"
            @toggleInfos="showFileInfos = !showFileInfos"/>
        </div>
        <!-- USER NAVBAR -->
        <div class="column is-3">
          <UserOptions
            v-if="gitObj"
            :file-id="fileId"
            :only-preview="onlypreview"
            :locale="locale"/>
        </div>
      </div>
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

    <!-- FILE INFOS -->
    <DialogFileInfos
      v-show="showFileInfos"
      v-model="showFileInfos"
      :file-id="fileId"
      :locale="locale"
      :debug="debug"
      @closeDialogFileInfos="showFileInfos = false"/>

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
    <LoaderMD v-if="fileIsReloading && fileTypeFamily === 'text'"/>
    <LoaderMD v-if="fileIsReloading && fileTypeFamily === 'json'"/>

    <!-- FILE NAVBAR BUTTONS -->
    <EditNavbarSkeleton
      v-if="!fileIsReloading && !fileIsSaving"
      :only-preview="onlypreview"
      :file-id="fileId"
      :file-type-family="fileTypeFamily"
      :view-mode="currentViewMode"
      :locale="locale"/>

    <!-- CONFIRM COMMIT MODAL -->
    <ConfirmCommit
      v-show="fileIsSaving && !fileIsReloading"
      :file-id="fileId"
      :locale="locale"
      :debug="debug"/>

    <!-- PREVIEWS - SWITCH BY FILE TYPE -->

    <!-- PREVIEWS CSV -->
    <div v-show="!fileIsSaving">
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

      <!-- PREVIEWS MD -->
      <div
        v-if="fileTypeFamily === 'text'"
        class="container">
        <PreviewMd
          v-show="!fileIsReloading"
          :only-preview="onlypreview"
          :file-id="fileId"
          :file-options="fileOptions"
          :file-raw="fileRaw"
          :locale="locale"
          :debug="debug"/>
      </div>

      <!-- PREVIEWS JSON -->
      <div
        v-if="fileTypeFamily === 'json'"
        class="container">
        <PreviewJson
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

import { mixinGit } from '@/utils/mixins.js'
import { extractGitInfos } from '@/utils/utilsGitUrl.js'

import FileTitle from '@/components/navbar/FileTitle'
import UserOptions from '@/components/user/UserOptions'

import NotificationErrors from '@/components/errors/NotificationErrors'

import EditNavbarSkeleton from '@/components/edition/EditNavbarSkeleton'
import DialogFileInfos from '@/components/previews/DialogFileInfos'
import ConfirmCommit from '@/components/edition/ConfirmCommit'

import PreviewCsv from '@/components/previews/PreviewCsv'
import PreviewMd from '@/components/previews/PreviewMd'
import PreviewJson from '@/components/previews/PreviewJson'

import LoaderEditNavbar from '@/components/loaders/LoaderEditNavbar'
import LoaderCSV from '@/components/loaders/LoaderCSV'
import LoaderMD from '@/components/loaders/LoaderMD'

import GitributeCredits from '@/components/credits/GitributeCredits'

export default {
  name: 'GitributeFile',
  components: {
    FileTitle,
    UserOptions,
    NotificationErrors,
    EditNavbarSkeleton,
    DialogFileInfos,
    ConfirmCommit,
    PreviewCsv,
    PreviewMd,
    PreviewJson,
    LoaderEditNavbar,
    LoaderCSV,
    LoaderMD,
    GitributeCredits
  },
  mixins: [mixinGit],
  props: {
    title: {
      default: 'gitribute',
      type: String
    },
    gitfile: {
      default: '',
      type: String
    },
    options: {
      default: 'en',
      type: String
    },
    usertoken: {
      default: '',
      type: String
    },
    locale: {
      default: '',
      type: String
    },
    onlypreview: {
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
      fileId: undefined,
      fileType: undefined,
      // gitObj: undefined,
      fileInfos: undefined,
      fileRaw: undefined,
      fileOptions: undefined,
      showFileInfos: false
    }
  },
  computed: {
    ...mapGetters({
      getGitObj: 'getGitObj',
      getGitInfosObj: 'getGitInfosObj',
      fileNeedsReload: 'git-data/fileNeedsReload',
      fileNeedsSaving: 'git-data/fileNeedsSaving',
      getViewMode: 'git-data/getViewMode',
      getReqErrors: 'git-data/getReqErrors'
    }),
    gitObj () {
      return this.fileId && this.getGitInfosObj(this.fileId)
    },
    fileIsReloading () {
      // console.log('C > GitributeFile > fileIsReloading > this.gitInfos : ', this.gitInfos)
      const resp = !this.gitObj || this.fileNeedsReload(this.fileId)
      // console.log('C > GitributeFile > fileIsReloading > resp : ', resp)
      return resp
    },
    fileIsSaving () {
      const resp = !this.gitObj || this.fileNeedsSaving(this.fileId)
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
      // console.log('C > GitributeFile > watch > fileIsReloading > next : ', next)
      if (next) { this.reloadFile() }
    }
  },
  beforeMount () {
    // console.log('\nC > GitributeFile > beforeMount > this.gitfile : ', this.gitfile)
    const gitInfosObject = extractGitInfos(this.gitfile)
    const fileUuid = uuidv4()
    gitInfosObject.uuid = fileUuid
    // console.log("C > GitributeFile > beforeMount > gitInfosObject : ', gitInfosObject)
    this.fileId = gitInfosObject.uuid
    this.fileType = gitInfosObject.filetype
    if (!this.getGitInfosObj[this.fileId]) {
      // this.gitObj = gitInfosObject
      this.updateToken({ fileId: this.fileId, token: this.usertoken })
      this.addGitInfos(gitInfosObject)
    }
    // console.log('C > GitributeFile > beforeMount > this.gitObj : ', this.gitObj)
    // build options object
    this.fileOptions = this.options && this.options.length ? JSON.parse(this.options) : {}
  },
  async mounted () {
    // console.log('\nC > GitributeFile > mount > this.gitInfos : ', this.gitInfos)
    // console.log('C > GitributeFile > mount > this.gitObj : ', this.gitObj)
    // console.log('C > GitributeFile > mount > this.usertoken : ', this.usertoken)
    // this.fileInfos = await this.getFileData(this.gitObj)
    // console.log('C > GitributeFile > mount > this.fileInfos : ', this.fileInfos)
    await this.reloadFile()
  },
  methods: {
    ...mapActions({
      addGitInfos: 'addGitInfos',
      addFileReqInfos: 'addFileReqInfos',
      updateToken: 'git-data/updateToken',
      updateReloading: 'git-data/updateReloading',
      updateReqErrors: 'git-data/updateReqErrors'
    }),
    async reloadFile () {
      // Update reloading in store - true
      this.updateReloading({ fileId: this.fileId, isLoading: true })
      this.updateReqErrors({ fileId: this.fileId, addToErrors: false })

      // Request API for file infos
      const respData = await this.getFileData(this.gitObj)
      // console.log('\nC > GitributeFile > reloadFile > respData : ', respData)
      const fileInfos = respData.data
      const fileInfosErrors = respData.errors
      fileInfos.uuid = this.fileId
      this.addFileReqInfos(fileInfos)
      this.fileInfos = fileInfos
      // console.log('C > GitributeFile > reloadFile > this.fileInfos : ', this.fileInfos)

      // Request API for file content
      const respDataRaw = await this.getFileDataRaw(this.gitObj)
      // console.log('C > GitributeFile > reloadFile > respDataRaw : ', respDataRaw)
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
