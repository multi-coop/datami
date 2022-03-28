import axios from 'axios'

export const $axios = axios

export async function getFileData (gitInfos, headers = undefined) {
  const url = gitInfos.apiFile
  // console.log('\nU > getData > getFileData > url : ', url)
  const req = await $axios.get(url)
  // console.log('U > getFileData > getUrl > req : ', req)
  return req.data
}

export async function getFileDataRaw (gitInfos, headers = undefined) {
  const url = gitInfos.apiFileRaw
  // console.log('\nU > getFileDataRaw > getFileData > url : ', url)
  const req = await $axios.get(url)
  // console.log('U > getFileDataRaw > getUrl > req : ', req)
  return req.data
}

// TO DO
