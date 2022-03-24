import axios from 'axios'
// import matter from 'gray-matter'

export const $axios = axios

export const convertFileUrl = (gitInfos) => {
  const url = `${gitInfos.gitRawRoot}${gitInfos.remainingString}`
  console.log('U > convertUrl > url : ', url)
  return url
}

export async function getData (gitInfos, headers = undefined) {
  const url = convertFileUrl(gitInfos)
  console.log('U > getUrl > url : ', url)
  const req = await $axios.get(url)
  console.log('U > getUrl > req : ', req)
}
