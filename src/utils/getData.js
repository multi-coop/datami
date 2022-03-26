import axios from 'axios'
// import matter from 'gray-matter'

export const $axios = axios

export async function getFileData (gitInfos, headers = undefined) {
  const url = gitInfos.apiFile
  console.log('\n-U- getData > getFileData > url : ', url)
  const req = await $axios.get(url)
  console.log('U > getUrl > req : ', req)
  return req.data
}
