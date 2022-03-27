import { extractGitInfos } from '@/utils/utilsGitUrl.js'
import { $axios, getFileData, getFileDataRaw } from '@/utils/getData.js'
import { csvToObject } from '@/utils/csvUtils.js'
import { $matter } from '@/utils/mdUtils.js'

export const mixin = {
  methods: {
    extractGitInfos,
    $axios,
    getFileData,
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
    $matter
  }
}
