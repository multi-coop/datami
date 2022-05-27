import { mapGetters, mapActions } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

import {
  debounce,
  itemsPerPageChoicesTable,
  itemsPerPageChoicesCards2perRow,
  itemsPerPageChoicesCards3perRow,
  itemsPerPageChoicesCards4perRow,
  paginate,
  getClosest,
  trimText
} from '@/utils/globalUtils'
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

// see : https://github.com/kpdecker/jsdiff
import { createTwoFilesPatch, diffWords } from 'diff'

export const mixinGlobal = {
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation',
      getEditViewMode: 'git-data/getEditViewMode',
      getViewMode: 'git-data/getViewMode',
      getGitInfosObj: 'getGitInfosObj',
      getFileOptionsObj: 'getFileOptionsObj',
      fileNeedsReload: 'git-data/fileNeedsReload',
      fileNeedsSaving: 'git-data/fileNeedsSaving',
      fileNeedsDownloading: 'git-data/fileNeedsDownloading',
      fileIsCommitting: 'git-data/fileIsCommitting',
      getReqNotifications: 'git-data/getReqNotifications',
      getReqErrors: 'git-data/getReqErrors'
    }),
    gitObj () {
      return this.fileId && this.getGitInfosObj(this.fileId)
    },
    fileTypeFamily () {
      // const FileType = this.fileTypes[this.fileType]
      // return (FileType && FileType.family) || 'other'
      return this.gitObj && this.gitObj.filefamily
    },
    currentEditViewMode () {
      return this.getEditViewMode(this.fileId)
    },
    currentViewMode () {
      return this.getViewMode(this.fileId)
    },
    fileOptions () {
      return this.getFileOptionsObj(this.fileId)
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
    hasCardsDetail () {
      return this.fileOptions && !!this.fileOptions.cardsdetail
    }
  },
  methods: {
    uuidv4,
    trimText
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
      userBranch: 'git-user/getUserBranch'
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
      updateUserBranches: 'git-user/updateUserBranches',
      changeActiveUserBranch: 'git-user/changeActiveUserBranch'
    })
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
      return editViewsOptions.find(i => i.code === view).icon
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
      console.log('\nC > mixinDownload > buildFileLink > fileName : ', fileName)
      // const fileBlob = new Blob([data])
      const fileBlob = new Blob([data], {
        type: type
      })
      console.log('C > mixinDownload > buildFileLink > fileBlob : ', fileBlob)
      const dl = document.createElement('a')
      const fileUrl = window.URL.createObjectURL(fileBlob)
      console.log('C > mixinDownload > buildFileLink > fileUrl : ', fileUrl)
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
  methods: {
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
  computed: {
    cardsSettingsFromFileOptions () {
      let cardsSettings
      if (this.hasCardsView) {
        cardsSettings = {
          headers: this.columnsForView,
          settings: this.fileOptions.cardssettings
        }
      }
      return cardsSettings
    }
  },
  methods: {
    paginate,
    getClosest
  }
}

export const mixinCsv = {
  computed: {
    ...mapGetters({
      getSortingById: 'git-sortings/getSortingById',
      getFiltersById: 'git-filters/getFiltersById'
    }),
    fileSorting () {
      return this.getSortingById(this.fileId)
    },
    fileFilters () {
      return this.getFiltersById(this.fileId)
    },
    lockHeaders () {
      const options = this.fileOptions
      return !!(options && options.lockcolumns)
    }
  },
  methods: {
    ...mapActions({
      setSorting: 'git-sortings/setSortingSettings',
      setFilters: 'git-filters/setFiltersSettings',
      updateFiltersSettings: 'git-filters/updateFiltersSettings'
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
