import {
  buildGitRequestOptions,
  buildPostBranchUrl,
  buildPutCommitReqData,
  buildPostMergeRequestUrl
} from '@/utils/utilsGitUrl'

// no use for axios (less dependencies, native function)
// see https://blog.logrocket.com/axios-vs-fetch-best-http-requests/#:~:text=To%20send%20data%2C%20fetch(),stringify%20method
// see https://www.atecna.ca/fr/blog/fetch-vs-axios/

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
  const requestOptions = buildGitRequestOptions(method, provider, token, urlData.body, 'new-branch')
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
  PUT /repos/{owner}/{repo}/contents/{path}
  ...
  */
  const errors = []
  const method = 'PUT'
  const token = commitData.token
  const branch = commitData.newBranch
  const author = commitData.author
  const message = commitData.message
  const edited = commitData.edited
  const provider = commitData.gitObj.provider

  // build body and data
  const reqData = await buildPutCommitReqData(commitData.gitObj, branch, edited, message, author)
  console.log('U > gitProvidersAPI > putCommitToBranch > reqData : ', reqData)
  const body = reqData.body

  // build request options
  const requestOptions = buildGitRequestOptions(method, provider, token, body)
  console.log('U > gitProvidersAPI > putCommitToBranch > requestOptions : ', requestOptions)

  // test with pure fetch
  const req = await fetch(reqData.url, requestOptions)
  console.log('U > gitProvidersAPI > putCommitToBranch > req : ', req)

  const resp = await req.json()
  console.log('U > gitProvidersAPI > putCommitToBranch > resp : ', resp)
  if (!req.ok) {
    const err = {
      function: 'putCommitToBranch',
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
  let errors = []
  const method = 'POST'
  const targetBranch = commitData.gitObj.branch
  const newBranch = commitData.newBranch
  const token = commitData.token
  const provider = commitData.gitObj.provider
  console.log('U > gitProvidersAPI > postMergeRequest > method : ', method)
  console.log('U > gitProvidersAPI > postMergeRequest > newBranch : ', newBranch)
  console.log('U > gitProvidersAPI > postMergeRequest > token : ', token)
  console.log('U > gitProvidersAPI > postMergeRequest > provider : ', provider)

  // build correct API url
  const urlData = await buildPostMergeRequestUrl(commitData.gitObj, targetBranch, newBranch, token)
  console.log('U > gitProvidersAPI > postNewBranch > urlData : ', urlData)
  // const resp = 'postMergeRequest resp ... work in progress'

  // build request options
  const requestOptions = buildGitRequestOptions(method, provider, token, urlData.body, 'merge-request')
  console.log('U > gitProvidersAPI > postMergeRequest > requestOptions : ', requestOptions)

  // test with pure fetch
  const req = await fetch(urlData.url, requestOptions)
  console.log('U > gitProvidersAPI > postMergeRequest > req : ', req)
  if (!req.ok) { errors = [] }

  const resp = await req.json()
  console.log('U > gitProvidersAPI > postMergeRequest > resp : ', resp)
  if (!req.ok) {
    const err = {
      function: 'postMergeRequest',
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

export const buildContributionResume = (commitData, responsesData) => {
  const gitObj = commitData.gitObj
  const provider = gitObj.provider
  const repoUrl = gitObj.repoUrl
  const filePath = gitObj.filepath
  const newBranch = commitData.newBranch
  const resumeData = {
    code: 200,
    newBranch: newBranch
  }
  switch (provider) {
    case 'gitlab':
      resumeData.provider = provider
      // resumeData.branchUrl = responsesData.respPostBranch.data.web_url
      resumeData.branchUrl = `${repoUrl}/~/blob/${newBranch}/${filePath}`
      // resumeData.commitUrl = responsesData.respPutCommit.data
      resumeData.mergeRequestUrl = responsesData.respPostMergeRequest.data.web_url
      break
    case 'github':
      resumeData.provider = provider
      resumeData.branchUrl = `${repoUrl}/blob/${newBranch}/${filePath}`
      // resumeData.commitUrl = responsesData.respPutCommit.data.commit.html_url
      resumeData.mergeRequestUrl = responsesData.respPostMergeRequest.data.html_url
      break
  }
  return resumeData
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

  const responsesData = {
    respPostBranch: respBranch,
    respPutCommit: respCommit,
    respPostMergeRequest: respMergeRequest
  }

  const resumeData = buildContributionResume(commitData, responsesData)

  return {
    ok: ok,
    responseData: responsesData,
    resume: resumeData,
    errors: errors
  }
}
