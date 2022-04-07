import { buildGitRequestOptions, buildPostBranchUrl } from '@/utils/utilsGitUrl'

export async function getFileData (gitObj) {
  const errors = []

  // get correct API url
  const url = gitObj.apiFile
  // console.log('\nU > gitProvidersAPI > getFileData > url : ', url)

  // --- DEPRECATED ---
  // test with axios
  // const req = await $axios.get(url)
  // return req.data

  // test with pure fetch
  const req = await fetch(url)
  // console.log('U > gitProvidersAPI > getFileData > req : ', req)

  const resp = await req.json()
  // console.log('U > gitProvidersAPI > getFileData > resp : ', resp)
  if (!req.ok) {
    const err = {
      function: 'getFileData',
      code: req.status,
      message: resp.message
    }
    errors.push(err)
  }

  // return data
  return {
    data: resp,
    errors: errors
  }
}

export async function getFileDataRaw (gitObj) {
  const errors = []

  // get correct API url
  const url = gitObj.apiFileRaw
  // console.log('\nU > gitProvidersAPI > getFileDataRaw > getFileData > url : ', url)

  // --- DEPRECATED ---
  // test with axios
  // const req = await $axios.get(url)
  // return req.data

  // test with pure fetch
  const req = await fetch(url)
  // console.log('U > gitProvidersAPI > getFileDataRaw > getUrl > req : ', req)

  let resp = await req.text()
  // console.log('U > gitProvidersAPI > getFileDataRaw > getUrl > resp : ', resp)
  if (!req.ok) {
    resp = await req.json()
    const err = {
      function: 'getFileDataRaw',
      code: req.status,
      message: resp.message
    }
    errors.push(err)
  }

  // return data
  return {
    data: resp,
    errors: errors
  }
}

// WORK IN PROGRESS

// POST - CREATE A NEW BRANCH
export async function postNewBranch (commitData) {
  console.log('\nU > gitProvidersAPI > postNewBranch > commitData : ', commitData)
  /*
  GITLAB : https://docs.gitlab.com/ee/api/branches.html#create-repository-branch
  POST /projects/:id/repository/branches
  curl --request POST --header "PRIVATE-TOKEN: <your_access_token>"
  "https://gitlab.example.com/api/v4/projects/5/repository/branches?branch=newbranch&ref=main"
  ---
  GITHUB : https://stackoverflow.com/questions/9506181/github-api-create-branch#:~:text=So%20it%20should%20be%20possible,heads%20'%20in%20the%20ref%20parameter.&text=Find%20the%20revision%20you%20want%20to%20branch%20from.&text=You%20will%20need%20to%20use,your%20branch%20will%20be%20created!
  */

  let errors = []
  const method = 'POST'
  const token = commitData.token
  const provider = commitData.gitObj.provider

  // build correct API url
  const newBranch = commitData.newBranch
  const sourceBranch = commitData.gitObj.branch
  const urlData = await buildPostBranchUrl(commitData.gitObj, sourceBranch, newBranch)
  console.log('U > gitProvidersAPI > postNewBranch > urlData : ', urlData)

  // build request options
  const requestOptions = buildGitRequestOptions(method, provider, token, urlData.body)
  console.log('U > gitProvidersAPI > postNewBranch > requestOptions : ', requestOptions)

  // test with pure fetch
  const req = await fetch(urlData.url, requestOptions)
  console.log('U > gitProvidersAPI > postNewBranch > req : ', req)
  if (!req.ok) { errors = [] }

  const resp = await req.json()
  console.log('U > gitProvidersAPI > postNewBranch > resp : ', resp)
  if (!req.ok) {
    const err = {
      function: 'postNewBranch',
      code: req.status,
      message: resp.message
    }
    errors.push(err)
  }

  return {
    data: resp,
    errors: errors
  }
}

// TO DO
// PUT - CREATE A COMMIT
export async function putCommitToBranch (commitData) {
  console.log('\nU > gitProvidersAPI > putCommitToBranch > commitData : ', commitData)
  /*
  GITLAB :
  curl --request PUT --header 'PRIVATE-TOKEN: <your_access_token>' \
     --header "Content-Type: application/json" \
     --data '{"branch": "master", "author_email": "author@example.com", "author_name": "Firstname Lastname",
       "content": "some content", "commit_message": "update file"}' \
     "https://gitlab.example.com/api/v4/projects/13083/repository/files/app%2Fproject%2Erb"
  ---
  GITHUB :
  ...
  */
  // build request options
  const errors = []
  const method = 'PUT'
  const token = commitData.token
  const provider = commitData.gitObj.provider
  const body = JSON.stringify(commitData.edited)
  const requestOptions = buildGitRequestOptions(method, provider, token, body)
  console.log('U > gitProvidersAPI > putCommitToBranch > requestOptions : ', requestOptions)

  // build correct API url
  // const newBranch = commitData.newBranch
  // const url = `${commitData.gitObj.apiRepo}`

  // test with pure fetch
  // const req = await fetch(url, requestOptions)
  // console.log('U > gitProvidersAPI > getFileDataRaw > getUrl > req : ', req)
  const resp = 'putCommitToBranch resp ... work in progress'

  return {
    data: resp,
    errors: errors
  }
}

// TO DO
// PUT - POST - CREATE A MERGE REQUEST
export async function postMergeRequest (commitData) {
  console.log('\nU > gitProvidersAPI > postMergeRequest > commitData : ', commitData)
  /*
  GITLAB : https://docs.gitlab.com/ee/api/merge_requests.html#create-mr
  POST /projects/:id/merge_requests
  Attribute     Type            Required  Description
  id            integer/string  yes       The ID or URL-encoded path of the project owned by the authenticated user
  source_branch string          yes       The source branch.
  target_branch string          yes       The target branch.
  title         string          yes       Title of MR.
  ---
  GITHUB : https://docs.github.com/en/rest/reference/pulls
  */

  // build request options
  const errors = []
  const method = 'POST'
  const token = commitData.token
  const provider = commitData.gitObj.provider
  console.log('U > gitProvidersAPI > postMergeRequest > method : ', method)
  console.log('U > gitProvidersAPI > postMergeRequest > token : ', token)
  console.log('U > gitProvidersAPI > postMergeRequest > provider : ', provider)

  const resp = 'postMergeRequest resp ... work in progress'

  return {
    data: resp,
    errors: errors
  }
}

// WRAP UP : post new branch > put commit to new branch > make a new merge request
export async function sendContribution (commitData) {
  console.log('\nU > gitProvidersAPI > sendContribution > commitData : ', commitData)

  let errors = []
  const ok = true

  // post new branch
  const respBranch = await postNewBranch(commitData)
  console.log('\nU > gitProvidersAPI > sendContribution > respBranch :', respBranch)

  // put commit to branch
  const respCommit = await putCommitToBranch(commitData)
  console.log('\nU > gitProvidersAPI > sendContribution > respCommit :', respCommit)

  // post a new merge request
  const respMergeRequest = await postMergeRequest(commitData)
  console.log('\nU > gitProvidersAPI > sendContribution > respMergeRequest :', respMergeRequest)

  errors = [
    ...respBranch.errors,
    ...respCommit.errors,
    ...respMergeRequest.errors
  ]

  return {
    ok: ok,
    data: {
      respPostBranch: respBranch,
      respPutCommit: respCommit,
      respPostMergeRequest: respMergeRequest
    },
    errors: errors
  }
}
