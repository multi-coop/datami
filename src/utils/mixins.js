import { extractGitInfos } from '@/utils/utilsGitUrl.js'
import { $axios, convertUrl, getData } from '@/utils/getData.js'

export const mixin = {
  methods: {
    extractGitInfos,
    $axios,
    convertUrl,
    getData
  }
}
