import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

import { debounce, itemsPerPageChoices, paginate, getClosest } from '@/utils/globalUtils'
import { extractGitInfos } from '@/utils/utilsGitUrl.js'
import { getFileData, getFileDataRaw } from '@/utils/gitProvidersAPI.js'
// import { authorizedFileTypes } from '@/utils/fileTypesUtils.js'
import { csvToObject, ObjectToCsv } from '@/utils/csvUtils.js'
import { mdToObject, objectToMd } from '@/utils/mdUtils.js'
import { nodeTypes, objToNodes, setEditInNode, nodeToObj } from '@/utils/jsonUtils.js'
import { editViewsOptions } from '@/utils/fileTypesUtils.js'

// see : https://github.com/kpdecker/jsdiff
import { createTwoFilesPatch, diffWords } from 'diff'

export const mixinGlobal = {
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation',
      getEditViewMode: 'git-data/getEditViewMode',
      getViewMode: 'git-data/getViewMode',
      getGitInfosObj: 'getGitInfosObj',
      fileNeedsReload: 'git-data/fileNeedsReload',
      fileNeedsSaving: 'git-data/fileNeedsSaving',
      fileIsCommitting: 'git-data/fileIsCommitting',
      getReqErrors: 'git-data/getReqErrors'
    }),
    gitObj () {
      return this.fileId && this.getGitInfosObj(this.fileId)
    },
    fileTypeFamily () {
      // const FileType = this.fileTypes[this.fileType]
      // return (FileType && FileType.family) || 'other'
      return this.gitObj.filefamily
    },
    currentEditViewMode () {
      return this.getEditViewMode(this.fileId)
    },
    currentViewMode () {
      return this.getViewMode(this.fileId)
    },
    fileIsLoading () {
      const resp = !this.gitObj || this.fileNeedsReload(this.fileId)
      return resp
    },
    fileIsSaving () {
      const resp = !this.gitObj || this.fileNeedsSaving(this.fileId)
      return resp
    },
    isCommitting () {
      return this.fileIsCommitting(this.fileId)
    },
    errors () {
      return this.getReqErrors(this.fileId)
    }
  },
  methods: {
    uuidv4
  }
}

export const mixinGit = {
  // computed: {
  //   fileTypeFamily () {
  //     // const FileType = this.fileTypes[this.fileType]
  //     // return (FileType && FileType.family) || 'other'
  //     return this.gitObj.filefamily
  //   }
  // },
  methods: {
    extractGitInfos,
    getFileData,
    getFileDataRaw
  }
}

export const mixinCommit = {
  computed: {
    ...mapGetters({
      buildNewBranchName: 'buildNewBranchName'
    })
  }
}

export const mixinIcons = {
  methods: {
    getIcon (view) {
      return editViewsOptions.find(i => i.code === view).icon
    }
  }
}

export const mixinDownload = {
  methods: {
    getFileDataRaw
  }
}

export const mixinInput = {
  methods: {
    debounce
  }
}

export const mixinDiff = {
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
        const spanClass = part.added ? 'git-ins' : part.removed ? 'git-del' : null
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
      itemsPerPageChoices: itemsPerPageChoices
    }
  },
  methods: {
    paginate,
    getClosest
  }
}

export const mixinCsv = {
  methods: {
    csvToObject,
    ObjectToCsv
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
    setEditInNode,
    nodeToObj
  }
}

export const mixinJsonNode = {
  computed: {
    getNodeTypeInfos () {
      return nodeTypes.find(n => n.code === this.nodeType)
    },
    getNodeTypeIcon () {
      const infos = this.getNodeTypeInfos
      return infos.icon
    },
    hasValue () {
      const infos = this.getNodeTypeInfos
      return infos.hasValue
    },
    getValueClass () {
      const infos = this.getNodeTypeInfos
      return infos.class
    }
  }
}
