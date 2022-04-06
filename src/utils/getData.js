// import axios from 'axios'

// export const $axios = axios

export async function getFileData (gitObj, headers = undefined) {
  // get correct API url
  const url = gitObj.apiFile
  // console.log('\nU > getData > getFileData > url : ', url)

  // --- DEPRECATED ---
  // test with axios
  // const req = await $axios.get(url)
  // return req.data

  // test with pure fetch
  const req = await fetch(url)
  // console.log('U > getData > getFileData > req : ', req)
  const data = await req.json()
  // console.log('U > getData > getFileData > data : ', data)
  return data
}

export async function getFileDataRaw (gitObj, headers = undefined) {
  // get correct API url
  const url = gitObj.apiFileRaw
  // console.log('\nU > getData > getFileDataRaw > getFileData > url : ', url)

  // --- DEPRECATED ---
  // test with axios
  // const req = await $axios.get(url)
  // return req.data

  // test with pure fetch
  const req = await fetch(url)
  // console.log('U > getData > getFileDataRaw > getUrl > req : ', req)
  const data = await req.text()
  // console.log('U > getData > getFileDataRaw > getUrl > data : ', data)
  return data
}

// WORK IN PROGRESS
// POST - PUT
export async function putCommit (commitData, headers = undefined) {
  console.log('\nU > getData > putCommit > commitData : ', commitData)
  console.log('U > getData > putCommit > headers : ', headers)

  // build request options
  const requestOptions = {
    method: 'PUT',
    // headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commitData.edited)
  }
  console.log('U > getData > putCommit > requestOptions : ', requestOptions)

  // build correct API url
  // const url = gitObj.apiFile

  // test with pure fetch
  // const req = await fetch(url, requestOptions)
  // console.log('U > getData > getFileDataRaw > getUrl > req : ', req)

  return 'testing'
}
