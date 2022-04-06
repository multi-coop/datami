import { buildGitRequestOptions, buildPostBranchUrl } from '@/utils/utilsGitUrl'

export async function getFileData (gitObj) {
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

export async function getFileDataRaw (gitObj) {
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

// POST - CREATE A NEW BRANCH
export async function postNewBranch (commitData) {
  console.log('\nU > getData > postNewBranch > commitData : ', commitData)
  /*
  GITLAB : https://docs.gitlab.com/ee/api/branches.html#create-repository-branch
  POST /projects/:id/repository/branches
  curl --request POST --header "PRIVATE-TOKEN: <your_access_token>"
    "https://gitlab.example.com/api/v4/projects/5/repository/branches?branch=newbranch&ref=main"
  ---
  GITHUB : https://stackoverflow.com/questions/9506181/github-api-create-branch#:~:text=So%20it%20should%20be%20possible,heads%20'%20in%20the%20ref%20parameter.&text=Find%20the%20revision%20you%20want%20to%20branch%20from.&text=You%20will%20need%20to%20use,your%20branch%20will%20be%20created!
  */
  const method = 'POST'
  const token = commitData.token
  const provider = commitData.gitObj.provider

  // build correct API url
  const newBranch = commitData.newBranch
  const sourceBranch = commitData.gitObj.branch
  const urlData = await buildPostBranchUrl(commitData.gitObj, sourceBranch, newBranch)
  console.log('U > getData > postNewBranch > urlData : ', urlData)

  // build request options
  const requestOptions = buildGitRequestOptions(method, provider, token, urlData.body)
  console.log('U > getData > postNewBranch > requestOptions : ', requestOptions)

  // test with pure fetch
  const req = await fetch(urlData.url, requestOptions)
  console.log('U > getData > postNewBranch > req : ', req)

  const resp = await req.json()
  console.log('U > getData > postNewBranch > resp : ', resp)

  return resp
}

// TO DO
// PUT - CREEATE A COMMIT
export async function putCommit (commitData) {
  console.log('\nU > getData > putCommit > commitData : ', commitData)
  /*
  GITLAB :
  curl --request PUT --header 'PRIVATE-TOKEN: <your_access_token>' \
     --header "Content-Type: application/json" \
     --data '{"branch": "master", "author_email": "author@example.com", "author_name": "Firstname Lastname",
       "content": "some content", "commit_message": "update file"}' \
     "https://gitlab.example.com/api/v4/projects/13083/repository/files/app%2Fproject%2Erb"
  */
  // build request options
  const method = 'PUT'
  const token = commitData.token
  const provider = commitData.gitObj.provider
  const body = JSON.stringify(commitData.edited)
  const requestOptions = buildGitRequestOptions(method, provider, token, body)
  console.log('U > getData > putCommit > requestOptions : ', requestOptions)

  // build correct API url
  // const newBranch = commitData.newBranch
  // const url = `${commitData.gitObj.apiRepo}`

  // test with pure fetch
  // const req = await fetch(url, requestOptions)
  // console.log('U > getData > getFileDataRaw > getUrl > req : ', req)

  return 'testing put commit'
}

// TO DO
// PUT - POST - CREATE A MERGE REQUEST
