import axios from 'axios'

export const $axios = axios

export async function getFileData (gitInfos, headers = undefined) {
  const url = gitInfos.apiFile
  // console.log('\nU > getData > getFileData > url : ', url)

  // test with axios
  // const req = await $axios.get(url)
  // return req.data

  // test with pure fetch
  const req = await fetch(url)
  // console.log('U > getFileData > getUrl > req : ', req)
  const data = await req.json()
  // console.log('U > getFileData > getUrl > data : ', data)
  return data
}

export async function getFileDataRaw (gitInfos, headers = undefined) {
  const url = gitInfos.apiFileRaw
  // console.log('\nU > getFileDataRaw > getFileData > url : ', url)
  // test with axios
  // const req = await $axios.get(url)
  // return req.data

  // test with pure fetch
  const req = await fetch(url)
  // console.log('U > getFileDataRaw > getUrl > req : ', req)
  const data = await req.text()
  // console.log('U > getFileDataRaw > getUrl > data : ', data)
  return data
}

// export async downloadFile (gitInfos, headers = undefined) {
//   const url = gitInfos.apiFileRaw
//   // console.log('\nU > getFileDataRaw > getFileData > url : ', url)
// }

// TO DO
// POST - PUT
