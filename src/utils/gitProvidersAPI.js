import {
  buildGitRequestOptions,
  buildGitUserInfosUrl,
  buildPostBranchUrl,
  buildPutCommitReqData,
  buildPostMergeRequestUrl
} from '@/utils/utilsGitUrl'

// no use for axios (less dependencies, native function)
// see https://blog.logrocket.com/axios-vs-fetch-best-http-requests/#:~:text=To%20send%20data%2C%20fetch(),stringify%20method
// see https://www.atecna.ca/fr/blog/fetch-vs-axios/

export async function getData (url, funcName = undefined, token = undefined, raw = false, provider = undefined, filefullname = undefined) {
  // console.log('\nU > gitProvidersAPI > getData > A > url : ', url)
  // console.log('U > gitProvidersAPI > getData > A > token : ', token)
  // console.log('U > gitProvidersAPI > getData > A > funcName : ', funcName)
  // console.log('U > gitProvidersAPI > getData > A > raw : ', raw)
  const errors = []

  // build auth headers to get raw data from private repo if any
  let requestOptions
  if (token) {
    requestOptions = buildGitRequestOptions('GET', provider, token)
  }
  // console.log('U > gitProvidersAPI > getData > A > headers : ', headers)
  let req
  if (requestOptions) {
    req = await fetch(url, requestOptions)
  } else {
    req = await fetch(url)
  }
  // console.log('\nU > gitProvidersAPI > getData > B > url : ', url)
  // console.log('U > gitProvidersAPI > getData > B > req : ', req)
  // console.log('U > gitProvidersAPI > getData > B > funcName : ', funcName)
  // console.log('U > gitProvidersAPI > getData > B > raw : ', raw)
  // console.log('U > gitProvidersAPI > getData > B > provider : ', provider)

  let resp
  if (raw || provider === 'localhost') {
    // console.log('U > gitProvidersAPI > getData > B > req.text : ', req.text)
    resp = await req.text()
  } else {
    // console.log('U > gitProvidersAPI > getData > B > req.json : ', req.json)
    resp = await req.json()
  }
  if (provider === 'localhost' && !raw) {
    const filePath = url.split('/')
    resp = {
      name: filePath[filePath.length - 1],
      url: url,
      data: resp
    }
  }
  // console.log('U > gitProvidersAPI > getData > B > resp : ', resp)

  if (!req.ok) {
    const err = {
      url: url,
      function: funcName,
      filefullname: filefullname,
      code: req.status,
      resp: resp
    }
    errors.push(err)
  }

  // return data
  return {
    url: url,
    filefullname: filefullname,
    ok: req.ok,
    status: req.status,
    data: resp,
    errors: errors
  }
}

export async function getFileData (gitObj, token = undefined) {
  // get correct API url
  const url = gitObj.apiFile
  const provider = gitObj.provider
  const fetched = await getData(url, 'getFileData', token, false, provider, gitObj.filefullname)
  return fetched
}

export async function getFileDataRaw (gitObj, token = undefined) {
  // get correct API url
  const url = gitObj.apiFileRaw
  const provider = gitObj.provider
  const fetched = await getData(url, 'getFileDataRaw', token, true, provider, gitObj.filefullname)
  return fetched
}

// WORK IN PROGRESS

// GET - GET USER INFO FROM TOKEN
export async function getUserInfosFromToken (gitObj, token) {
  // console.log('\nU > gitProvidersAPI > getUserInfosFromToken > gitObj : ', gitObj)
  // console.log('U > gitProvidersAPI > getUserInfosFromToken > token : ', token)

  const userInfosUrl = buildGitUserInfosUrl(gitObj, token)
  // console.log('U > gitProvidersAPI > getUserInfosFromToken > userInfosUrl : ', userInfosUrl)

  const userInfosReq = await fetch(userInfosUrl.url, userInfosUrl.requestOptions)
  const userInfosData = await userInfosReq.json()
  let username

  switch (gitObj.provider) {
    case 'gitlab':
      username = userInfosData.username
      // console.log('U > utilsGitUrl > buildPostMergeRequestUrl > gitlab > username : ', username)
      break
    case 'github':
      username = userInfosData.login
      break
  }
  return {
    token: token,
    username: username,
    gitInfos: userInfosData
  }
}

// POST - CREATE A NEW BRANCH
export async function postNewBranch (commitData) {
  // console.log('\nU > gitProvidersAPI > postNewBranch > commitData : ', commitData)
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
  const filefullname = commitData.gitObj.filefullname
  const sourceBranch = commitData.gitObj.branch
  const urlData = await buildPostBranchUrl(commitData.gitObj, sourceBranch, newBranch)
  // console.log('U > gitProvidersAPI > postNewBranch > urlData : ', urlData)

  // build request options
  const requestOptions = buildGitRequestOptions(method, provider, token, urlData.body, 'new-branch')
  // console.log('U > gitProvidersAPI > postNewBranch > requestOptions : ', requestOptions)

  // test with pure fetch
  const req = await fetch(urlData.url, requestOptions)
  // console.log('U > gitProvidersAPI > postNewBranch > req : ', req)
  if (!req.ok) { errors = [] }

  const resp = await req.json()
  // console.log('U > gitProvidersAPI > postNewBranch > resp : ', resp)
  if (!req.ok) {
    const err = {
      url: urlData.url,
      filefullname: filefullname,
      function: 'postNewBranch',
      code: req.status,
      resp: resp
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
  // console.log('\nU > gitProvidersAPI > putCommitToBranch > commitData : ', commitData)
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
  const filefullname = commitData.gitObj.filefullname

  // build body and data
  const reqData = await buildPutCommitReqData(commitData.gitObj, branch, edited, message, author)
  // console.log('U > gitProvidersAPI > putCommitToBranch > reqData : ', reqData)
  const body = reqData.body

  // build request options
  const requestOptions = buildGitRequestOptions(method, provider, token, body)
  // console.log('U > gitProvidersAPI > putCommitToBranch > requestOptions : ', requestOptions)

  // test with pure fetch
  const req = await fetch(reqData.url, requestOptions)
  // console.log('U > gitProvidersAPI > putCommitToBranch > req : ', req)

  const resp = await req.json()
  // console.log('U > gitProvidersAPI > putCommitToBranch > resp : ', resp)
  if (!req.ok) {
    const err = {
      url: reqData.url,
      filefullname: filefullname,
      function: 'putCommitToBranch',
      code: req.status,
      resp: resp
    }
    errors.push(err)
  }

  return {
    data: resp,
    errors: errors
  }
}

// PUT - POST - CREATE A MERGE REQUEST
export async function postMergeRequest (commitData) {
  // console.log('\nU > gitProvidersAPI > postMergeRequest > commitData : ', commitData)
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
  const userGit = commitData.userGit
  const filefullname = commitData.gitObj.filefullname
  // console.log('U > gitProvidersAPI > postMergeRequest > method : ', method)
  // console.log('U > gitProvidersAPI > postMergeRequest > newBranch : ', newBranch)
  // console.log('U > gitProvidersAPI > postMergeRequest > token : ', token)
  // console.log('U > gitProvidersAPI > postMergeRequest > provider : ', provider)

  // build correct API url
  const urlData = await buildPostMergeRequestUrl(commitData.gitObj, targetBranch, newBranch, token, userGit)
  // console.log('U > gitProvidersAPI > postNewBranch > urlData : ', urlData)
  // const resp = 'postMergeRequest resp ... work in progress'

  // build request options
  const requestOptions = buildGitRequestOptions(method, provider, token, urlData.body, 'merge-request')
  // console.log('U > gitProvidersAPI > postMergeRequest > requestOptions : ', requestOptions)

  // test with pure fetch
  const req = await fetch(urlData.url, requestOptions)
  // console.log('U > gitProvidersAPI > postMergeRequest > req : ', req)
  if (!req.ok) { errors = [] }

  const resp = await req.json()
  // console.log('U > gitProvidersAPI > postMergeRequest > resp : ', resp)
  if (!req.ok) {
    const err = {
      url: urlData.url,
      filefullname: filefullname,
      function: 'postMergeRequest',
      code: req.status,
      resp: resp
    }
    errors.push(err)
  }

  return {
    data: resp,
    errors: errors
  }
}

export const buildContributionResume = (commitData, responsesData, onlyCommit = false) => {
  // console.log('\nU > gitProvidersAPI > buildContributionResume > commitData : ', commitData)
  // console.log('U > gitProvidersAPI > buildContributionResume > responsesData : ', responsesData)

  const gitObj = commitData.gitObj
  const provider = gitObj.provider
  const repoUrl = gitObj.repoUrl
  const filePath = gitObj.filepath
  const filefullname = gitObj.filefullname
  const branch = commitData.newBranch
  const resumeData = {
    code: 200,
    provider: provider,
    filefullname: filefullname,
    branch: branch
  }
  if (onlyCommit) {
    resumeData.branchUrl = responsesData.branchUrl
    resumeData.mergeRequestUrl = responsesData.mergeRequestUrl
    resumeData.branchExists = true
  } else {
    switch (provider) {
      case 'gitlab':
        resumeData.branchUrl = `${repoUrl}/-/blob/${branch}/${filePath}`
        resumeData.mergeRequestUrl = responsesData.respPostMergeRequest.data.web_url
        break
      case 'github':
        resumeData.branchUrl = `${repoUrl}/blob/${branch}/${filePath}`
        resumeData.mergeRequestUrl = responsesData.respPostMergeRequest.data.html_url
        break
    }
  }
  return resumeData
}

// WRAP UP : post new branch > put commit to new branch > make a new merge request
export async function sendContribution (commitData) {
  // console.log('\nU > gitProvidersAPI > sendContribution > commitData : ', commitData)

  const ok = true
  const responsesData = {}
  const errors = []

  const branch = commitData.userBranches.find(branch => branch.branch === commitData.newBranch)
  const branchExists = branch && !!branch.branch
  const mergeRequestExists = branchExists && branch.hasMergeRequest
  // console.log('U > gitProvidersAPI > sendContribution > branch : ', branch)
  // console.log('U > gitProvidersAPI > sendContribution > branchExists : ', branchExists)
  // console.log('U > gitProvidersAPI > sendContribution > mergeRequestExists : ', mergeRequestExists)

  // post new branch (if necessary)
  if (!branchExists) {
    const respBranch = await postNewBranch(commitData)
    // console.log('\nU > gitProvidersAPI > sendContribution > respBranch :', respBranch)
    responsesData.respPostBranch = respBranch
    errors.push(...respBranch.errors)
  } else {
    responsesData.branchUrl = branch.branchUrl
  }

  // put commit to branch
  const respCommit = await putCommitToBranch(commitData)
  // console.log('\nU > gitProvidersAPI > sendContribution > respCommit :', respCommit)
  responsesData.respPutCommit = respCommit
  errors.push(...respCommit.errors)

  // post a new merge request (if necessary)
  if (!mergeRequestExists) {
    const respMergeRequest = await postMergeRequest(commitData)
    // console.log('\nU > gitProvidersAPI > sendContribution > respMergeRequest :', respMergeRequest)
    responsesData.respPostMergeRequest = respMergeRequest
    errors.push(...respMergeRequest.errors)
  } else {
    responsesData.mergeRequestUrl = branch.mergeRequestUrl
  }

  const resumeData = buildContributionResume(commitData, responsesData, mergeRequestExists)

  return {
    ok: ok,
    responseData: responsesData,
    resume: resumeData,
    errors: errors
  }
}
