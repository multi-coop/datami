<template>
  <div
    :id="fileId"
    :class="`DatamiFile datami-widget datami-container section pb-0 ${currentViewMode === 'map' ? 'pt-0 px-0' : ''} ${fromMultiFiles ? 'pt-3 px-4 add-multifiles-border' : ''} ${fromMultiFilesVertical ? 'add-multifiles-border-top' : '' }`"
    :style="`z-index: 0; background-color: ${currentViewMode === 'cards' ? '#e9e9e9' : 'white'};`">
    <!-- style="z-index: 0;"> -->
    <!-- MATOMO -->
    <MatomoScript
      :file-id="fileId"/>

    <!-- WIDGET -->
    <div
      :id="`datami-widget-${fileId}`"
      :style="`z-index: 0; ${userFullscreen ? 'background-color: white;' : ''}`">
      <div
        :id="`file-navbar-${fileId}`"
        :class="`upper-container ${currentViewMode === 'map' ? 'px-3' : ''}`"
        style="z-index: 1;">
        <!-- NAVBAR FILE TITLE / USER BTNS -->
        <div
          :class="`container mb-0 ${currentViewMode === 'map' || userFullscreen ? 'pt-6' : ''} ${fromMultiFiles && !fromMultiFilesVertical ? 'mt-4' : '' }`"
          style="z-index: 2">
          <div class="columns is-centered mb-0">
            <!-- FILE TITLE -->
            <div class="filetitle-and-viewmodes column is-12-mobile is-7-tablet is-9-desktop is-flex is-direction-row is-align-items-top is-justify-content-left-desktop has-text-centered-mobile has-text-left-tablet">
              <ViewModeBtns
                :file-id="fileId"
                :locale="locale"/>
              <FileTitle
                :show-file-infos="showFileInfos"
                :title="title"
                :file-id="fileId"
                :locale="locale"
                @toggleInfos="showFileInfos = !showFileInfos"/>
            </div>

            <!-- USER NAVBAR -->
            <div class="usernavbar column is-12-mobile is-5-tablet is-3-desktop is-flex is-direction-row is-align-items-center">
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
        <!-- <pre><code>{{ errors }}</code></pre> -->
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
          v-if="fileOptions && !fileIsLoading && !fileIsSaving && !showUploadFileDialog"
          :file-id="fileId"
          :show-upload-file-dialog="showUploadFileDialog"
          :only-preview="onlypreview"
          :locale="locale"
          @action="processAction"/>
      </div>

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

      <!-- DEBUGGING FOREIGN KEYS-->
      <div
        v-if="debug && sharedData"
        class="columns is-multiline mb-4">
        <div class="column is-full">
          fileId : <code>{{ fileId }}</code>
        </div>
      </div>
      <div
        v-if="debug && !fromMultiFiles && sharedData"
        class="columns is-multiline mb-4">
        <div class="column is-4">
          shareableAreSet : <code>{{ shareableAreSet }}</code>
        </div>
        <div class="column is-4">
          loadingShared :<br>
          <pre><code>{{ loadingShared }}</code></pre>
        </div>
        <div class="column is-4">
          loadingExtRessources :<br>
          <pre><code>{{ loadingExtRessources }}</code></pre>
        </div>
        <div class="column is-6">
          shareableFiles:<br>
          <pre><code>{{ shareableFiles }}</code></pre>
        </div>
        <div class="column is-6">
          readyToCopyRessources:<br>
          <pre><code>{{ readyToCopyRessources }}</code></pre>
          <hr class="my-1">
          readyToLoadExtRessources:<br>
          <pre><code>{{ readyToLoadExtRessources }}</code></pre>
        </div>
        <div
          v-for="(shared, idx) in sharedData"
          :key="`shared-${idx}-${shared.targetFile}`"
          class="column is-4">
          isInShareableAndSet:
          <code>{{ isInShareableAndSet(shared.ressource).length }}</code>
          <br>
          isInShareableAndLoaded:
          <code>{{ isInShareableAndLoaded(shared.ressource).length }}</code>
          <hr class="my-1">
          sharedData<code>[{{ idx }}]</code> :<br>
          <pre><code>{{ debugShared(shared) }}</code></pre>
          <hr class="my-1">
          loadedSharedData<code>[{{ idx }}]</code> :<br>
          <pre><code>{{ debugShared(loadedSharedData(shared.ressource)) }}</code></pre>
        </div>
      </div>

      <!-- DEBUGGING -->
      <div
        v-if="debug"
        class="columns is-multiline mt-4">
        <div
          v-if="true"
          class="column is-3">
          fileTypeFamily : <code>{{ fileTypeFamily }}</code>
        </div>
        <div
          v-if="true"
          class="column is-3">
          fileOptionsReady : <code>{{ fileOptionsReady }}</code>
        </div>
        <div
          v-if="false"
          class="column is-8">
          fileOptions :<br>
          <pre><code>{{ fileOptions }}</code></pre>
        </div>
      </div>

      <!-- PREVIEWS - SWITCH BY FILE TYPE -->
      <div
        v-show="!fileIsSaving && !showFileInfos"
        class="datami-file-previews">
        <!-- PREVIEWS CSV -->
        <div
          v-if="fileTypeFamily === 'table'"
          class="container datami-container"
          style="z-index: 1;">
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
          class="container datami-container"
          style="z-index: 1;">
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
          class="container datami-container"
          style="z-index: 1;">
          <PreviewJson
            :only-preview="onlypreview"
            :file-id="fileId"
            :file-raw="fileRaw"
            :file-client-raw="fileClientRaw"
            :locale="locale"
            :debug="debug"/>
        </div>
      </div>
    </div>

    <!-- CREDITS -->
    <DatamiCredits
      :file-id="fileId"
      :locale="locale"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import { mixinGlobal, mixinForeignKeys, mixinGit } from '@/utils/mixins.js'
import { csvToObject } from '@/utils/csvUtils'

import MatomoScript from '@/components/matomo/MatomoScript'

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

import DatamiCredits from '@/components/credits/DatamiCredits'

export default {
  name: 'DatamiFile',
  components: {
    MatomoScript,
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
    DatamiCredits
  },
  mixins: [
    mixinGlobal,
    mixinForeignKeys,
    mixinGit
  ],
  props: {
    title: {
      default: 'datami',
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
    trackalloutlinks: {
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
    showFileInfos (next) {
      if (next) {
        // track with matomo
        this.trackEvent('openFileInfos', 'FileTitle')
      }
    },
    fileIsLoading (next) {
      if (next) { this.reloadFile() }
    },
    shareableFiles (next) {
      const goNoGo = next && next.length && next.map(i => i.isSet)
      // next && next.length && console.log('\nC >>> DatamiFile > watch > shareableFiles > next.map : ', next.map(i => `${i.gitfile}-${i.isSet}`))
      if (goNoGo && goNoGo.every(b => b)) {
        // console.log('C >>> DatamiFile > watch > shareableFiles > this.gitObj.id : ', this.gitObj.id)
        // console.log('C >>> DatamiFile > watch > shareableFiles > goNoGo : ', goNoGo)
        // console.log('C >>> DatamiFile > watch > shareableFiles > this.shareableFiles.map(i => i.isSet) : ', this.shareableFiles.map(i => i.isSet))
        this.updateLoadingRessources({ key: 'loadingShared', loadState: 'loading', from: this.fileId })
        this.updateLoadingRessources({ key: 'loadingExtRessources', loadState: 'loading', from: this.fileId })
      }
    },
    async loadingExtRessources (next) {
      // console.log('C >>> DatamiFile > watch > loadingExtRessources > next : ', next)
      if (next.loadState === 'loading' && next.initiator === this.fileId && this.readyToLoadExtRessources) {
        await this.loadExtRessources()
      }
    }
  },
  async beforeMount () {
    // console.log('\nC > DatamiFile > beforeMount > this.gitfile : ', this.gitfile)

    const fileUuid = this.uuidv4()

    // console.log('\nC > DatamiFile > beforeMount > this.trackalloutlinks : ', this.trackalloutlinks)
    this.activateTrackAllOutlinks({ uuid: fileUuid, val: this.trackalloutlinks })

    if (!this.fromMultiFiles) {
      this.setWidgetCopy()
    }

    const gitInfosObject = this.extractGitInfos(this.gitfile)
    // console.log('C > DatamiFile > beforeMount > gitInfosObject : ', gitInfosObject)
    this.updateShareableFiles({ gitfile: this.gitfile, fileId: fileUuid, isSet: false })
    gitInfosObject.uuid = fileUuid
    gitInfosObject.title = this.title
    gitInfosObject.onlyPreview = this.onlypreview
    // console.log('C > DatamiFile > beforeMount > gitInfosObject : ', gitInfosObject)
    this.fileId = gitInfosObject.uuid
    this.fileType = gitInfosObject.filetype
    if (!this.getGitInfosObj[this.fileId]) {
      // load token
      let token = this.usertoken && this.usertoken !== '' && this.usertoken
      // console.log('C > DatamiFile > beforeMount > process.env : ', process.env)
      if (!token) {
        switch (gitInfosObject.provider) {
          case 'gitlab':
            token = process.env.VUE_APP_DEFAULT_GITLAB_TOKEN
            break
          case 'github':
            token = process.env.VUE_APP_DEFAULT_GITHUB_TOKEN
            break
          case 'localhost':
            token = 'NO-TOKEN-FOR-LOCAL-DEV'
            break
        }
      }
      this.updateToken({ fileId: this.fileId, token: token })
      this.addGitInfos(gitInfosObject)
    }
    // console.log('\nC > DatamiFile > beforeMount > this.gitObj : ', this.gitObj)

    // console.log('C > DatamiFile > beforeMount > this.options : ', this.options)
    // build options object
    let fileOptions = this.options && this.options.length ? JSON.parse(this.options) : {}
    // console.log('C > DatamiFile > beforeMount > fileOptions : ', fileOptions)
    let fileSchema = fileOptions.schema
    // console.log('C > DatamiFile > beforeMount > fileSchema : ', fileSchema)
    if (fileSchema && fileSchema.file) {
      const schemaGitObj = this.extractGitInfos(fileSchema.file)
      // console.log('C > DatamiFile > beforeMount > schemaGitObj : ', schemaGitObj)
      const schemaRaw = await this.getFileDataRaw(schemaGitObj, this.fileToken)
      // console.log('C > DatamiFile > beforeMount > schemaRaw : ', schemaRaw)
      const schemaData = schemaRaw && schemaRaw.data
      // console.log('C > DatamiFile > beforeMount > schemaData : ', schemaData)
      const schema = JSON.parse(schemaData)
      // console.log('C > DatamiFile > beforeMount > schema : ', schema)
      fileSchema = { ...schema, file: fileSchema.file }
    }
    fileSchema && console.log('C > DatamiFile > beforeMount > fileSchema : ', fileSchema)

    // get custom props if any
    let fileCustomProps = fileOptions['fields-custom-properties']
    if (fileCustomProps && fileCustomProps.file) {
      const customPropsGitObj = this.extractGitInfos(fileCustomProps.file)
      // console.log('C > DatamiFile > beforeMount > customPropsGitObj : ', customPropsGitObj)
      const customPropsRaw = await this.getFileDataRaw(customPropsGitObj, this.fileToken)
      // console.log('C > DatamiFile > beforeMount > customPropsRaw : ', customPropsRaw)
      const customPropsData = customPropsRaw && customPropsRaw.data
      // console.log('C > DatamiFile > beforeMount > customPropsData : ', customPropsData)
      const customProps = JSON.parse(customPropsData)
      // console.log('C > DatamiFile > beforeMount > customProps : ', customProps)
      fileCustomProps = { ...customProps, file: fileCustomProps.file }
    }
    // fileCustomProps && console.log('\nC > DatamiFile > beforeMount > this.gitfile : ', this.gitfile)
    fileCustomProps && console.log('C > DatamiFile > beforeMount > fileCustomProps : ', fileCustomProps)

    // get dataviz props if any
    let fileDataviz = fileOptions.datavizview
    if (fileDataviz && fileDataviz.file) {
      const datavizPropsGitObj = this.extractGitInfos(fileDataviz.file)
      const datavizPropsRaw = await this.getFileDataRaw(datavizPropsGitObj, this.fileToken)
      const datavizPropsData = datavizPropsRaw && datavizPropsRaw.data
      const datavizProps = JSON.parse(datavizPropsData)
      fileDataviz = { ...fileDataviz, ...datavizProps }
    }
    // fileDataviz && console.log('C > DatamiFile > beforeMount > fileDataviz : ', fileDataviz)

    // get maps props if any
    const fileMaps = fileOptions.mapview
    if (fileMaps && fileMaps.maps) {
      const maps = []
      for (const map of fileMaps.maps) {
        let mapSettings = { ...map }
        if (map.file) {
          const mapPropsGitObj = this.extractGitInfos(map.file)
          const mapPropsRaw = await this.getFileDataRaw(mapPropsGitObj, this.fileToken)
          const mapPropsData = mapPropsRaw && mapPropsRaw.data
          const mapProps = JSON.parse(mapPropsData)
          mapSettings = { ...map, ...mapProps }
        }
        maps.push(mapSettings)
      }
      fileMaps.maps = maps
    }
    // fileMaps && console.log('C > DatamiFile > beforeMount > fileMaps : ', fileMaps)

    // parse fields to look for foreign keys
    this.processForeignKeys(fileCustomProps)

    // update fileOptions with settings for : schema, consolidation, dataviz, maps
    fileOptions = {
      ...fileOptions,
      ...fileSchema && { schema: fileSchema },
      ...fileCustomProps && { customProps: fileCustomProps },
      ...fileDataviz && { datavizview: fileDataviz },
      ...fileMaps && { mapview: fileMaps }
    }
    // console.log('C > DatamiFile > beforeMount > fileOptions : ', fileOptions)

    // add fileOptions in store
    this.addFileOptions({ ...fileOptions, uuid: gitInfosObject.uuid })
  },
  async mounted () {
    // console.log('\nC > DatamiFile > mounted > this.gitInfos : ', this.gitInfos)
    // console.log('C > DatamiFile > mounted > this.gitObj : ', this.gitObj)
    // console.log('C > DatamiFile > mounted > this.usertoken : ', this.usertoken)
    // console.log('C > DatamiFile > mounted > this.fileInfos : ', this.fileInfos)

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
      updateReqErrors: 'git-data/updateReqErrors',
      activateTrackAllOutlinks: 'activateTrackAllOutlinks'
    }),
    async reloadFile () {
      // Update reloading in store - true
      this.updateReloading({ fileId: this.fileId, isLoading: true })
      this.updateReqErrors({ fileId: this.fileId, addToErrors: false })

      // Request API for file infos
      // console.log('\nC > DatamiFile > reloadFile > respData > ... ')
      const respData = await this.getFileData(this.gitObj, this.fileToken)
      // console.log('\nC > DatamiFile > reloadFile > respData : ', respData)
      const fileInfos = respData.data
      const fileInfosErrors = respData.errors
      fileInfos.uuid = this.fileId
      this.addFileReqInfos(fileInfos)
      this.fileInfos = fileInfos
      // console.log('C > DatamiFile > reloadFile > this.fileInfos : ', this.fileInfos)

      // Request API for file content
      // console.log('\nC > DatamiFile > reloadFile > respDataRaw > ... ')
      const respDataRaw = await this.getFileDataRaw(this.gitObj, this.fileToken)
      // console.log('C > DatamiFile > reloadFile > respDataRaw : ', respDataRaw)
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

      // Data is set again
      const currentFile = this.gitObj.id
      this.updateShareableFiles({ gitfile: currentFile, fileId: this.fileId, isSet: true })
    },
    processForeignKeys (fileCustomProps) {
      const foreignKeysFields = fileCustomProps && fileCustomProps.fields && fileCustomProps.fields.filter(field => field.foreignKey && field.foreignKey.activate)
      if (foreignKeysFields && foreignKeysFields.length) {
        // console.log('\nC > DatamiFile > processForeignKeys > this.gitfile : ', this.gitfile)
        // console.log('C > DatamiFile > processForeignKeys > foreignKeysFields : ', foreignKeysFields)
        foreignKeysFields.forEach(field => {
          const payload = {
            ressource: field.foreignKey.ressource,
            fromFileId: this.gitObj.uuid,
            fromGitfile: this.gitfile,
            field: {
              name: field.name
            },
            foreignKey: {
              fields: field.foreignKey.fields
            },
            options: field.foreignKey.ressourceOptions,
            isLoaded: false
          }
          // console.log('C > DatamiFile > processForeignKeys > payload : ', payload)
          this.updateSharedData(payload)
        })
      }
    },
    async loadExtRessources () {
      // console.log('\nC >>> DatamiFile > loadExtRessources > this.gitObj.id : ', this.gitObj.id)
      // console.log('C >>> DatamiFile > loadExtRessources > this.readyToLoadExtRessources : ', this.readyToLoadExtRessources)
      for (const resrc of this.readyToLoadExtRessources) {
        // console.log('C >>> DatamiFile > loadExtRessources > resrc : ', resrc)
        const fileUrl = resrc.ressource
        // console.log('... C >>> DatamiFile > loadExtRessources > fileUrl : ', fileUrl)
        const ressourceGitObj = this.extractGitInfos(fileUrl)
        const ressourceRaw = await this.getFileDataRaw(ressourceGitObj, this.fileToken)
        // console.log('C >>> DatamiFile > loadExtRessources > ressourceRaw : ', ressourceRaw)
        const dataObj = csvToObject(ressourceRaw.data, resrc.options)
        // console.log('C >>> DatamiFile > loadExtRessources > dataObj : ', dataObj)

        // save data in loadedSharedData
        const fields = Object.entries(dataObj.headers)
          .map((entry, idx) => {
            const fieldId = entry[0]
            const fieldLabel = entry[1].trim()
            const fieldData = {
              field: fieldId,
              label: fieldLabel.trim(),
              type: 'string',
              name: fieldLabel
            }
            return fieldData
          })
        const payloadData = {
          ressource: resrc.ressource,
          ressourceId: resrc.ressourceId,
          data: {
            headers: fields,
            data: dataObj.data
          }
        }
        // console.log('C >>> DatamiFile > loadExtRessources > payloadData : ', payloadData)
        this.updateLoadedSharedData(payloadData)

        // update sharedData
        const payload = {
          ...resrc,
          isLoaded: true
        }
        this.updateSharedData(payload)
      }
    },
    processAction (event) {
      // console.log('\nC > DatamiFile > processAction > event : ', event)
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

.datami-container {
  max-width: 100% !important;
}

.no-text-transform{
  text-transform: none!important;
}

@media(max-width:768px) {
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
