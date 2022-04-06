import { extractGitInfos } from '@/utils/utilsGitUrl.js'
import { $axios, getFileData, getFileDataRaw } from '@/utils/getData.js'
// import { authorizedFileTypes } from '@/utils/fileTypesUtils.js'
import { csvToObject } from '@/utils/csvUtils.js'
import { $matter, mdToObject } from '@/utils/mdUtils.js'

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
    $axios,
    getFileData,
    getFileDataRaw
  }
}

export const mixinDownload = {
  methods: {
    getFileDataRaw
  }
}

export const mixinCsv = {
  methods: {
    csvToObject
  }
}

export const mixinMd = {
  methods: {
    $matter,
    mdToObject
  }
}

export const mixinJson = {
  methods: {
  }
}
