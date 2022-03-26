import { extractGitInfos } from '@/utils/utilsGitUrl.js'
import { $axios, getFileData } from '@/utils/getData.js'

export const mixin = {
  methods: {
    extractGitInfos,
    $axios,
    getFileData
  }
}
