import { debounce } from '@/utils/globalUtils'
import { extractGitInfos } from '@/utils/utilsGitUrl.js'
import { getFileData, getFileDataRaw } from '@/utils/gitProvidersAPI.js'
// import { authorizedFileTypes } from '@/utils/fileTypesUtils.js'
import { csvToObject, ObjectToCsv } from '@/utils/csvUtils.js'
import { mdToObject, objectToMd } from '@/utils/mdUtils.js'
import { filesViewsOptions } from '@/utils/fileTypesUtils.js'

// see : https://github.com/kpdecker/jsdiff
import { createTwoFilesPatch, diffWords } from 'diff'

export const mixin = {
  computed: {
    fileTypeFamily () {
      // const FileType = this.fileTypes[this.fileType]
      // return (FileType && FileType.family) || 'other'
      return this.gitObj.filefamily
    }
  },
  methods: {
    extractGitInfos,
    // $axios,
    getFileData,
    getFileDataRaw
  }
}

export const mixinIcons = {
  methods: {
    getIcon (view) {
      return filesViewsOptions.find(i => i.code === view).icon
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
  }
}
