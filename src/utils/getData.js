import axios from 'axios'
// import matter from 'gray-matter'

export const $axios = axios

export async function getFileData (gitInfos, headers = undefined) {
  const url = gitInfos.apiFile
  console.log('\n-U- getData > getFileData > url : ', url)
  const req = await $axios.get(url)
  console.log('U > getFileData > getUrl > req : ', req)
  return req.data
}

export async function getFileDataRaw (gitInfos, headers = undefined) {
  const url = gitInfos.apiFileRaw
  console.log('\n-U- getFileDataRaw > getFileData > url : ', url)
  const req = await $axios.get(url)
  console.log('U > getFileDataRaw > getUrl > req : ', req)
  return req.data
}

// TO DO
