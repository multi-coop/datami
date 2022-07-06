<template>
  <div
    :class="`GitributeFile gitribute-widget section ${fromMultiFiles ? 'pt-3 px-4 add-multifiles-border' : ''} ${fromMultiFilesVertical ? 'add-multifiles-border-top' : '' }`">
    <div
      :class="`container mb-4 ${fromMultiFiles && !fromMultiFilesVertical ? 'mt-4' : '' }`">
      <div class="columns is-centered mb-4">
        <!-- FILE TITLE -->
        <div class="filetitle-and-viewmodes column is-12-mobile is-8-tablet is-9-desktop is-flex is-direction-row is-align-items-top is-justify-content-left-desktop has-text-centered-mobile has-text-left-tablet">
          <ViewModeBtns
            :file-id="fileId"
            :locale="locale"/>
          <FileTitle
            class="mb-3"
            :show-file-infos="showFileInfos"
            :title="title"
            :file-id="fileId"
            :locale="locale"
            @toggleInfos="showFileInfos = !showFileInfos"/>
        </div>

        <!-- USER NAVBAR -->
        <div class="usernavbar column is-12-mobile is-4-tablet is-3-desktop is-flex is-direction-row is-align-items-center is-justify-content-end">
          <UserOptions
            v-if="gitObj"
            :file-id="fileId"
            :only-preview="onlypreview"
            :locale="locale"/>
        </div>
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

    <!-- NOTIFICATIONS -->
    <!-- <pre><code>{{ notifications }}</code></pre> -->
    <div
      v-if="notifications && notifications.length"
      class="mb-6">
      <NotificationInfos
        v-for="(notif, index) in notifications"
        :key="`notif-${fileId}-${index}-${notif.code}`"
        :file-id="fileId"
        :notif="notif"
        :locale="locale"/>
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

    <!-- FILE NAVBAR BUTTONS -->
    <!-- {{ fileOptions }} -->
    <!-- hasCardsView : <code>{{ hasCardsView }}</code><br> -->
    <!-- hasCardsDetail : <code>{{ hasCardsDetail }}</code><br> -->
    <EditNavbarSkeleton
      v-if="!fileIsLoading && !fileIsSaving && !showUploadFileDialog"
      :file-id="fileId"
      :show-upload-file-dialog="showUploadFileDialog"
      :only-preview="onlypreview"
      :locale="locale"
      @action="processAction"/>

    <!-- CONFIRM COMMIT MODAL -->
    <ConfirmCommit
      v-show="fileIsSaving && !fileIsLoading"
      :file-id="fileId"
      :locale="locale"
      :debug="debug"/>
    <DialogUploadFile
      v-show="showUploadFileDialog"
      v-model="showUploadFileDialog"
      :file-id="fileId"
      :locale="locale"
      @action="processAction"/>

    <!-- PREVIEWS - SWITCH BY FILE TYPE -->
    <div v-show="!fileIsSaving">
      <!-- PREVIEWS CSV -->
      <div
        v-if="fileTypeFamily === 'table'"
        class="container">
        <PreviewCsv
          :only-preview="onlypreview"
          :file-id="fileId"
          :file-raw="fileRaw"
          :file-client-raw="fileClientRaw"
          :locale="locale"
          :debug="debug"/>
      </div>

      <!-- PREVIEWS MD -->
      <div
        v-if="fileTypeFamily === 'text'"
        class="container">
        <PreviewMd
          :only-preview="onlypreview"
          :file-id="fileId"
          :file-raw="fileRaw"
          :file-client-raw="fileClientRaw"
          :locale="locale"
          :debug="debug"/>
      </div>

      <!-- PREVIEWS JSON -->
      <div
        v-if="fileTypeFamily === 'json'"
        class="container">
        <PreviewJson
          :only-preview="onlypreview"
          :file-id="fileId"
          :file-raw="fileRaw"
          :file-client-raw="fileClientRaw"
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
import { mapActions } from 'vuex'

import { mixinGlobal, mixinGit } from '@/utils/mixins.js'

import FileTitle from '@/components/navbar/FileTitle'
import ViewModeBtns from '@/components/previews/ViewModeBtns'
import UserOptions from '@/components/user/UserOptions'

import NotificationInfos from '@/components/notifications/NotificationInfos'
import NotificationErrors from '@/components/notifications/NotificationErrors'

import EditNavbarSkeleton from '@/components/edition/EditNavbarSkeleton'
import DialogFileInfos from '@/components/previews/DialogFileInfos'
import DialogUploadFile from '@/components/edition/DialogUploadFile'
import ConfirmCommit from '@/components/edition/ConfirmCommit'

import PreviewCsv from '@/components/previews/PreviewCsv'
import PreviewMd from '@/components/previews/PreviewMd'
import PreviewJson from '@/components/previews/PreviewJson'

import GitributeCredits from '@/components/credits/GitributeCredits'

export default {
  name: 'GitributeFile',
  components: {
    FileTitle,
    ViewModeBtns,
    UserOptions,
    NotificationInfos,
    NotificationErrors,
    EditNavbarSkeleton,
    DialogFileInfos,
    DialogUploadFile,
    ConfirmCommit,
    PreviewCsv,
    PreviewMd,
    PreviewJson,
    GitributeCredits
  },
  mixins: [
    mixinGlobal,
    mixinGit
  ],
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
      default: '',
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
    },
    fromMultiFiles: {
      default: false,
      type: Boolean
    },
    fromMultiFilesVertical: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      // file infos
      fileId: undefined,
      fileType: undefined,
      fileInfos: undefined,
      fileRaw: undefined,
      fileClientRaw: undefined,
      showFileInfos: false,
      showUploadFileDialog: false
    }
  },
  watch: {
    fileIsLoading (next) {
      // console.log('C > GitributeFile > watch > fileIsLoading > next : ', next)
      if (next) { this.reloadFile() }
    }
  },
  async beforeMount () {
    // console.log('\nC > GitributeFile > beforeMount > this.gitfile : ', this.gitfile)
    const gitInfosObject = this.extractGitInfos(this.gitfile)
    // console.log('C > GitributeFile > beforeMount > gitInfosObject : ', gitInfosObject)
    const fileUuid = this.uuidv4()
    gitInfosObject.uuid = fileUuid
    gitInfosObject.title = this.title
    gitInfosObject.onlyPreview = this.onlypreview
    // console.log('C > GitributeFile > beforeMount > gitInfosObject : ', gitInfosObject)
    this.fileId = gitInfosObject.uuid
    this.fileType = gitInfosObject.filetype
    if (!this.getGitInfosObj[this.fileId]) {
      // load token
      let token = this.usertoken && this.usertoken !== '' && this.usertoken
      // console.log('C > GitributeFile > beforeMount > process.env : ', process.env)
      if (!token) {
        switch (gitInfosObject.provider) {
          case 'gitlab':
            token = process.env.VUE_APP_DEFAULT_GITLAB_TOKEN
            break
          case 'github':
            token = process.env.VUE_APP_DEFAULT_GITHUB_TOKEN
            break
        }
      }
      this.updateToken({ fileId: this.fileId, token: token })
      this.addGitInfos(gitInfosObject)
    }
    // console.log('C > GitributeFile > beforeMount > this.gitObj : ', this.gitObj)

    // build options object
    let fileOptions = this.options && this.options.length ? JSON.parse(this.options) : {}
    let fileSchema = fileOptions.schema
    // console.log('C > GitributeFile > beforeMount > fileSchema : ', fileSchema)
    if (fileSchema && fileSchema.file) {
      const schemaGitObj = this.extractGitInfos(fileSchema.file)
      // console.log('C > GitributeFile > beforeMount > schemaGitObj : ', schemaGitObj)
      const schemaRaw = await this.getFileDataRaw(schemaGitObj)
      const schemaData = schemaRaw && schemaRaw.data
      const schema = JSON.parse(schemaData)
      // console.log('C > GitributeFile > beforeMount > schema : ', schema)
      fileSchema = { ...schema, file: fileSchema.file }
    }
    // get custom props if any
    let fileCustomProps = fileOptions['fields-custom-properties']
    if (fileCustomProps && fileCustomProps.file) {
      const customPropsGitObj = this.extractGitInfos(fileCustomProps.file)
      const customPropsRaw = await this.getFileDataRaw(customPropsGitObj)
      const customPropsData = customPropsRaw && customPropsRaw.data
      const customProps = JSON.parse(customPropsData)
      fileCustomProps = { ...customProps, file: fileCustomProps.file }
    }

    // update fileOptions with schema and consolidation settings
    fileOptions = {
      ...fileOptions,
      ...fileSchema && { schema: fileSchema },
      ...fileCustomProps && { customProps: fileCustomProps }
    }

    // add fileOptions in store
    this.addFileOptions({ ...fileOptions, uuid: gitInfosObject.uuid })
  },
  async mounted () {
    // console.log('\nC > GitributeFile > mounted > this.gitInfos : ', this.gitInfos)
    // console.log('C > GitributeFile > mounted > this.gitObj : ', this.gitObj)
    // console.log('C > GitributeFile > mounted > this.usertoken : ', this.usertoken)
    // console.log('C > GitributeFile > mounted > this.fileInfos : ', this.fileInfos)

    const sourceBranch = { branch: this.gitObj.branch, isRefBranch: true }
    this.updateUserBranches({ fileId: this.fileId, branches: [sourceBranch] })
    // this.changeActiveUserBranch({ fileId: this.fileId, userBranch: [this.gitObj] })
    await this.reloadFile()
  },
  methods: {
    ...mapActions({
      addGitInfos: 'addGitInfos',
      addFileOptions: 'addFileOptions',
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
    },
    processAction (event) {
      // console.log('\nC > GitributeFile > processAction > event : ', event)
      switch (event.action) {
        case 'toggleUploadFileDialog':
          this.showUploadFileDialog = !this.showUploadFileDialog
          break
        case 'uploadFileData':
          this.fileClientRaw = event.data
          break
      }
    }
  }
}
</script>

<style>

.no-text-transform{
  text-transform: none!important;
}

@media(max-width:768px){
  .filetitle-and-viewmodes{
    justify-content: center;
    flex-direction: column-reverse;
    align-items: center;
  }
  .usernavbar{
    justify-content: center !important;
  }
}

</style>
