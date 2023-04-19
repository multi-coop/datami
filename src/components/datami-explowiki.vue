<template>
  <div
    :id="fileId"
    :class="`DatamiExplowiki datami-widget-root datami-widget section pb-0 ${currentViewMode === 'map' ? 'px-0' : 'px-3'} ${fromMultiFiles ? 'add-multifiles-border' : ''} ${fromMultiFilesVertical ? 'pt-3 add-multifiles-border-top' : 'pt-0' } ${isDarkMode ? 'datami-darkmode' : ''}`"
    :style="`z-index: 0; max-width: 100%; background-color: ${currentViewMode === 'cards' ? '#e9e9e9' : 'white'};`">
    <!-- style="z-index: 0; max-width: 100%"> -->
    <!-- MATOMO -->
    <MatomoScript
      :file-id="fileId"/>

    <DatamiTooltip
      v-if="!fromMultiFiles && tooltip"
      :file-id="fileId"
      :locale="locale"/>

    <!-- WIDGET -->
    <div
      :id="`datami-widget-${fileId}`"
      :class="`mb-4 ${fromMultiFiles && !fromMultiFilesVertical ? 'mt-4' : '' }`"
      :style="`z-index: 0; ${userFullscreen ? 'background-color: white;' : ''}`">
      <!-- NAVBAR FILE TITLE / USER BTNS -->
      <div
        :id="`file-navbar-${fileId}`"
        class="columns is-multiline is-centered mb-4"
        style="z-index: 3;">
        <!-- FILE TITLE -->
        <div
          class="filetitle-and-viewmodes column is-12-mobile is-12-tablet is-7-desktop is-8-widescreen is-flex is-flex-direction-row is-align-items-center"
          style="z-index: 3">
          <!-- DEBUG OUTTER MODAL -->
          <!-- <b-button
            v-if="debug"
            icon-left="bug"
            type="is-danger"
            size="is-small"
            @click="isModalActive = true"/> -->
          <!-- USER OPTIONS -->
          <ViewModeBtns
            :file-id="fileId"
            :default-view="defaultView"
            :locale="locale"/>
          <FileTitle
            :show-file-infos="showFileInfos"
            :title="title"
            :file-id="fileId"
            :locale="locale"
            @toggleInfos="showFileInfos = !showFileInfos"/>
        </div>

        <!-- USER NAVBAR -->
        <div
          class="usernavbar column is-12-mobile is-12-tablet is-5-desktop is-4-widescreen is-flex is-direction-row is-align-items-center"
          style="z-index: 2">
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
          wikiObj:
          <br>
          <code>
            <pre>{{ wikiObj }}</pre>
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
      <div
        v-if="debug"
        class="column is-8">
        <p>
          wikiPages:
          <br>
          <code>
            <pre>{{ wikiPages }}</pre>
          </code>
        </p>
      </div>
      <div
        v-if="debug"
        class="column is-4">
        <p>
          wikiFields
          <br>
          <code>
            <pre>{{ wikiFields }}</pre>
          </code>
        </p>
      </div>
      <!-- <div class="column is-one-third">
        <p>
          fileRaw:
          <br>
          <code>
            <pre>{{ fileRaw }}</pre>
          </code>
        </p>
      </div> -->
    </div>

    <!-- FILE NAVBAR BUTTONS -->
    <!-- {{ fileOptions }} -->
    <!-- hasCardsView : <code>{{ hasCardsView }}</code><br> -->
    <!-- hasCardsDetail : <code>{{ hasCardsDetail }}</code><br> -->
    <EditNavbarSkeleton
      v-if="!fileIsLoading"
      :file-id="fileId"
      :only-preview="true"
      :locale="locale"/>

    <!-- PREVIEWS CSV / CARDS WIKI -->
    <div
      v-if="wikiItems && fileTypeFamily === 'table'"
      class="container datami-container"
      style="z-index: 1;">
      <PreviewCsv
        :only-preview="true"
        :file-id="fileId"
        :file-is-loading="fileIsLoading"
        :file-raw="fileRaw"
        :wiki-raw="wikiRaw"
        :items-total="wikiItems && wikiItems.length"
        :locale="locale"
        :debug="debug"/>
    </div>

    <!-- PROGRESS LOADER -->
    <!-- v-if="wikiItems && wikiItems.length" -->
    <LoaderWikimedia
      v-if="wikiItems && wikiItems.length && (wikiPages.length != wikiItems.length)"
      :file-id="fileId"
      :items-loaded="wikiPages.length"
      :items-total="wikiItems.length"
      :locale="locale"/>

    <!-- CREDITS -->
    <DatamiCredits
      :file-id="fileId"
      :logos="fileCreditsLogos"
      :locale="locale"/>

    <!-- DIALOG MODAL -->
    <b-modal
      v-model="isModalActive"
      class="datami-modal-dialog-opener"
      :width="'80%'"
      @close="resetDialogs">
      <DialogSkeleton
        :file-id="fileId"
        :locale="locale"/>
    </b-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import {
  mixinTooltip,
  mixinClientUrl,
  mixinGlobal,
  mixinGit,
  mixinCsv,
  mixinWiki
} from '@/utils/mixins.js'
import { getDefaultViewMode } from '@/utils/fileTypesUtils'

export default {
  name: 'DatamiExploWiki',
  components: {
    MatomoScript: () => import(/* webpackChunkName: "MatomoScript" */ '@/components/matomo/MatomoScript.vue'),
    DatamiTooltip: () => import(/* webpackChunkName: "DatamiTooltip" */ '@/components/user/DatamiTooltip.vue'),
    DialogSkeleton: () => import(/* webpackChunkName: "DialogSkeleton" */ '@/components/dialogs/DialogSkeleton.vue'),
    FileTitle: () => import(/* webpackChunkName: "FileTitle" */ '@/components/navbar/FileTitle.vue'),
    ViewModeBtns: () => import(/* webpackChunkName: "ViewModeBtns" */ '@/components/previews/ViewModeBtns.vue'),
    UserOptions: () => import(/* webpackChunkName: "UserOptions" */ '@/components/user/UserOptions.vue'),
    EditNavbarSkeleton: () => import(/* webpackChunkName: "EditNavbarSkeleton" */ '@/components/edition/EditNavbarSkeleton.vue'),
    LoaderWikimedia: () => import(/* webpackChunkName: "LoaderWikimedia" */ '@/components/loaders/LoaderWikimedia.vue'),
    PreviewCsv: () => import(/* webpackChunkName: "PreviewCsv" */ '@/components/previews/PreviewCsv.vue'),
    DatamiCredits: () => import(/* webpackChunkName: "DatamiCredits" */ '@/components/credits/DatamiCredits.vue')
  },
  mixins: [
    mixinTooltip,
    mixinClientUrl,
    mixinGlobal,
    mixinGit,
    mixinCsv,
    mixinWiki
  ],
  props: {
    fileIdFromMultifiles: {
      default: undefined,
      type: String
    },
    title: {
      default: 'datami',
      type: String
    },
    creditslogos: {
      default: '',
      type: [String, Array]
    },
    wikilist: {
      default: '',
      type: String
    },
    wikipages: {
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
    tabId: {
      default: 1,
      type: Number
    },
    fromMultiFilesVertical: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      datamiRoot: true,
      cssFiles: [],
      cssFilesExtra: [
        'styles/components/credits/datami-credits.css',
        'styles/datami-dark-mode.css',
        'styles/datami-global.css',
        'styles/components/filters/datami-button-filter-by.css',
        'styles/components/filters/datami-custom-filter-dropdown.css',
        'styles/components/filters/datami-filter-tags.css',
        'styles/components/pagination/datami-pages-navigation.css',
        'styles/components/previews/cards/datami-cards.css',
        'styles/components/previews/dataviz/datami-dataviz.css',
        'styles/components/previews/maps/datami-maps.css',
        'styles/components/previews/table/datami-table.css',
        'styles/components/previews/tags/datami-tags.css',
        'styles/components/previews/datami-view-mode-buttons.css',
        'styles/components/sorting/datami-buttons-sort-by.css',
        'styles/components/user/datami-user-buttons.css',
        'styles/components/user/datami-tooltip.css',
        // 'fonts/materialdesignicons-webfont.woff2'
        'fonts/materialdesignicons.min.css'
        // 'https://cdn.jsdelivr.net/npm/@mdi/font@5.8.55/css/materialdesignicons.min.css'
      ],
      cssHeadFiles: [],
      cssHeadFilesExtra: [
        // 'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css',
        'https://cdn.jsdelivr.net/npm/@mdi/font@5.8.55/css/materialdesignicons.min.css'
      ],
      isModalActive: false,
      // file infos
      fileId: undefined,
      fileType: undefined,
      fileInfos: undefined,
      fileRaw: undefined,
      fileClientRaw: undefined,
      showFileInfos: false,

      // tests for mediawiki fetching
      mediawikiDefaultFields: ['title', 'imageUrl', 'pageUrl'],
      mediawikiOptions: undefined,
      wikiObj: undefined,
      wikiItems: undefined,
      wikiFields: undefined,
      wikiPages: undefined,
      defaultView: undefined
    }
  },
  computed: {
    headersArray () {
      // const headers = this.wikiHeaders ? Array.from(this.wikiHeaders) : []
      // return headers
      return Array.from(this.wikiHeaders)
    },
    wikiRaw () {
      return {
        headers: this.wikiFields,
        data: this.wikiPages
      }
    }
  },
  watch: {
    hasFileDialogs (next) {
      // console.log('\nC > DatamiExploWiki > watch > hasFileDialogs > next : ', next)
      if (next) {
        this.hideGlobalTooltip()
        this.isModalActive = true
      } else {
        this.isModalActive = false
      }
    },
    showFileInfos (next) {
      if (next) {
        // track with matomo
        this.trackEvent('openFileInfos', 'FileTitle')
      }
    },
    fileIsLoading (next) {
      // console.log('C > DatamiExploWiki > watch > fileIsLoading > next : ', next)
      if (next) { this.reloadMediawikiRessources() }
    }
  },
  async beforeMount () {
    if (!this.fromMultiFiles) {
      this.cssFiles = [...this.cssFilesExtra]
      this.cssHeadFiles = [...this.cssHeadFilesExtra]
    }
    const wikiUuid = this.fileIdFromMultifiles || this.uuidv4()
    this.fileId = wikiUuid
    this.toggleEditNavbar({ uuid: this.fileId, status: false })
    this.changeEditViewMode({ fileId: this.fileId, mode: 'preview' })
    this.resetReqErrors(this.fileId)

    // INITIALIZING LOCAL STORAGE
    this.initializeStorage()

    // console.log('\nC > DatamiExploWiki > beforeMount > this.wikifile : ', this.wikifile)
    // console.log('C > DatamiExploWiki > beforeMount > this.wikilist : ', this.wikilist)
    // console.log('C > DatamiExploWiki > beforeMount > this.options : ', this.options)

    this.activateTrackAllOutlinks({ uuid: wikiUuid, val: this.trackalloutlinks })

    // build options object
    let mediawikiOptions = this.options && this.options.length ? JSON.parse(this.options) : {}
    mediawikiOptions.tagseparator = ',' // to parse tags fields
    mediawikiOptions.separator = '\t' // for csv export
    this.mediawikiOptions = mediawikiOptions

    const defaultView = getDefaultViewMode(mediawikiOptions, 'table', this.fileId)
    // console.log('C > DatamiExploWiki > beforeMount > defaultView : ', defaultView)
    this.defaultView = defaultView

    // add default fields for pages structuration
    // console.log('C > DatamiExploWiki > beforeMount > this.mediawikiOptions : ', this.mediawikiOptions)
    const fields = [...this.mediawikiDefaultFields, ...mediawikiOptions.wikisettings.fields]
    this.wikiFields = { ...fields }

    // get wiki object for further reload infos
    const wikiInfosObject = this.extractWikiInfos(this.wikilist, this.mediawikiOptions.wikisettings)
    wikiInfosObject.uuid = wikiUuid
    wikiInfosObject.title = this.title
    wikiInfosObject.wikipages = this.wikipages && JSON.parse(this.wikipages)
    wikiInfosObject.onlyPreview = this.onlypreview
    this.wikiObj = wikiInfosObject
    // this.fileId = wikiInfosObject.uuid
    this.fileType = wikiInfosObject.filetype
    // console.log('C > DatamiExploWiki > beforeMount > wikiInfosObject : ', wikiInfosObject)
    if (!this.getGitInfosObj[wikiUuid]) {
      this.addGitInfos(wikiInfosObject)
    }
    // get schema if any
    let mediawikiSchema = mediawikiOptions.schema
    // console.log('C > DatamiExploWiki > beforeMount > mediawikiSchema : ', mediawikiSchema)
    if (mediawikiSchema && mediawikiSchema.file) {
      const schemaGitObj = this.extractGitInfos(mediawikiSchema.file)
      // console.log('C > DatamiExploWiki > beforeMount > schemaGitObj : ', schemaGitObj)
      // const schemaRaw = await this.getFileDataRaw(schemaGitObj)
      const schemaRaw = await this.getFileDataAndErrors(schemaGitObj, undefined, true)
      // console.log('C > DatamiExploWiki > beforeMount > schemaRaw : ', schemaRaw)
      const schemaData = schemaRaw && schemaRaw.data
      // console.log('C > DatamiExploWiki > beforeMount > schemaData : ', schemaData)
      const schema = schemaRaw.ok && JSON.parse(schemaData)
      mediawikiSchema = schema && { ...schema, file: mediawikiSchema.file }
      // mediawikiOptions.schema = schema
      // console.log('C > DatamiExploWiki > beforeMount > schema : ', schema)
    }

    // get custom props if any
    let mediawikiCustomProps = mediawikiOptions['fields-custom-properties']
    if (mediawikiCustomProps && mediawikiCustomProps.file) {
      const customPropsGitObj = this.extractGitInfos(mediawikiCustomProps.file)
      // const customPropsRaw = await this.getFileDataRaw(customPropsGitObj)
      const customPropsRaw = await this.getFileDataAndErrors(customPropsGitObj, undefined, true)
      const customPropsData = customPropsRaw && customPropsRaw.data
      const customProps = customPropsRaw.ok && JSON.parse(customPropsData)
      mediawikiCustomProps = customProps && { ...customProps, file: mediawikiCustomProps.file }
    }

    // update fileOptions with schema and consolidation settings
    mediawikiOptions = {
      ...mediawikiOptions,
      ...mediawikiSchema && { schema: mediawikiSchema },
      ...mediawikiCustomProps && { customProps: mediawikiCustomProps }
    }

    this.addFileOptions({ ...mediawikiOptions, uuid: wikiUuid })
    // console.log('C > DatamiExploWiki > beforeMount > wikiInfosObject : ', wikiInfosObject)
  },
  async mounted () {
    await this.reloadMediawikiRessources()
  },
  methods: {
    ...mapActions({
      changeEditViewMode: 'git-data/changeEditViewMode',
      toggleEditNavbar: 'toggleEditNavbar',
      addGitInfos: 'addGitInfos',
      addFileOptions: 'addFileOptions',
      addFileReqInfos: 'addFileReqInfos',
      updateReloading: 'git-data/updateReloading',
      initializeStorage: 'git-storage/initializeStorage',
      activateTrackAllOutlinks: 'activateTrackAllOutlinks'
    }),
    async reloadMediawikiRessources () {
      // Update reloading in store - true
      this.updateReloading({ fileId: this.fileId, isLoading: true })

      // reset local data
      let wikiItems = []
      this.wikiItems = []
      this.wikiPages = []

      // get wikipages list if any
      const wikipages = this.wikiObj.wikipages
      // console.log('C > DatamiExploWiki > reloadMediawikiRessources > wikipages : ', wikipages)
      if (wikipages && wikipages.length) {
        for (const pageUrl of wikipages) {
          const pageData = await this.getMediaWikiPage(this.wikiObj, pageUrl, this.uuidv4(), this.mediawikiOptions.wikisettings)
          // console.log('C > DatamiExploWiki > reloadMediawikiRessources > pageData : ', pageData)
          pageData.temp = this.restructurePageData(pageData, this.wikiFields)
          // console.log('C > DatamiExploWiki > reloadMediawikiRessources > pageData : ', pageData)
          this.wikiPages.push(pageData.temp)
          this.wikiItems.push(pageData.item)
          if (this.hasCustomFilters) { this.updateCustomFilters(pageData.temp) }
        }
      }

      // Request API for wiki pages data
      const respWikidataRaw = await this.getMediawikiData(this.wikiObj.apiUrl, this.mediawikiOptions.wikisettings)
      // console.log('\nC > DatamiExploWiki > reloadMediawikiRessources > respWikidataRaw : ', respWikidataRaw)
      if (respWikidataRaw.data) {
        // let wikiItems = respWikidataRaw.data.slice(0, 10)
        wikiItems = respWikidataRaw.data
        wikiItems = wikiItems.map(item => { return { ...item, id: this.uuidv4() } })
        // console.log('C > DatamiExploWiki > reloadMediawikiRessources > wikiItems : ', wikiItems)
        this.wikiItems.push(...wikiItems)

        // Update reloading in store - false
        this.updateReloading({ fileId: this.fileId, isLoading: false })

        // this.wikiHeaders = new Set()
        // console.log('C > DatamiExploWiki > reloadMediawikiRessources > pages : ', pages)
        // for (const item of this.wikiItems.filter(item => !item.isLoaded)) {
        //   const pageData = await this.getMediawikiItem(this.wikiObj, item, this.mediawikiOptions.wikisettings)
        //   // console.log('C > DatamiExploWiki > reloadMediawikiRessources > pageData : ', pageData)
        //   pageData.temp = this.restructurePageData(pageData, this.wikiFields)
        //   // console.log('C > DatamiExploWiki > reloadMediawikiRessources > pageData.temp : ', pageData.temp)
        //   this.wikiPages.push(pageData.temp)
        //   if (this.hasCustomFilters) { this.updateCustomFilters(pageData.temp) }
        // }
        const itemsToLoad = this.wikiItems.filter(item => !item.isLoaded)
        const items = await this.getMediawikiItems(this.wikiObj, itemsToLoad, this.wikiFields, this.mediawikiOptions.wikisettings)

        this.wikiPages.push(...items)
        if (this.hasCustomFilters) {
          this.wikiPages.forEach(wp => {
            this.updateCustomFilters(wp)
          })
        }
      }
    },
    updateCustomFilters (data) {
      // build filters from options config
      this.fileFilters.forEach(filter => {
        // console.log('\n... C > DatamiExploWiki > updateCustomFilters > filter : ', filter)
        const field = filter.field

        // get only last value from new data object
        const hasData = !!data[field]
        if (hasData) {
          const dataTagsRaw = data[field]
          // console.log('... C > DatamiExploWiki > updateCustomFilters > dataTagsRaw : ', dataTagsRaw)
          let dataTags = dataTagsRaw.split(this.customFiltersConfig.tagsSeparator)
          dataTags = dataTags.map(tag => tag.trim())
          this.updateFiltersSettings({
            fileId: this.fileId,
            field: field,
            enumArr: dataTags
          })
        }
      })
      // console.log('C > DatamiExploWiki > updateCustomFilters > this.fileFilters : ', this.fileFilters)
    },
    resetDialogs () {
      // console.log('\nC > DatamiExploWiki > resetDialogs > ... ')
      this.resetFileDialog()
      if (this.currentViewMode !== 'map') {
        this.deleteUrlParam('datami_detail_id')
      }
    }
  }
}
</script>
