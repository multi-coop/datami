import { mapState, mapGetters, mapActions } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

import {
  debounce,
  itemsPerPageChoicesTable,
  itemsPerPageChoicesCards2perRow,
  itemsPerPageChoicesCards3perRow,
  itemsPerPageChoicesCards4perRow,
  findFromPath,
  paginate,
  getClosest,
  defaultTagsSeparator,
  stringToColor,
  booleanFromValue,
  trimText,
  getContrastYIQ,
  range,
  roundOff,
  getNumberByField,
  groupByField,
  aggregateByField
} from '@/utils/globalUtils.js'
import {
  extractGitInfos
} from '@/utils/utilsGitUrl.js'
import {
  getFileData,
  getFileDataRaw,
  getUserInfosFromToken
} from '@/utils/gitProvidersAPI.js'
import {
  authorizedFileTypes,
  fieldTypeIcons,
  editViewsOptions
} from '@/utils/fileTypesUtils.js'
import {
  csvToObject,
  ObjectToCsv
} from '@/utils/csvUtils.js'
import {
  mdToObject,
  objectToMd
} from '@/utils/mdUtils.js'
import {
  nodeTypes,
  objToNodes,
  setEditInNode,
  nodeToObj
} from '@/utils/jsonUtils.js'
import {
  extractWikiInfos,
  getMediawikiData,
  getMediaWikiPage,
  getMediawikitItem,
  restructurePageData
} from '@/utils/utilsWikiUrl.js'
import {
  getConsolidationApiUrl
} from '@/utils/consolidationUtils.js'
import {
  createStyleLink
} from '@/utils/utilsHtml.js'

// see : https://github.com/kpdecker/jsdiff
import { createTwoFilesPatch, diffWords } from 'diff'

export const mixinTooltip = {
  computed: {
    ...mapState({
      tooltip: (state) => state.showTooltip,
      tooltipOptions: (state) => state.tooltipOptions,
      scrolled: (state) => state.scrolled
    })
  },
  methods: {
    ...mapActions({
      showTooltip: 'showTooltip',
      hideTooltip: 'hideTooltip',
      updateScrolled: 'updateScrolled'
    }),
    handleScroll (event) {
      // console.log('mixinTooltip > handleScroll > event : ', event)
      // console.log('mixinTooltip > handleScroll > document.body : ', document.body)
      // const scrollTop = document.body.scrollTop
      const scrollTop = window.scrollY
      // const windowHeight = window.innerHeight
      // this.scrolled = { top: scrollTop }
      this.hideGlobalTooltip()
      this.updateScrolled({ top: scrollTop })
      // console.log('mixinTooltip > handleScroll > this.scrolled : ', this.scrolled)
    },
    showGlobalTooltip (event, tooltipOptions) {
      // console.log(`\nmixinTooltip > showGlobalTooltip > ${this.$options.name} > event : `, event)
      // console.log(`mixinTooltip > showGlobalTooltip > ${this.$options.name} > tooltipOptions : `, tooltipOptions)
      // console.log(`mixinTooltip > showGlobalTooltip > ${this.$options.name} > this.$el : `, this.$el)
      const boundingRect = this.$el.getBoundingClientRect()
      // console.log(`mixinTooltip > showGlobalTooltip > ${this.$options.name} > boundingRect : `, boundingRect)
      this.showTooltip({
        component: this.$options.name,
        ...tooltipOptions,
        cursor: event,
        rect: boundingRect
      })
    },
    hideGlobalTooltip () {
      // console.log(`\nmixinTooltip > hideGlobalTooltip > ${this.$options.name} > ...`)
      this.hideTooltip()
    }
  }
}

export const mixinGlobal = {
  mounted () {
    if (!this.fromMultiFiles && this.datamiRoot) {
      window.addEventListener('scroll', this.handleScroll)
    }
    this.addStyles(this.cssFiles)
  },
  destroyed () {
    if (!this.fromMultiFiles && this.datamiRoot) {
      window.removeEventListener('scroll', this.handleScroll)
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation',
      getEditViewMode: 'git-data/getEditViewMode',
      getViewMode: 'git-data/getViewMode',
      getGitInfosObj: 'getGitInfosObj',
      getTrackAllOutlinks: 'getTrackAllOutlinks',
      getEditNavbar: 'getFileEditNavbarStatus',
      getFileToken: 'git-data/getFileToken',
      getFileOptionsObj: 'getFileOptionsObj',
      fileNeedsReload: 'git-data/fileNeedsReload',
      fileNeedsSaving: 'git-data/fileNeedsSaving',
      fileNeedsDownloading: 'git-data/fileNeedsDownloading',
      fileIsCommitting: 'git-data/fileIsCommitting',
      getReqNotifications: 'git-data/getReqNotifications',
      getReqErrors: 'git-data/getReqErrors',
      getUserFullscreen: 'git-user/getUserFullscreen',
      isDarkMode: 'git-storage/isDarkMode',
      getDialogsById: 'git-dialogs/getDialogsById',
      getSignalsByFileId: 'git-signals/getSignalsByFileId'
    }),
    getUrlBase () {
      const widgetProvider = process.env.VUE_APP_DATAMI_DEPLOY_DOMAIN || 'datami-widget.multi.coop'
      const isLocal = widgetProvider.startsWith('localhost')
      const Http = isLocal ? 'http' : 'https'
      const urlBase = `${Http}://${widgetProvider}`
      return urlBase
    },
    fileToken () {
      return this.getFileToken(this.fileId)
    },
    gitObj () {
      return this.fileId && this.getGitInfosObj(this.fileId)
    },
    hasTrackAllOutlinks () {
      return this.getTrackAllOutlinks(this.fileId)
    },
    fileTypeFamily () {
      // const FileType = this.fileTypes[this.fileType]
      // return (FileType && FileType.family) || 'other'
      return this.gitObj && this.gitObj.filefamily
    },
    isFileTypeTable () {
      return this.fileTypeFamily && this.fileTypeFamily === 'table'
    },
    currentEditViewMode () {
      return this.getEditViewMode(this.fileId) || 'preview'
    },
    currentViewMode () {
      return this.getViewMode(this.fileId)
    },
    fileOptions () {
      return this.getFileOptionsObj(this.fileId)
    },
    fileSchema () {
      return (this.fileOptions && this.fileOptions.schema) || {}
    },
    hasFileSchemaFile () {
      return this.fileSchema && this.fileSchema.file
    },
    fileCustomProps () {
      return (this.fileOptions && this.fileOptions.customProps) || {}
    },
    fileIsLoading () {
      const resp = !this.gitObj || this.fileNeedsReload(this.fileId)
      return resp
    },
    fileIsSaving () {
      const resp = !this.gitObj || this.fileNeedsSaving(this.fileId)
      return resp
    },
    fileIsDownloading () {
      return this.fileNeedsDownloading(this.fileId)
    },
    isCommitting () {
      return this.fileIsCommitting(this.fileId)
    },
    notifications () {
      return this.getReqNotifications(this.fileId)
    },
    errors () {
      return this.getReqErrors(this.fileId)
    },
    showEditNavbar () {
      return this.getEditNavbar(this.fileId)
    },

    // SORTING SETTINGS
    hasCustomSorting () {
      return this.fileOptions && !!this.fileOptions.customsorting && this.fileOptions.customsorting.activate
    },
    customSortingConfig () {
      let config = []
      if (this.hasCustomSorting) {
        config = this.fileOptions.customsorting
      }
      return config
    },

    // FILTERS SETTINGS
    hasCustomFilters () {
      return this.fileOptions && !!this.fileOptions.customfilters && this.fileOptions.customfilters.activate
    },
    customFiltersConfig () {
      let config = []
      if (this.hasCustomFilters) {
        config = this.fileOptions.customfilters
        config.tagsSeparator = this.fileOptions.tagseparator
      }
      return config
    },

    // CARDS SETTINGS
    hasCardsView () {
      return this.fileOptions && !!this.fileOptions.cardsview
    },
    cardsViewOptions () {
      return this.hasCardsView && this.fileOptions.cardsview
    },
    cardsViewIsDefault () {
      return this.cardsViewOptions && this.cardsViewOptions.default
    },
    cardsViewIsActive () {
      return this.cardsViewOptions && this.cardsViewOptions.activate
    },
    hasCardsDetail () {
      return this.fileOptions && !!this.fileOptions.cardsdetail
    },
    cardsSettingsFromOptions () {
      return this.fileOptions.cardssettings
    },
    cardsSettingsTemplates () {
      return this.cardsSettingsFromOptions && this.cardsSettingsFromOptions.templates
    },
    cardsSettingsMiniMap () {
      const settings = this.cardsSettingsFromOptions && this.cardsSettingsFromOptions.minimap
      if (settings && !settings.position) { settings.position = 'map_bottom' }
      return settings
    },
    cardHasMiniMap () {
      return this.cardsSettingsMiniMap && this.cardsSettingsMiniMap.activate
    },

    // DATAVIZ SETTINGS
    hasDatavizView () {
      return this.fileOptions && !!this.fileOptions.datavizview
    },
    datavizViewOptions () {
      return this.hasDatavizView && this.fileOptions.datavizview
    },
    datavizViewIsDefault () {
      return this.datavizViewOptions && this.datavizViewOptions.default
    },
    datavizViewIsActive () {
      return this.datavizViewOptions && this.datavizViewOptions.activate
    },

    // MAP SETTINGS
    hasMapView () {
      return this.fileOptions && !!this.fileOptions.mapview
    },
    mapViewOptions () {
      return this.hasMapView && this.fileOptions.mapview
    },
    mapViewIsDefault () {
      return this.mapViewOptions && this.mapViewOptions.default
    },
    mapViewIsActive () {
      return this.mapViewOptions && this.mapViewOptions.activate
    },

    // MARKDOWN SETTINGS
    hasTxtView () {
      return this.gitObj && this.gitObj.filetype === 'txt'
    },
    hasMdView () {
      return this.gitObj && this.gitObj.filetype === 'md'
    },

    // JSON SETTINGS
    hasJsonView () {
      return this.fileTypeFamily === 'json'
    },

    // DATA CONNSOLIDATION
    hasConsolidation () {
      return this.fileOptions && this.fileOptions.customProps && this.fileOptions.customProps.consolidation
    },

    // UX
    userFullscreen () {
      return this.getUserFullscreen(this.fileId)
    },
    multifilesDialogs () {
      return this.getDialogsById(this.multiFilesId)
    },
    fileDialogs () {
      return this.getDialogsById(this.fileId)
    },
    hasFileDialogs () {
      return this.fileDialogs.length
    },
    hasMultifilesDialogs () {
      return this.multifilesDialogs.length
    },

    // SIGNALS
    fileSignals () {
      return this.getSignalsByFileId(this.fileId)
    }
  },
  methods: {
    uuidv4,
    findFromPath,
    ...mapActions({
      updateDialogs: 'git-dialogs/updateFileDialog',
      removeFileDialog: 'git-dialogs/removeFileDialog',
      removeFileDialogByComponent: 'git-dialogs/removeFromDialogsByComponent',
      addSignal: 'git-signals/addSignal',
      removeSignal: 'git-signals/removeSignal'
    }),
    getAncestorNodeById (id) {
      // console.log(`\nmixinGlobal > getAncestorNodeById > ${this.$options.name} > id : `, id)
      let parent = this.$parent
      while (parent && parent.$el.id !== id) {
        parent = parent.$parent
      }
      // console.log(`mixinGlobal > getAncestorNodeById > ${this.$options.name} > parent : `, parent)
      return parent
    },
    getRootNode () {
      const shadowRoot = this.$el.parentNode
      // console.log(`mixinGlobal > getRootNode > ${this.$options.name} > shadowRoot : `, shadowRoot)
      return shadowRoot
    },
    addStyles (urls) {
      if (urls && urls.length) {
        const shadowRoot = this.getRootNode()
        // const componentName = this.$options.name
        // console.log(`\nM > mixinGlobal > addStyle > ${componentName} > shadowRoot : `, shadowRoot)
        // console.log(`M > mixinGlobal > addStyle > ${componentName} > url : `, url)
        // console.log(`M > mixinGlobal > addStyle > ${componentName} > process.env : `, process.env)

        const urlBase = this.getUrlBase

        urls.forEach(url => {
          const isFont = url.startsWith('fonts/') && !url.endsWith('.css')
          let fileUrl
          if (url.startsWith('http')) {
            fileUrl = url
          } else {
            fileUrl = `${urlBase}/${url}`
          }
          // const fileUrl = `${process.env.BASE_URL}${url}`
          // console.log(`M > mixinGlobal > addStyle > ${componentName} > fileUrl : `, fileUrl)
          createStyleLink(shadowRoot, fileUrl, isFont)
        })
      }
    },
    updateFileDialogs (component, event, show = true) {
      // console.log('\nM > mixinGlobal > updateFileDialogs > component : ', component)
      // console.log('M > mixinGlobal > updateFileDialogs > show : ', show)
      // console.log('M > mixinGlobal > updateFileDialogs > event : ', event)
      // console.log('M > mixinGlobal > updateFileDialogs > this.fileId : ', this.fileId)
      this.updateDialogs({ fileId: this.fileId, component: component, show: show, event: event })
    },
    resetFileDialog () {
      // console.log('\nM > mixinGlobal > resetFileDialogs > this.fileId : ', this.fileId)
      this.updateDialogs({ fileId: this.fileId, reset: true })
    },
    resetMultiFilesDialog () {
      // console.log('\nM > mixinGlobal > resetMultiFilesDialog > this.fileId : ', this.fileId)
      this.updateDialogs({ fileId: this.multiFilesId, reset: true })
    },
    addFileSignal (action, event) {
      // console.log('\nM > mixinGlobal > addFileSignal > component : ', component)
      // console.log('M > mixinGlobal > addFileSignal > event : ', event)
      // console.log('M > mixinGlobal > addFileSignal > this.fileId : ', this.fileId)
      const signalId = uuidv4()
      this.addSignal({ fileId: this.fileId, signalId: signalId, action: action, event: event })
    },
    removeFileSignal (signalId) {
      this.removeSignal({ signalId: signalId })
    },
    trimField (field) {
      return {
        field: field.field,
        name: field.name,
        type: field.type,
        subtype: field.subtype,
        bgColor: field.bgColor,
        round: field.round,
        transform: field.transform,
        enumArr: field.enumArr,
        definitions: field.definitions,
        tagSeparator: field.tagSeparator,
        maxLength: field.maxLength,
        longtextOptions: field.longtextOptions,
        stepOptions: field.stepOptions
      }
    },
    trackEvent (value, action = undefined, category = undefined) {
      const matomoServer = process.env.VUE_APP_DATAMI_MATOMO
      const matomoSiteId = process.env.VUE_APP_DATAMI_MATOMO_SITE_ID

      if (matomoServer && matomoSiteId) {
        const domain = document.domain
        // console.log('\nM > trackEvent > domain :', domain)

        const evAction = action || this.$options.name
        // console.log('M > trackEvent > evAction : ', evAction)

        const eventCategory = category || (this.gitObj && this.gitObj.filefullname)
        // console.log('M > trackEvent > eventCategory :', eventCategory)

        // console.log('M > trackEvent > value : ', value)

        const _paq = window._paq
        // console.log('M > trackEvent > _paq : ', _paq)
        if (_paq) {
          _paq.push(['trackEvent', eventCategory, evAction, value])
          _paq.push(['trackEvent', domain, eventCategory, evAction])
        }
      }
    },
    trackLink (link) {
      // only tracks datami outlinks if 'hasTrackAllOutlinks' is false
      if (!this.hasTrackAllOutlinks) {
        // console.log('\nM > trackLink > link :', link)
        const _paq = window._paq
        if (_paq) {
          _paq.push(['trackLink', link, 'link'])
        }
      }
    }
  }
}

export const mixinForeignKeys = {
  computed: {
    ...mapState({
      shareableFiles: (state) => state['git-data'].shareableFiles,
      sharedData: (state) => state['git-data'].sharedData,
      loadingShared: (state) => state['git-data'].loadingShared,
      loadingExtRessources: (state) => state['git-data'].loadingExtRessources
    }),
    ...mapGetters({
      shareableAreSet: 'git-data/areAllShareableSet',
      isInShareableAndSet: 'git-data/isInShareableAndSet',
      isInShareableAndLoaded: 'git-data/isInShareableAndLoaded',
      getSharedDatasetByRessource: 'git-data/getSharedDatasetByRessource',
      getSharedDatasetByGitfile: 'git-data/getSharedDatasetByGitfile',
      readyToCopyRessources: 'git-data/readyToCopyRessources',
      readyToLoadExtRessources: 'git-data/readyToLoadExtRessources',
      getLoadedSharedData: 'git-data/getLoadedSharedData',
      getLoadedSharedDataItem: 'git-data/getLoadedSharedDataItem'
    }),
    sharedDataIsLoaded () {
      const loadedDatasets = this.getSharedDatasetByGitfile(this.gitObj.id).map(sd => sd.isLoaded)
      return loadedDatasets.every(b => !!b)
    },
    ressourceInfos () {
      const foreignKey = this.field.foreignKey
      const resrc = foreignKey && foreignKey.ressource
      const resrcFilename = resrc && resrc.split('/').at(-1)
      return {
        url: resrc,
        filename: resrcFilename
      }
    }
  },
  methods: {
    ...mapActions({
      updateShareableFiles: 'git-data/updateShareableFiles',
      updateSharedData: 'git-data/updateSharedData',
      updateLoadingRessources: 'git-data/updateLoadingRessources',
      updateLoadedSharedData: 'git-data/updateLoadedSharedData'
    }),
    loadedSharedData (gitfile) {
      return this.getLoadedSharedData(gitfile)
    },
    getForeignItemRaw (field, value) {
      const foreignKey = field.foreignKey
      const ressource = foreignKey.ressource
      const fields = foreignKey.fields
      const itemRaw = this.getLoadedSharedDataItem(ressource, fields, value)
      return itemRaw
    },
    getForeignItem (field, value) {
      // console.log('M > mixinForeignKeys > getForeignItem > field.foreignKey : ', field.foreignKey)
      const returnFields = field.foreignKey.returnFields
      const itemRaw = this.getForeignItemRaw(field, value)
      // console.log('M > mixinForeignKeys > getForeignItem > itemRaw : ', itemRaw)
      const headers = itemRaw && itemRaw.headers && itemRaw.headers.filter(h => returnFields.includes(h.name))
      const item = {}
      headers && itemRaw.item && headers.forEach(h => {
        item[h.name] = itemRaw.item[h.field]
      })
      return item
    },
    debugShared (shared) {
      const data = shared && shared.data && {
        header: [...shared.data.headers.slice(0, 1), '...'],
        data: [...shared.data.data.slice(0, 1), '...']
      }
      const copy = {
        ...shared && shared,
        ...data && { data: data }
      }
      return copy
    }
  }
}

export const mixinData = {
  computed: {
    ...mapGetters({
      getFileDataFromStore: 'git-data/getFileDataFromStore'
    }),
    fileData () {
      return this.fileId && this.getFileDataFromStore(this.fileId, 'data')
    },
    fileDataFields () {
      return this.fileId && this.getFileDataFromStore(this.fileId, 'dataFields')
    },
    fileEdited () {
      return this.fileId && this.getFileDataFromStore(this.fileId, 'edited')
    },
    fileEditedFields () {
      return this.fileId && this.getFileDataFromStore(this.fileId, 'editedFields')
    }
  },
  methods: {
    ...mapActions({
      updateDataOrEdited: 'git-data/updateDataOrEdited'
    })
  }
}

export const mixinGit = {
  computed: {
    ...mapGetters({
      getUserGit: 'git-user/getUserGit',
      getUserBranches: 'git-user/getUserBranches',
      getRefBranch: 'git-user/getRefBranch',
      getUserBranchesNotRef: 'git-user/getUserBranchesNotRef',
      getUserActiveBranch: 'git-user/getUserActiveBranch',
      userBranch: 'git-user/getUserBranch',
      checkIfErrorExists: 'git-data/checkIfErrorExists'
    }),
    userGit () {
      return this.getUserGit(this.fileId)
    },
    userBranches () {
      return this.getUserBranches(this.fileId)
    },
    refBranch () {
      return this.getRefBranch(this.fileId)
    },
    notRefBranches () {
      return this.getUserBranchesNotRef(this.fileId)
    },
    userActiveBranch () {
      return this.getUserActiveBranch(this.fileId)
    }
  },
  methods: {
    extractGitInfos,
    getFileData,
    getFileDataRaw,
    getUserInfosFromToken,
    ...mapActions({
      resetReqErrors: 'git-data/resetReqErrors',
      updateReqErrors: 'git-data/updateReqErrors',
      updateUserBranches: 'git-user/updateUserBranches',
      changeActiveUserBranch: 'git-user/changeActiveUserBranch'
    }),
    async getFileDataAndErrors (gitObj, token, raw = false) {
      // this.updateReloading({ fileId: this.fileId, isLoading: true })
      // console.log('\nM > MixinGit > getFileDataAndErrors > gitObj.filefullname : ', gitObj.filefullname)

      // fetch data
      let resp
      if (raw) {
        resp = await this.getFileDataRaw(gitObj, token)
      } else {
        resp = await this.getFileData(gitObj, token)
      }
      // console.log('\nM > MixinGit > getFileDataAndErrors > resp : ', resp)

      // process errors if any
      const errors = resp.errors
      if (errors.length) {
        const reqErrors = errors.map(err => { return { ...err, fileId: this.fileId, errorId: this.uuidv4() } })
        // console.log('M > MixinGit > getFileDataAndErrors > reqErrors : ', reqErrors)
        reqErrors.forEach(err => {
          if (!this.checkIfErrorExists(err)) {
            this.updateReqErrors({ error: err, addToErrors: true })
            this.updateFileDialogs('NotificationErrors', { error: err })
          }
        })
      }

      // this.updateReloading({ fileId: this.fileId, isLoading: false })
      return resp
    }
  }
}

export const mixinCommit = {
  computed: {
    ...mapGetters({
      getUserGit: 'git-user/getUserGit',
      buildNewBranchName: 'buildNewBranchName',
      getUserBranches: 'git-user/getUserBranches'
    }),
    userGit () {
      return this.getUserGit(this.fileId)
    },
    userBranches () {
      return this.getUserBranches(this.fileId)
    }
  },
  methods: {
    ...mapActions({
      updateUserBranches: 'git-user/updateUserBranches'
    })
  }
}

export const mixinIcons = {
  methods: {
    getIcon (view) {
      // console.log('\nC > mixinDownload > getIcon > view : ', view)
      // console.log('C > mixinDownload > getIcon > editViewsOptions : ', editViewsOptions)
      if (view) {
        return editViewsOptions.find(i => i.code === view).icon
      } else {
        return 'sync'
      }
    },
    getIconFieldType (field) {
      // console.log('\nC > mixinDownload > getIconFieldType > field.label : ', field.label)
      // console.log('C > mixinDownload > getIconFieldType > field : ', field)
      const icons = fieldTypeIcons.filter(f => f.type === field.type)
      // console.log('C > mixinDownload > getIconFieldType > icons (1) : ', icons)
      const icon = icons.find(f => f.subtype === field.subtype) || icons[0]
      // console.log('C > mixinDownload > getIconFieldType > icon (2) : ', icon)
      const iconDefault = fieldTypeIcons.find(f => f.default)
      const result = icon || iconDefault
      return result.icon
    }
  }
}

export const mixinDownload = {
  methods: {
    getFileDataRaw,
    ...mapActions({
      updateDownloading: 'git-data/updateDownloading'
    }),
    buildFileLink (data, window) {
      const filetype = authorizedFileTypes[this.gitObj.filetype].type
      const type = `${filetype};charset=utf-8`
      const fileName = this.gitObj.filetype === 'wiki' ? `${this.gitObj.filefullname.replaceAll('.', '-').replaceAll(' => ', '---')}.tsv` : this.gitObj.filefullname
      // console.log('\nC > mixinDownload > buildFileLink > fileName : ', fileName)
      // const fileBlob = new Blob([data])
      const fileBlob = new Blob([data], {
        type: type
      })
      // console.log('C > mixinDownload > buildFileLink > fileBlob : ', fileBlob)
      const dl = document.createElement('a')
      const fileUrl = window.URL.createObjectURL(fileBlob)
      // console.log('C > mixinDownload > buildFileLink > fileUrl : ', fileUrl)
      dl.href = fileUrl
      dl.download = fileName
      dl.display = 'none'
      dl.visibility = 'hidden'
      dl.title = `Download file - ${fileName}`
      dl.target = '_self'
      // dl.rel = 'noopener'
      // dl.setAttribute('title', `Download file - ${fileName}`)
      // dl.setAttribute('download', fileName)
      // dl.setAttribute('target', '_self')
      // dl.setAttribute('rel', 'noopener')
      // dl.setAttribute('download', fileName)
      // dl.setAttribute('visibility', 'hidden')
      // dl.setAttribute('display', 'none')
      // console.log('C > mixinDownload > buildFileLink > dl : ', dl)
      document.body.appendChild(dl)
      dl.click()
      return dl
    },
    removeLink (link) {
      setTimeout(() => {
        URL.revokeObjectURL(link.href)
        // document.body.removeChild(link)
        link.parentNode.removeChild(link)
      }, 100)
    }
  }
}

export const mixinValue = {
  data () {
    return {
      numberTypes: ['number', 'integer', 'float'],
      tagTypes: ['tag', 'tags'],
      defaultTagsSeparator: defaultTagsSeparator
    }
  },
  computed: {
    fieldType () {
      return (this.field && this.field.type) || 'string'
    },
    fieldSubtype () {
      return this.field && this.field.subtype
    },
    isString () {
      return this.fieldType === 'string'
    },
    isBoolean () {
      return this.fieldType === 'boolean'
    },
    isLink () {
      return this.fieldSubtype === 'link'
    },
    isEmail () {
      return this.fieldSubtype === 'email'
    },
    isImage () {
      return this.fieldSubtype === 'image'
    },
    isNumber () {
      return this.numberTypes.includes(this.fieldType)
    },
    isInteger () {
      return this.fieldType === 'integer'
    },
    isPercent () {
      return this.fieldSubtype === 'percent'
    },
    isLongText () {
      return this.fieldSubtype === 'longtext'
    },
    isTimelineText () {
      return this.fieldSubtype === 'timelinetext'
    },
    isTag () {
      return this.field && this.tagTypes.includes(this.field.subtype)
    },
    isCategory () {
      return this.fieldSubtype === 'tag'
    },
    booleanOptions () {
      const boolOptions = this.field.booleanOptions
      return {
        false: {
          label: (boolOptions && boolOptions.false.label) || false,
          value: (boolOptions && boolOptions.false.value) || false
        },
        true: {
          label: (boolOptions && boolOptions.true.label) || true,
          value: (boolOptions && boolOptions.true.value) || true
        }
      }
    },
    tagsEnum () {
      return (this.field && this.field.enumArr) || []
    },
    tagsDefinitions () {
      return (this.field && this.field.definitions) || []
    },
    tagsEnumEnriched () {
      const enumArr = this.tagsEnum
      const definitions = this.tagsDefinitions
      const enumEnriched = enumArr.map(opt => {
        const def = definitions.find(d => d.value === opt)
        const optEnriched = {
          value: opt,
          definition: def
        }
        return optEnriched
      })
      return enumEnriched
    },
    tagSeparator () {
      return this.field.tagSeparator || this.defaultTagsSeparator
    },
    isPrimaryKey () {
      return this.field.primaryKey
    },
    fieldForeignKey () {
      return this.field.foreignKey
    },
    isForeignKey () {
      return this.fieldForeignKey && this.fieldForeignKey.activate
    },
    isDatamiField () {
      return this.fieldType === 'datami'
    },
    isOpenCardField () {
      return this.isDatamiField && this.fieldSubtype === 'openDatamiCard'
    },
    isConsolidation () {
      return this.isDatamiField && this.fieldSubtype === 'consolidation'
    }
  },
  methods: {
    booleanFromValue,
    trimText,
    roundOff,
    getNumberByField,
    getValueDefinition (value, field = undefined) {
      const Field = field || this.field
      const definitions = Field.definitions
      const definition = definitions && definitions.find(def => def.value === value)
      return definition
    },
    getValueDefinitionLabel (value, field = undefined) {
      const Field = field || this.field
      const definition = this.getValueDefinition(value, Field)
      const label = definition && definition.label
      return label
    },
    getValueDefinitionDescription (value, field = undefined) {
      const definition = this.getValueDefinition(value, field)
      const description = definition && definition.description
      return description
    },
    tagBackgroundColor (value, bgColor = undefined, isDiff = false) {
      let color
      if (!isDiff) {
        color = bgColor ?? stringToColor(value)
      } else {
        color = '#363636'
      }
      return color
    },

    tagColor (value, bgColor = undefined, isDiff = false) {
      let textColor
      if (isDiff) {
        textColor = 'white'
      } else {
        const hex = this.tagBackgroundColor(value, bgColor)
        textColor = getContrastYIQ(hex)
      }
      return textColor
    }
  }
}

export const mixinInput = {
  methods: {
    debounce
  }
}

export const mixinDiff = {
  data () {
    return {
      insFragClass: 'git-ins',
      delFragClass: 'git-del'
    }
  },
  computed: {
    ...mapGetters({
      getChangesFields: 'git-data/getChangesFields',
      getChangesData: 'git-data/getChangesData'
    }),

    fieldsChanges () {
      return this.getChangesFields(this.fileId)
    },
    dataChanges () {
      return this.getChangesData(this.fileId)
    }
  },
  methods: {
    ...mapActions({
      updateFileChanges: 'git-data/updateFileChanges'
    }),
    createTwoFilesPatch,
    diffWords,
    diffHtmlChars (diff) {
      // console.log('C > mixins > diffHtmlChars  > diff : \n', diff)
      let diffText = ''
      diff.forEach((part) => {
        // green for additions, red for deletions
        // grey for common parts
        let fragment
        const spanClass = part.added ? this.insFragClass : part.removed ? this.delFragClass : null
        if (spanClass) {
          fragment = `<span class="${spanClass}">${part.value}</span>`
        } else {
          fragment = part.value
        }
        diffText += fragment
      })
      // console.log('C > mixins > diffHtmlChars  > diffText : \n', diffText)
      return diffText
    },
    getCharDiff (content, edited) {
      const diffStr = this.diffWords(content, edited || '')
      return diffStr
    },
    getDiffHtmlChars (isHeader, wasAdded, field, val, rowId) {
      // console.log('\nM > mixinDiff > getDiffHtmlChars > isHeader : ', isHeader)
      // console.log('M > mixinDiff > getDiffHtmlChars > wasAdded : ', wasAdded)
      // console.log('M > mixinDiff > getDiffHtmlChars > field : ', field)
      // console.log('M > mixinDiff > getDiffHtmlChars > rowId : ', rowId)
      // console.log('M > mixinDiff > getDiffHtmlChars > val : ', val)
      let oldVal, newVal
      const changes = this.isInChanges(isHeader, wasAdded, field, rowId)
      // console.log('M > mixinDiff > getDiffHtmlChars > changes : ', changes)
      const wasDeleted = changes.action === 'deleted'
      // console.log('M > mixinDiff > getDiffHtmlChars > wasDeleted : ', wasDeleted)
      if (wasAdded && !wasDeleted) {
        oldVal = ''
        newVal = val || ''
      } else if (!wasAdded && wasDeleted) {
        oldVal = val || ''
        newVal = ''
      } else {
        oldVal = changes.oldVal
        newVal = changes.val
      }
      // console.log('C > mixinValue > getDiffHtmlChars > valDef : ', valDef)

      const charDiff = this.getCharDiff(oldVal, newVal)
      const diffText = this.diffHtmlChars(charDiff)
      return diffText
    },
    isInChanges (isHeader, wasAdded, field, rowId) {
      // const isFirstRow = rowId === '0'
      // isFirstRow && console.log('\nM > mixinDiff > isInChanges > isHeader : ', isHeader)
      // isFirstRow && console.log('M > mixinDiff > isInChanges > wasAdded : ', wasAdded)
      // isFirstRow && console.log('M > mixinDiff > isInChanges > field : ', field)
      // isFirstRow && console.log('M > mixinDiff > isInChanges > rowId : ', rowId)
      let bool, boolDeleted
      if (isHeader) {
        bool = this.fieldsChanges.find(h => h.field === field)
      } else {
        // isFirstRow && console.log('M > mixinDiff > isInChanges > this.dataChanges : ', this.dataChanges)
        bool = this.dataChanges.find(r => r.field === field && r.id === rowId)
        boolDeleted = this.dataChanges.find(r => r.id === rowId && r.action === 'deleted')
        if (boolDeleted) bool = boolDeleted
      }
      if (wasAdded) bool = true
      // isFirstRow && console.log('M > mixinDiff > isInChanges > bool : ', bool)
      return bool
    }
  }
}

export const mixinPagination = {
  data () {
    return {
      itemsPerPageChoicesTable: itemsPerPageChoicesTable,
      itemsPerPageChoicesCards2perRow: itemsPerPageChoicesCards2perRow,
      itemsPerPageChoicesCards3perRow: itemsPerPageChoicesCards3perRow,
      itemsPerPageChoicesCards4perRow: itemsPerPageChoicesCards4perRow
    }
  },
  methods: {
    paginate,
    getClosest
  }
}

export const mixinCards = {
  computed: {
    cardsSettingsFromFileOptions () {
      let cardsSettings
      // console.log('\nM > mixinsCsv > cardsSettingsFromFileOptions > this.hasCardsView : ', this.hasCardsView)
      if (this.hasCardsView && this.cardsViewIsActive) {
        const settings = this.cardsSettingsFromOptions
        // console.log('M > mixinsCsv > cardsSettingsFromFileOptions > settings : ', settings)
        const miniSettings = settings.mini
        const detailSettings = settings.detail
        const mapping = this.columns.map(h => {
          const fieldMap = {
            ...h,
            mini: miniSettings[h.name],
            detail: detailSettings[h.name]
          }
          const hasTemplate = this.cardsSettingsTemplates && this.cardsSettingsTemplates[h.name]
          if (hasTemplate) { fieldMap.templating = hasTemplate }
          return fieldMap
        })
        cardsSettings = {
          originalHeaders: this.columns,
          editedHeaders: this.columnsForView,
          settings: { mini: miniSettings, detail: detailSettings },
          mapping: mapping
        }
      }
      // console.log('M > mixinsCsv > cardsSettingsFromFileOptions > cardsSettings : ', cardsSettings)
      return cardsSettings
    }
    // mappingForAll () {
    //   return this.cardsSettingsFromFileOptions.mapping.map(h => {
    //     return {
    //       field: h.field,
    //       name: h.name,
    //       type: h.type,
    //       subtype: h.subtype,
    //       enumArr: h.enumArr,
    //       definitions: h.definitions,
    //       tagSeparator: h.tagSeparator
    //     }
    //   })
    // },
    // mappingsForMini () {
    //   return this.cardsSettingsFromFileOptions.mapping.map(h => {
    //     const fieldMap = {
    //       field: h.field,
    //       name: h.name,
    //       type: h.type,
    //       subtype: h.subtype,
    //       enumArr: h.enumArr,
    //       definitions: h.definitions,
    //       tagSeparator: h.tagSeparator,
    //       ...h.mini
    //     }
    //     const hasTemplate = h.templating && h.templating.use_on_mini
    //     if (hasTemplate) { fieldMap.templating = h.templating.paragraphs }
    //     return fieldMap
    //   })
    // },
    // mappingsForDetail () {
    //   return this.cardsSettingsFromFileOptions.mapping.map(h => {
    //     const fieldMap = {
    //       field: h.field,
    //       name: h.name,
    //       type: h.type,
    //       subtype: h.subtype,
    //       enumArr: h.enumArr,
    //       definitions: h.definitions,
    //       tagSeparator: h.tagSeparator,
    //       ...h.detail
    //     }
    //     const hasTemplate = h.templating && h.templating.use_on_detail
    //     if (hasTemplate) { fieldMap.templating = h.templating.paragraphs }
    //     return fieldMap
    //   })
    // }
  }
}

export const mixinCsv = {
  computed: {
    ...mapGetters({
      getSortingById: 'git-sortings/getSortingById',
      getFiltersById: 'git-filters/getFiltersById',
      getActiveFilterTagsById: 'git-filters/getActiveFilterTagsById'
    }),
    fileSorting () {
      return this.getSortingById(this.fileId)
    },
    fileFilters () {
      return this.getFiltersById(this.fileId)
    },
    activeFilterTags () {
      return this.getActiveFilterTagsById(this.fileId)
    },
    lockHeaders () {
      const options = this.fileOptions
      return !!(options && options.lockcolumns)
    }
  },
  methods: {
    ...mapActions({
      setSorting: 'git-sortings/setSortingSettings',
      setSortings: 'git-sortings/setSortingsSettings',
      setFilters: 'git-filters/setFiltersSettings',
      updateFiltersSettings: 'git-filters/updateFiltersSettings',
      updateFilterTags: 'git-filters/updateFilterTags'
    }),
    csvToObject,
    ObjectToCsv
  }
}

export const mixinWiki = {
  methods: {
    extractWikiInfos,
    getMediawikiData,
    getMediaWikiPage,
    getMediawikitItem,
    restructurePageData
  }
}

export const mixinMd = {
  methods: {
    // $matter,
    mdToObject,
    objectToMd
  }
}

export const mixinJson = {
  methods: {
    objToNodes,
    // mergeJsons,
    setEditInNode
  }
}

export const mixinNodeToJson = {
  methods: {
    nodeToObj
  }
}

export const mixinJsonNode = {
  data () {
    return {
      nodeTypes: nodeTypes
    }
  },
  computed: {
    getNodeTypeInfos () {
      return this.nodeTypes.find(n => n.code === this.nodeType)
    },
    getNodeTypeIcon () {
      const infos = this.getNodeTypeInfos
      return infos && infos.icon
    },
    hasValue () {
      const infos = this.getNodeTypeInfos
      return infos && infos.hasValue
    },
    getValueClass () {
      const infos = this.getNodeTypeInfos
      return infos && infos.class
    }
  },
  methods: {
    getNodeTypeInfosByType (nodeType) {
      const infos = nodeTypes.find(n => n.code === nodeType)
      return infos
    },
    getNodeTypeIconByType (nodeType) {
      const infos = this.getNodeTypeInfosByType(nodeType)
      return infos && infos.icon
    }
  }
}

export const mixinConsolidation = {
  methods: {
    getConsolidationApiUrl
  }
}

export const mixinDataviz = {
  methods: {
    groupByField,
    aggregateByField
  }
}

export const mixinMap = {
  methods: {
    range
  }
}
