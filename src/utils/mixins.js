import { extractGitInfos } from '@/utils/utilsGitUrl.js'
import { getFileData, getFileDataRaw } from '@/utils/gitProvidersAPI.js'
// import { authorizedFileTypes } from '@/utils/fileTypesUtils.js'
import { csvToObject } from '@/utils/csvUtils.js'
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

export const mixinDiff = {
  methods: {
    createTwoFilesPatch,
    diffWords
  }
}

export const mixinCsv = {
  methods: {
    csvToObject
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
