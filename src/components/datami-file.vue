<template>
  <div
    v-if="gitfile"
    :id="fileId"
    :class="`DatamiFile datami-widget datami-widget-root datami-container section pb-0 ${currentViewMode === 'map' ? 'px-0' : 'px-3'} ${fromMultiFiles ? 'add-multifiles-border' : 'datami-widget-root'} ${fromMultiFilesVertical ? 'pt-3 add-multifiles-border-top' : 'pt-0' } ${isDarkMode ? 'datami-darkmode' : ''}`"
    :style="`z-index: 0; background-color: ${currentViewMode === 'cards' ? '#e9e9e9' : 'white'};`">
    <!-- style="z-index: 0;"> -->
    <!-- <link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet"> -->
    <!-- MATOMO -->
    <MatomoScript
      :file-id="fileId"/>

    <DatamiTooltip
      v-if="!fromMultiFiles && tooltip"/>

    <!-- DEBUG ERRORS -->
    <!-- <div
      v-if="debug"
      class="columns">
      <div class="column is-4">
        errors : <br><pre><code>{{ errors }}</code></pre>
      </div>
      <div class="column is-4">
        fileDialogs : <br><pre><code>{{ fileDialogs }}</code></pre>
      </div>
      <div class="column is-4">
        fileIsLoading : <pre><code>{{ fileIsLoading }}</code></pre><br>
        fileIsSaving : <pre><code>{{ fileIsSaving }}</code></pre><br>
      </div>
    </div> -->

    <!-- DEBUG DIALOGS -->
    <!-- <div
      v-if="true"
      class="columns">
      <div class="column is-4">
        hasFileDialogs: <code>{{ hasFileDialogs }}</code><br>
        fileDialogs : <br><pre><code>{{ fileDialogs }}</code></pre>
      </div>
      <div class="column is-4">
        errors : <br><pre><code>{{ errors }}</code></pre>
      </div>
      <div class="column is-4">
        notifications : <br><pre><code>{{ notifications }}</code></pre>
      </div>
    </div> -->

    <!-- DEBUG EDIT MODE BUTTONS -->
    <!-- <div
      v-if="debug"
      class="columns">
      <div class="column is-4">
        fileIsLoading : <pre><code>{{ fileIsLoading }}</code></pre><br>
        fileIsSaving : <pre><code>{{ fileIsSaving }}</code></pre><br>
      </div>
      <div class="column is-4">
        onlypreview : <code>{{ onlypreview }}</code>
      </div>
      <div class="column is-4">
        showEditNavbar : <code>{{ showEditNavbar }}</code>
      </div>
    </div> -->

    <!-- WIDGET -->
    <div
      :id="`datami-widget-${fileId}`"
      :style="`z-index: 0; ${userFullscreen ? 'background-color: white;' : ''}`">
      <div
        :id="`file-navbar-${fileId}`"
        :ref="`file-navbar-${fileId}`"
        :class="`upper-container ${currentViewMode === 'map' ? 'px-3' : ''}`"
        style="z-index: 1;">
        <!-- NAVBAR FILE TITLE / USER BTNS -->
        <div
          :class="`mb-0 ${userFullscreen ? 'pt-6' : ''} ${fromMultiFiles && !fromMultiFilesVertical ? 'mt-4' : '' }`"
          style="z-index: 2">
          <div
            class="columns is-centered mb-0"
            style="z-index: 2">
            <!-- FILE TITLE -->
            <div
              class="filetitle-and-viewmodes column is-12-mobile is-6-tablet is-8-desktop is-flex is-flex-direction-row is-align-items-center"
              style="z-index: 2">
              <!-- DEBUG OUTTER MODAL -->
              <!-- <b-button
                v-if="debug"
                icon-left="bug"
                type="is-danger"
                size="is-small"
                style="z-index: 2"
                @click="isModalActive = true"/> -->
              <!-- USER OPTIONS -->
              <ViewModeBtns
                :file-id="fileId"
                :locale="locale"/>
              <EditModeBtns
                v-if="!onlypreview && showEditNavbar"
                :only-preview="onlypreview"
                :file-id="fileId"
                :locale="locale"/>
              <FileTitle
                :title="title"
                :file-id="fileId"
                :locale="locale"/>
            </div>

            <!-- USER NAVBAR -->
            <div
              class="usernavbar column is-12-mobile is-6-tablet is-4-desktop is-flex is-align-items-center"
              style="z-index: 2">
              <UserOptions
                v-if="gitObj"
                :file-id="fileId"
                :only-preview="onlypreview"
                :locale="locale"/>
            </div>
          </div>
        </div>
      </div>

      <!-- DEBUGGING FOREIGN KEYS-->
      <!-- <div
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
      </div> -->

      <!-- DEBUGGING -->
      <!-- <div
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
          v-if="true"
          class="column is-8">
          fileOptions :<br>
          <pre><code>{{ fileOptions }}</code></pre>
        </div>
      </div> -->

      <!-- PREVIEWS - SWITCH BY FILE TYPE -->
      <div
        v-show="!fileIsSaving"
        class="datami-file-previews">
        <!-- PREVIEWS CSV -->
        <div
          v-if="fileTypeFamily === 'table'"
          class="container datami-container"
          style="z-index: 1;">
          <PreviewCsv
            ref="previewcsv"
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
            ref="previewmd"
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
            ref="previewjson"
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

    <!-- DEV - TEST DIALOG MODAL -->
    <b-modal
      v-model="isModalActive"
      :width="'80%'"
      @close="resetFileDialog">
      <DialogSkeleton
        :file-id="fileId"
        :locale="locale"/>
    </b-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import { mixinTooltip, mixinGlobal, mixinForeignKeys, mixinGit } from '@/utils/mixins.js'
import { csvToObject } from '@/utils/csvUtils'

export default {
  name: 'DatamiFile',
  components: {
    MatomoScript: () => import(/* webpackChunkName: "MatomoScript" */ '@/components/matomo/MatomoScript.vue'),
    DatamiTooltip: () => import(/* webpackChunkName: "DatamiTooltip" */ '@/components/user/DatamiTooltip.vue'),
    DialogSkeleton: () => import(/* webpackChunkName: "DialogSkeleton" */ '@/components/dialogs/DialogSkeleton.vue'),
    EditModeBtns: () => import(/* webpackChunkName: "EditModeBtns" */ '@/components/edition/EditModeBtns.vue'),
    FileTitle: () => import(/* webpackChunkName: "FileTitle" */ '@/components/navbar/FileTitle.vue'),
    ViewModeBtns: () => import(/* webpackChunkName: "ViewModeBtns" */ '@/components/previews/ViewModeBtns.vue'),
    UserOptions: () => import(/* webpackChunkName: "UserOptions" */ '@/components/user/UserOptions.vue'),
    PreviewCsv: () => import(/* webpackChunkName: "PreviewCsv" */ '@/components/previews/PreviewCsv.vue'),
    PreviewMd: () => import(/* webpackChunkName: "PreviewMd" */ '@/components/previews/PreviewMd.vue'),
    PreviewJson: () => import(/* webpackChunkName: "PreviewJson" */ '@/components/previews/PreviewJson.vue'),
    DatamiCredits: () => import(/* webpackChunkName: "DatamiCredits" */ '@/components/credits/DatamiCredits.vue')
  },
  mixins: [
    mixinTooltip,
    mixinGlobal,
    mixinForeignKeys,
    mixinGit
  ],
  props: {
    title: {
      default: 'datami',
      type: String
    },
    localdev: {
      default: false,
      type: Boolean
    },
    gitfile: {
      default: '',
      type: String
    },
    gitfilelocal: {
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
    },
    theme: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      datamiRoot: true,
      cssFiles: [],
      cssFilesExtra: [
        'styles/components/credits/datami-credits.css',
        'styles/datami-global.css',
        'styles/datami-dark-mode.css',
        'styles/components/edition/datami-edit-mode-buttons.css',
        'styles/components/edition/datami-edit-navbar-skeleton.css',
        'styles/components/edition/datami-edit-tag-value.css',
        'styles/components/filters/datami-button-filter-by.css',
        'styles/components/filters/datami-custom-filter-dropdown.css',
        'styles/components/filters/datami-filter-tags.css',
        'styles/components/pagination/datami-pages-navigation.css',
        'styles/components/previews/cards/datami-cards.css',
        'styles/components/previews/dataviz/datami-dataviz.css',
        'styles/components/previews/maps/datami-maps.css',
        'styles/components/previews/table/datami-table.css',
        'styles/components/previews/tags/datami-tags.css',
        'styles/components/previews/json/datami-json.css',
        'styles/components/previews/md/datami-md.css',
        'styles/components/previews/md/datami-shodown.css',
        'styles/components/previews/datami-view-mode-buttons.css',
        'styles/components/sorting/datami-buttons-sort-by.css',
        'styles/components/user/datami-user-buttons.css',
        'styles/components/user/datami-tooltip.css'
      ],
      isModalActive: false,
      // file infos
      gitfileDatami: undefined,
      fileId: undefined,
      fileType: undefined,
      fileInfos: undefined,
      fileRaw: undefined,
      fileClientRaw: undefined
    }
  },
  watch: {
    hasFileDialogs (next) {
      // console.log('\nC > DatamiFile > watch > hasFileDialogs > next : ', next)
      if (next) {
        this.hideGlobalTooltip()
        this.isModalActive = true
      } else {
        this.isModalActive = false
      }
    },
    async gitfileDatami (next) {
      // console.log('\nC > DatamiFile > watch > gitfileDatami > next : ', next)
      await this.initWidget()
      const sourceBranch = { branch: this.gitObj.branch, isRefBranch: true }
      this.updateUserBranches({ fileId: this.fileId, branches: [sourceBranch] })
      await this.reloadFile()
    },
    fileIsLoading (next) {
      if (next) { this.reloadFile() }
    },
    shareableFiles (next) {
      // console.log('\nC >>> DatamiFile > watch > shareableFiles > next : ', next)
      const goNoGo = next && next.length && next.map(i => i.isSet)
      // next && next.length && console.log('\nC >>> DatamiFile > watch > shareableFiles > next.map : ', next.map(i => `${i.gitfile}-${i.isSet}`))
      if (next && goNoGo && goNoGo.every(b => b)) {
        // console.log('C >>> DatamiFile > watch > shareableFiles > this.gitObj.id : ', this.gitObj.id)
        // console.log('C >>> DatamiFile > watch > shareableFiles > goNoGo : ', goNoGo)
        // console.log('C >>> DatamiFile > watch > shareableFiles > this.shareableFiles.map(i => i.isSet) : ', this.shareableFiles.map(i => i.isSet))
        this.updateLoadingRessources({ key: 'loadingShared', loadState: 'loading', from: this.fileId })
        this.updateLoadingRessources({ key: 'loadingExtRessources', loadState: 'loading', from: this.fileId })
      }
    },
    async loadingExtRessources (next) {
      // console.log('C >>> DatamiFile > watch > loadingExtRessources > next : ', next)
      if (next && next.loadState === 'loading' && next.initiator === this.fileId && this.readyToLoadExtRessources) {
        await this.loadExtRessources()
      }
    },
    fileSignals (next) {
      if (next && next.length) {
        next.forEach(signal => {
          // console.log('\nC >>> DatamiFile > watch > fileSignals > signal : ', signal)
          switch (signal.action) {
            case 'uploadFileData':
              this.fileClientRaw = signal.event.data
              this.removeFileSignal(signal.signalId)
              break
          }
        })
      }
    }
  },
  async beforeMount () {
    if (!this.fromMultiFiles) {
      this.cssFiles = [...this.cssFilesExtra]
    }
    console.log('\nC > DatamiFile > beforeMount > this.cssFiles : ', this.cssFiles)
    this.fileId = this.uuidv4()
    this.toggleEditNavbar({ uuid: this.fileId, status: false })
    this.changeEditViewMode({ fileId: this.fileId, mode: 'preview' })
    this.resetReqErrors(this.fileId)
    // this.updateReqErrors({ fileId: this.fileId, addToErrors: false })
    this.updateReloading({ fileId: this.fileId, isLoading: true })

    // INITIALIZING LOCAL STORAGE
    this.initializeStorage()
    // console.log('\nC > DatamiFile > beforeMount > this.gitfile : ', this.gitfile)
    // console.log('C > DatamiFile > beforeMount > this.localdev : ', this.localdev)
    // console.log('C > DatamiFile > beforeMount > this.gitfilelocal : ', this.gitfilelocal)
    this.gitfileDatami = this.localdev ? this.gitfilelocal : this.gitfile
    await this.initWidget()
  },
  async mounted () {
    // console.log('\nC > DatamiFile > mounted > this.gitInfos : ', this.gitInfos)
    // console.log('C > DatamiFile > mounted > this.gitObj : ', this.gitObj)
    // console.log('C > DatamiFile > mounted > this.usertoken : ', this.usertoken)
    // console.log('C > DatamiFile > mounted > this.fileInfos : ', this.fileInfos)

    const sourceBranch = { branch: this.gitObj.branch, isRefBranch: true }
    this.updateUserBranches({ fileId: this.fileId, branches: [sourceBranch] })
    await this.reloadFile(true)
  },
  beforeDestroy () {
    // console.log('\nC > DatamiFile > beforeDestroy > this.gitfile : ', this.gitfile)
  },
  methods: {
    ...mapActions({
      changeEditViewMode: 'git-data/changeEditViewMode',
      toggleEditNavbar: 'toggleEditNavbar',
      addGitInfos: 'addGitInfos',
      addFileOptions: 'addFileOptions',
      addFileReqInfos: 'addFileReqInfos',
      updateToken: 'git-data/updateToken',
      updateReloading: 'git-data/updateReloading',
      activateTrackAllOutlinks: 'activateTrackAllOutlinks',
      initializeStorage: 'git-storage/initializeStorage'
    }),
    async initWidget () {
      // const fileUuid = this.uuidv4()

      // console.log('\nC > DatamiFile > initWidget > this.trackalloutlinks : ', this.trackalloutlinks)
      this.activateTrackAllOutlinks({ uuid: this.fileId, val: this.trackalloutlinks })

      if (!this.fromMultiFiles) {
        this.setWidgetCopy()
      }
      const gitInfosObject = this.extractGitInfos(this.gitfileDatami)
      // console.log('C > DatamiFile > initWidget > gitInfosObject : ', gitInfosObject)

      this.updateShareableFiles({ gitfile: this.gitfileDatami, fileId: this.fileId, isSet: false })
      gitInfosObject.uuid = this.fileId
      gitInfosObject.title = this.title
      gitInfosObject.onlyPreview = this.onlypreview
      // console.log('C > DatamiFile > initWidget > gitInfosObject : ', gitInfosObject)
      // this.fileId = gitInfosObject.uuid
      this.fileType = gitInfosObject.filetype
      if (!this.getGitInfosObj[this.fileId]) {
        // load token
        let token = this.usertoken && this.usertoken !== '' && this.usertoken
        // console.log('C > DatamiFile > initWidget > process.env : ', process.env)
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
      // console.log('\nC > DatamiFile > initWidget > this.gitObj : ', this.gitObj)

      // console.log('C > DatamiFile > initWidget > this.options : ', this.options)
      // build options object
      let fileOptions = this.options && this.options.length ? JSON.parse(this.options) : {}
      // console.log('C > DatamiFile > initWidget > fileOptions : ', fileOptions)

      let fileSchema = fileOptions.schema
      // console.log('C > DatamiFile > initWidget > fileSchema : ', fileSchema)
      const fileSchemaLocal = fileSchema && fileSchema.localdev
      // console.log('C > DatamiFile > initWidget > fileSchemaLocal : ', fileSchemaLocal)
      if (fileSchema) { fileSchema.file = fileSchemaLocal ? fileSchema.filelocal : fileSchema && fileSchema.file }
      if (fileSchema && fileSchema.file) {
        const schemaGitObj = this.extractGitInfos(fileSchema.file)
        // console.log('C > DatamiFile > initWidget > schemaGitObj : ', schemaGitObj)
        // const schemaRaw = await this.getFileDataRaw(schemaGitObj, this.fileToken)
        const schemaRaw = await this.getFileDataAndErrors(schemaGitObj, this.fileToken, true)
        // console.log('C > DatamiFile > initWidget > schemaRaw : ', schemaRaw)
        const schemaData = schemaRaw && schemaRaw.data
        // console.log('C > DatamiFile > initWidget > schemaData : ', schemaData)
        const schema = schemaRaw.ok && JSON.parse(schemaData)
        // console.log('C > DatamiFile > initWidget > schema : ', schema)
        fileSchema = schema && { ...schema, file: fileSchema.file }
      }
      // fileSchema && console.log('C > DatamiFile > initWidget > fileSchema : ', fileSchema)

      // get custom props if any
      let fileCustomProps = fileOptions['fields-custom-properties']
      // console.log('C > DatamiFile > initWidget > fileCustomProps : ', fileCustomProps)
      const fileCustomPropsLocal = fileCustomProps && fileCustomProps.localdev
      // console.log('C > DatamiFile > initWidget > fileCustomPropsLocal : ', fileCustomPropsLocal)
      if (fileCustomProps) { fileCustomProps.file = fileCustomPropsLocal ? fileCustomProps.filelocal : fileCustomProps && fileCustomProps.file }
      if (fileCustomProps && fileCustomProps.file) {
        const customPropsGitObj = this.extractGitInfos(fileCustomProps.file)
        // console.log('C > DatamiFile > initWidget > customPropsGitObj : ', customPropsGitObj)
        // const customPropsRaw = await this.getFileDataRaw(customPropsGitObj, this.fileToken)
        const customPropsRaw = await this.getFileDataAndErrors(customPropsGitObj, this.fileToken, true)
        // console.log('C > DatamiFile > initWidget > customPropsRaw : ', customPropsRaw)
        const customPropsData = customPropsRaw && customPropsRaw.data
        // console.log('C > DatamiFile > initWidget > customPropsData : ', customPropsData)
        const customProps = customPropsRaw.ok && JSON.parse(customPropsData)
        // console.log('C > DatamiFile > initWidget > customProps : ', customProps)
        fileCustomProps = customProps && { ...customProps, file: fileCustomProps.file }
      }
      // fileCustomProps && console.log('\nC > DatamiFile > initWidget > this.gitfileDatami : ', this.gitfileDatami)
      // fileCustomProps && console.log('C > DatamiFile > initWidget > fileCustomProps : ', fileCustomProps)

      // get dataviz props if any
      let fileDataviz = fileOptions.datavizview
      // console.log('C > DatamiFile > initWidget > fileDataviz : ', fileDataviz)
      const fileDatavizLocal = fileDataviz && fileDataviz.localdev
      // console.log('C > DatamiFile > initWidget > fileDatavizLocal : ', fileDatavizLocal)
      if (fileDataviz) { fileDataviz.file = fileDatavizLocal ? fileDataviz.filelocal : fileDataviz && fileDataviz.file }
      if (fileDataviz && fileDataviz.file) {
        const datavizPropsGitObj = this.extractGitInfos(fileDataviz.file)
        // const datavizPropsRaw = await this.getFileDataRaw(datavizPropsGitObj, this.fileToken)
        const datavizPropsRaw = await this.getFileDataAndErrors(datavizPropsGitObj, this.fileToken, true)
        const datavizPropsData = datavizPropsRaw && datavizPropsRaw.data
        const datavizProps = datavizPropsRaw.ok && JSON.parse(datavizPropsData)
        fileDataviz = datavizProps && { ...fileDataviz, ...datavizProps }
      }
      // fileDataviz && console.log('C > DatamiFile > initWidget > fileDataviz : ', fileDataviz)

      // get maps props if any
      const fileMaps = fileOptions.mapview
      if (fileMaps && fileMaps.maps) {
        const maps = []
        for (const map of fileMaps.maps) {
          let mapSettings = { ...map }
          const mapSettingsLocal = mapSettings.localdev
          // console.log('C > DatamiFile > initWidget > mapSettingsLocal : ', mapSettingsLocal)
          map.file = mapSettingsLocal ? map.filelocal : map.file
          if (map.file) {
            const mapPropsGitObj = this.extractGitInfos(map.file)
            // const mapPropsRaw = await this.getFileDataRaw(mapPropsGitObj, this.fileToken)
            const mapPropsRaw = await this.getFileDataAndErrors(mapPropsGitObj, this.fileToken, true)
            const mapPropsData = mapPropsRaw && mapPropsRaw.data
            const mapProps = mapPropsRaw.ok && JSON.parse(mapPropsData)
            mapSettings = mapProps && { ...map, ...mapProps }
          }
          mapSettings && maps.push(mapSettings)
        }
        fileMaps.maps = maps
      }
      // fileMaps && console.log('C > DatamiFile > initWidget > fileMaps : ', fileMaps)

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
      // console.log('C > DatamiFile > initWidget > fileOptions : ', fileOptions)

      // add fileOptions in store
      this.addFileOptions({ ...fileOptions, uuid: gitInfosObject.uuid })
    },
    async reloadFile (firstLoading = false) {
      // Update reloading in store - true
      if (!firstLoading) { this.updateReloading({ fileId: this.fileId, isLoading: true }) }
      // this.updateReqErrors({ fileId: this.fileId, addToErrors: false })

      // Request API for file infos
      // console.log('\nC > DatamiFile > reloadFile > respData > ... ')
      // const respData = await this.getFileData(this.gitObj, this.fileToken)
      const respData = await this.getFileDataAndErrors(this.gitObj, this.fileToken)
      // console.log('\nC > DatamiFile > reloadFile > respData : ', respData)
      const fileInfos = respData.data
      // const fileInfosErrors = respData.errors
      fileInfos.uuid = this.fileId
      this.addFileReqInfos(fileInfos)
      this.fileInfos = fileInfos
      // console.log('C > DatamiFile > reloadFile > this.fileInfos : ', this.fileInfos)

      // Request API for file content
      // console.log('\nC > DatamiFile > reloadFile > respDataRaw > ... ')
      // const respDataRaw = await this.getFileDataRaw(this.gitObj, this.fileToken)
      const respDataRaw = await this.getFileDataAndErrors(this.gitObj, this.fileToken, true)
      // console.log('\nC > DatamiFile > reloadFile > respDataRaw : ', respDataRaw)
      const fileRaw = respDataRaw.data
      this.fileRaw = respDataRaw.ok && fileRaw

      // Update reloading in store - false
      this.updateReloading({ fileId: this.fileId, isLoading: false })

      // Data is set again
      const currentFile = this.gitObj.id
      this.updateShareableFiles({ gitfile: currentFile, fileId: this.fileId, isSet: true })
    },
    processForeignKeys (fileCustomProps) {
      const foreignKeysFields = fileCustomProps && fileCustomProps.fields && fileCustomProps.fields.filter(field => field.foreignKey && field.foreignKey.activate)
      if (foreignKeysFields && foreignKeysFields.length) {
        // console.log('\nC > DatamiFile > processForeignKeys > this.gitfileDatami : ', this.gitfileDatami)
        // console.log('C > DatamiFile > processForeignKeys > foreignKeysFields : ', foreignKeysFields)
        foreignKeysFields.forEach(field => {
          const payload = {
            ressource: field.foreignKey.ressource,
            fromFileId: this.gitObj.uuid,
            fromGitfile: this.gitfileDatami,
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
        // const ressourceRaw = await this.getFileDataRaw(ressourceGitObj, this.fileToken)
        const ressourceRaw = await this.getFileDataAndErrors(ressourceGitObj, this.fileToken, true)
        // console.log('C >>> DatamiFile > loadExtRessources > ressourceRaw : ', ressourceRaw)
        const dataObj = ressourceRaw.ok && csvToObject(ressourceRaw.data, resrc.options)
        // console.log('C >>> DatamiFile > loadExtRessources > dataObj : ', dataObj)

        // save data in loadedSharedData
        const fields = dataObj && Object.entries(dataObj.headers)
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
            headers: fields || [],
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
    }
  }
}
</script>

<style>

/* .datami-container {
  max-width: 100% !important;
}

.no-text-transform{
  text-transform: none!important;
}
.datami-darkmode-white-text{
  color: white !important;
}
.datami-darkmode{
  background-color: #2d2d30 !important;
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
} */

</style>
