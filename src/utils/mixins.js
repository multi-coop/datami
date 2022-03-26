import { extractGitInfos } from '@/utils/utilsGitUrl.js'
import { $axios, getFileData, getFileDataRaw } from '@/utils/getData.js'

export const mixin = {
  methods: {
    extractGitInfos,
    $axios,
    getFileData,
    getFileDataRaw
  }
}
