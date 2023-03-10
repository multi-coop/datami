import { authorizedFileTypes as fileTypes } from '@/utils/fileTypesUtils.js'

export const gitProviders = {
  localhost: {
    root: 'http://localhost',
    rootFix: '',
    raw: '',
    apiFix: '',
    fix: ''
    // root: 'https://gitlab.com/jailbreak/jailbreak.paris/ -/blob/ master/package.json'
    // raw:  'https://gitlab.com/jailbreak/jailbreak.paris/ -/raw/  master/package.json',
  },
  github: {
    root: 'https://github.com/',
    rootFix: '/blob',
    raw: 'https://raw.githubusercontent.com/',
    apiFix: 'https://api.github.com',
    fix: ''
    // root: 'https://github.com                /co-demos/multi-site-contents/ blob/ master/config/global.md',
    // raw:  'https://raw.githubusercontent.com /co-demos/multi-site-contents/       master/config/global.md',
  },
  gitlab: {
    root: 'https://gitlab.com/',
    rootFix: '/-/blob',
    raw: 'https://gitlab.com/',
    apiFix: 'api/v4',
    fix: '/-/raw'
    // root: 'https://gitlab.com/jailbreak/jailbreak.paris/ -/blob/ master/package.json'
    // raw:  'https://gitlab.com/jailbreak/jailbreak.paris/ -/raw/  master/package.json',
  }
}

/**
 * b64encode takes a string and encodes it to b64
 * @param  {string} str string content to encode
 * @return {string}     encoded string
 **/
export const b64encode = (str) => {
  return btoa(unescape(encodeURIComponent(str)))
}

/**
 * b64decode takes an encoded string and decodes it
 * @param  {string} str string content to decode
 * @return {string}     decoded string
 **/
export const b64decode = (str) => {
  return decodeURIComponent(escape(atob(str)))
}

export const buildApiRoots = (gitInfos) => {
  // console.log('U > utilsGitUrl > buildApiRoots > gitInfos : ', gitInfos)
  let apiRepo, apiFile, apiFileBase, apiFileRaw
  if (gitInfos.provider === 'github') {
    // cf : https://docs.github.com/en/rest/reference/repos#contents
    apiRepo = `${gitInfos.api}/repos/${gitInfos.orga}/${gitInfos.repo}`
    apiFileBase = `${apiRepo}/contents/${gitInfos.filepath}`
    apiFile = `${apiFileBase}?ref=${gitInfos.branch}`
    apiFileRaw = `${gitInfos.rawRoot}${gitInfos.filepath}`
  } else if (gitInfos.provider === 'localhost') {
    // const URIrepo = encodeURIComponent(`${gitInfos.repo}`)
    const URIfilepath = encodeURIComponent(gitInfos.filepath)
    apiRepo = `${gitInfos.api}`
    apiFileBase = `${apiRepo}/${URIfilepath}`
    apiFile = `${apiFileBase}`
    apiFileRaw = `${apiFileBase}`
  } else if (gitInfos.provider === 'gitlab') {
    // cf : https://docs.gitlab.com/ee/api/repository_files.html
    const URIrepo = encodeURIComponent(`${gitInfos.orga}${gitInfos.subgroupsStr ? '/' + gitInfos.subgroupsStr : ''}/${gitInfos.repo}`)
    const URIfilepath = encodeURIComponent(gitInfos.filepath)
    apiRepo = `${gitInfos.api}/projects/${URIrepo}`
    apiFileBase = `${apiRepo}/repository/files/${URIfilepath}`
    apiFile = `${apiFileBase}?ref=${gitInfos.branch}`
    apiFileRaw = `${apiFileBase}/raw?ref=${gitInfos.branch}`
  } else {
    // console.log('U > utilsGitUrl > buildApiRoots > ELSE > gitInfos : ', gitInfos)
  }
  // console.log('U > utilsGitUrl > buildApiRoots > apiRepo : ', apiRepo)
  // console.log('U > utilsGitUrl > buildApiRoots > apiFile : ', apiFile)
  // console.log('U > utilsGitUrl > buildApiRoots > apiFileRaw : ', apiFileRaw)
  return {
    repo: apiRepo,
    file: apiFile,
    fileRaw: apiFileRaw
  }
}

export const extractGitInfos = (str) => {
  // console.log('\nU > utilsGitUrl > extractGitInfos > str : ', str)
  let provider, orga, repo, branch, rawRoot, publicRoot, remaining, api
  let subgroups = []
  let gitRef, trimmed, split, rawUrl
  let filefullname, filename, filetype

  if (str.startsWith(gitProviders.github.root) || str.startsWith(gitProviders.github.raw)) {
    provider = 'github'
    gitRef = gitProviders.github
    rawUrl = str.startsWith(gitRef.raw)
    trimmed = rawUrl ? str.replace(gitRef.raw, '') : str.replace(gitRef.root, '')
    split = trimmed.split('/')
    orga = split[0]
    repo = split[1]
    branch = rawUrl ? split[2] : split[3]
    remaining = rawUrl ? split.splice(3).join('/') : split.splice(4).join('/')
    api = gitRef.apiFix
  } else if (str.startsWith(gitProviders.localhost.root)) {
    // For local host dev
    provider = 'localhost'
    gitRef = { ...gitProviders.localhost }
    const urlCut = str.split('//')
    const host = urlCut[1].split('/')[0]
    // console.log('U > utilsGitUrl > extractGitInfos > localhost > host : ', host)
    gitRef.root = `http://${host}`
    gitRef.raw = `http://${host}`
    split = urlCut[1].split('/').slice(1)
    // console.log('U > utilsGitUrl > extractGitInfos > localhost > split : ', split)
    orga = 'localhost'
    repo = ''
    branch = ''
    remaining = split.join('/')
    api = `http://${host}`
  } else if (str.startsWith(gitProviders.gitlab.root) || str.startsWith(gitProviders.gitlab.raw)) {
    provider = 'gitlab'
    gitRef = gitProviders.gitlab
    const urlCut = str.split('//')
    const host = urlCut[1].split('/')[0]
    trimmed = str.replace(gitRef.root, '')

    const isRaw = trimmed.includes(gitProviders.gitlab.fix)
    // console.log('U > utilsGitUrl > extractGitInfos > gitlab > isRaw : ', isRaw)
    let gitlabSplit
    if (isRaw) {
      // for url as : https://gitlab.com/multi-coop/datami-project/datami-clients/datami-odf-observatoire/-/raw/main/data/csv/ODF-Observatoire-organisations.csv
      gitlabSplit = trimmed.split('/-/raw/')
    } else {
      // for url as : https://gitlab.com/multi-coop/datami-project/datami-clients/datami-odf-observatoire/-/blob/main/data/csv/ODF-Observatoire-organisations.csv
      gitlabSplit = trimmed.split('/-/blob/')
    }
    // console.log('U > utilsGitUrl > extractGitInfos > gitlab > gitlabSplit : ', gitlabSplit)
    const splitLeft = gitlabSplit[0].split('/')
    const splitRight = gitlabSplit[1].split('/')
    // console.log('U > utilsGitUrl > extractGitInfos > gitlab > splitLeft : ', splitLeft)
    // console.log('U > utilsGitUrl > extractGitInfos > gitlab > splitRight : ', splitRight)

    // split by branch to get on the left orga > group > repo ... and on the right : branch > (path) > file
    orga = splitLeft[0]
    repo = splitLeft.at(-1)
    subgroups = splitLeft.length > 2 ? splitLeft.slice(1, splitLeft.length - 1) : []
    branch = splitRight[0]
    remaining = splitRight.slice(1, splitRight.length).join('/')
    api = `https://${host}/${gitRef.apiFix}`
  } else {
    console.log('U > utilsGitUrl > extractGitInfos > ERROR A > str : ', str)
  }
  const subgroupsStr = subgroups.length ? subgroups.join('/') : undefined

  // console.log('U > utilsGitUrl > extractGitInfos > orga : ', orga)
  // console.log('U > utilsGitUrl > extractGitInfos > subgroups : ', subgroups)
  // console.log('U > utilsGitUrl > extractGitInfos > api : ', api)
  // console.log('U > utilsGitUrl > extractGitInfos > repo : ', repo)
  // console.log('U > utilsGitUrl > extractGitInfos > branch : ', branch)
  // console.log('U > utilsGitUrl > extractGitInfos > remaining : ', remaining)

  rawRoot = `${gitRef.raw}${orga}${subgroupsStr ? '/' + subgroupsStr : ''}/${repo}`
  let publicRootUrl = `${gitRef.root}${orga}${subgroupsStr ? '/' + subgroupsStr : ''}/${repo}`

  let fileraw

  if (orga === 'localhost') {
    rawRoot = `${api}`
    publicRoot = `${api}`
    publicRootUrl = `${api}`
    fileraw = `${rawRoot}/${remaining}`
  } else {
    rawRoot = `${rawRoot}${gitRef.fix}/${branch}/`
    publicRoot = `${publicRootUrl}${gitRef.rootFix}/${branch}/`
    // https://raw.githubusercontent.com/multi-coop/datami-content-test/main/texts/markdown/jailbreak-devient-multi-fr.md
    // https://gitlab.com/multi-coop/datami-content-test/-/raw/main/texts/markdown/test-file-datami-fr.md
    fileraw = `${rawRoot}${remaining}`
  }

  // console.log('U > utilsGitUrl > extractGitInfos > publicRootUrl : ', publicRootUrl)
  // console.log('U > utilsGitUrl > extractGitInfos > rawRoot : ', rawRoot)
  // console.log('U > utilsGitUrl > extractGitInfos > fileraw : ', fileraw)

  // if file in remaining string
  if (remaining !== '') {
    const file = remaining.split('/')
    filefullname = remaining.split('/')[file.length - 1]
    const filenameArray = filefullname.split('.')
    filename = filenameArray.slice(0, -1).join()
    filetype = filenameArray[filenameArray.length - 1]
  }
  // console.log('U > utilsGitUrl > extractGitInfos > filefullname : ', filefullname)
  // console.log('U > utilsGitUrl > extractGitInfos > filename : ', filename)
  // console.log('U > utilsGitUrl > extractGitInfos > filetype : ', filetype)

  const gitInfos = {
    id: str,
    uuid: undefined,
    provider: provider,
    api: api,
    orga: orga,
    subgroups: subgroups,
    subgroupsStr: subgroupsStr,
    repo: repo,
    branch: branch || 'master',
    repoUrl: publicRootUrl,
    rawRoot: rawRoot,
    fileraw: fileraw,
    publicRoot: publicRoot,
    filepath: remaining,
    filename: filename,
    filetype: filetype,
    filefamily: (fileTypes[filetype] && fileTypes[filetype].family) || 'other',
    filefullname: filefullname
  }
  const apiRoots = buildApiRoots(gitInfos)
  gitInfos.apiRepo = apiRoots.repo
  gitInfos.apiFile = apiRoots.file
  gitInfos.apiFileRaw = apiRoots.fileRaw

  // console.log('U > utilsGitUrl > extractGitInfos > gitInfos : ', gitInfos)

  return gitInfos
}

export const buildGitRequestOptions = (method, provider, token, body = undefined, action = undefined) => {
  // console.log('\nU > utilsGitUrl > buildGitRequestOptions > method : ', method)
  // console.log('U > utilsGitUrl > buildGitRequestOptions > provider : ', provider)
  // console.log('U > utilsGitUrl > buildGitRequestOptions > token : ', token)
  // console.log('U > utilsGitUrl > buildGitRequestOptions > action : ', action)
  // console.log('U > utilsGitUrl > buildGitRequestOptions > body : ', body)
  const requestOptions = {
    method: method
  }
  // build headers
  let authHeader = {}
  switch (provider) {
    case 'gitlab':
      authHeader = { 'PRIVATE-TOKEN': token }
      if (action === 'merge-request') {
        authHeader['Content-Type'] = 'application/json'
      }
      break
    case 'github':
      authHeader = { Authorization: `Token ${token}` }
      break
  }
  if (method === 'PUT') {
    authHeader['Content-Type'] = 'application/json'
  }
  requestOptions.headers = authHeader
  if (body) {
    requestOptions.body = JSON.stringify(body)
  }
  return requestOptions
}

export const buildGitUserInfosUrl = (gitObj, token = undefined, method = 'GET') => {
  // console.log('\nU > utilsGitUrl > buildGitUserInfosUrl > ...')
  // console.log('U > utilsGitUrl > buildGitUserInfosUrl > gitObj : ', gitObj)

  let userInfosUrl
  const requestOptions = {
    method: method
  }
  const authHeader = {}

  switch (gitObj.provider) {
    case 'gitlab':
      userInfosUrl = `${gitObj.api}/user`
      authHeader['PRIVATE-TOKEN'] = token
      authHeader['Content-Type'] = 'application/json'
      break
    case 'github':
      userInfosUrl = 'https://api.github.com/user'
      authHeader.Authorization = `Token ${token}`
      authHeader.Accept = 'application/vnd.github.v3+json'
      break
  }
  requestOptions.headers = authHeader
  return {
    url: userInfosUrl,
    requestOptions: requestOptions
  }
}

export async function buildPostBranchUrl (gitObj, sourceBranch, newBranch, token = undefined) {
  // console.log('\nU > utilsGitUrl > buildPostBranchUrl > ...')
  // console.log('U > utilsGitUrl > buildPostBranchUrl > gitObj : ', gitObj)
  // console.log('U > utilsGitUrl > buildPostBranchUrl > sourceBranch : ', sourceBranch)
  // console.log('U > utilsGitUrl > buildPostBranchUrl > newBranch : ', newBranch)

  const errors = []
  let newBranchAlreadyExists = false
  let urlPostBranch

  // specific to gitlab
  let prePostCheckSourceBranch, prePostCheckSourceBranchResp, prePostCheckSourceBranchData
  let prePostCheckTargetBranch, prePostCheckTargetBranchResp, prePostCheckTargetBranchData

  // specific to github
  let prePostRequestUrl, prePostResponse, prePostResponseData, revisionHash

  let postBody

  switch (gitObj.provider) {
    case 'gitlab':
      // check source branch
      prePostCheckSourceBranch = `${gitObj.apiRepo}/repository/branches/${sourceBranch}`
      // console.log('U > utilsGitUrl > buildPostBranchUrl > gitlab > prePostCheckSourceBranch : ', prePostCheckSourceBranch)
      prePostCheckSourceBranchResp = await fetch(prePostCheckSourceBranch)
      // console.log('U > utilsGitUrl > buildPostBranchUrl > gitlab > prePostCheckSourceBranchResp : ', prePostCheckSourceBranchResp)
      prePostCheckSourceBranchData = await prePostCheckSourceBranchResp.json()
      // console.log('U > utilsGitUrl > buildPostBranchUrl > gitlab > prePostCheckSourceBranchData : ', prePostCheckSourceBranchData)
      if (!prePostCheckSourceBranchResp.ok) {
        const err = {
          function: 'postNewBranch',
          code: prePostCheckSourceBranchResp.status,
          message: prePostCheckSourceBranchData.message
        }
        // console.log('U > utilsGitUrl > buildPostBranchUrl > gitlab > prePostCheckSourceBranchResp > err : ', err)
        errors.push(err)
      }

      // check target branch
      prePostCheckTargetBranch = `${gitObj.apiRepo}/repository/branches/${newBranch}`
      // console.log('U > utilsGitUrl > buildPostBranchUrl > gitlab > prePostCheckTargetBranch : ', prePostCheckTargetBranch)
      prePostCheckTargetBranchResp = await fetch(prePostCheckTargetBranch)
      // console.log('U > utilsGitUrl > buildPostBranchUrl > gitlab > prePostCheckTargetBranchResp : ', prePostCheckTargetBranchResp)
      prePostCheckTargetBranchData = await prePostCheckTargetBranchResp.json()
      // console.log('U > utilsGitUrl > buildPostBranchUrl > gitlab > prePostCheckTargetBranchData : ', prePostCheckTargetBranchData)
      if (!prePostCheckTargetBranchResp.ok) {
        const err = {
          function: 'postNewBranch',
          code: prePostCheckTargetBranchResp.status,
          message: prePostCheckTargetBranchData.message
        }
        // console.log('U > utilsGitUrl > buildPostBranchUrl > gitlab > prePostCheckTargetBranchResp > err : ', err)
        errors.push(err)
      }

      // TO DO - CATCH IF BRANCH ALREADY EXISTS
      if (prePostCheckTargetBranchResp.ok) { newBranchAlreadyExists = true }

      urlPostBranch = `${gitObj.apiRepo}/repository/branches?branch=${newBranch}&ref=${sourceBranch}`
      break

    case 'github':
      // cf : https://stackoverflow.com/questions/9506181/github-api-create-branch#:~:text=So%20it%20should%20be%20possible,heads%20'%20in%20the%20ref%20parameter.&text=Find%20the%20revision%20you%20want%20to%20branch%20from.&text=You%20will%20need%20to%20use,your%20branch%20will%20be%20created!
      // GET from : https://api.github.com/repos/<AUTHOR>/<REPO>/git/refs/heads

      // build url for prePostRequest
      prePostRequestUrl = `${gitObj.apiRepo}/git/refs/heads/${sourceBranch}`
      // console.log('U > utilsGitUrl > buildPostBranchUrl > github > prePostRequestUrl : ', prePostRequestUrl)

      // TO DO - CATCH IF BRANCH ALREADY EXISTS
      // if () { newBranchAlreadyExists = true }

      prePostResponse = await fetch(prePostRequestUrl)
      // console.log('U > utilsGitUrl > buildPostBranchUrl > github > prePostResponse : ', prePostResponse)
      prePostResponseData = await prePostResponse.json()
      // console.log('U > utilsGitUrl > buildPostBranchUrl > github > prePostResponseData : ', prePostResponseData)
      // Copy sha
      revisionHash = prePostResponseData.object.sha
      // console.log('U > utilsGitUrl > buildPostBranchUrl > github > revisionHash : ', revisionHash)
      // url to POST to : https://api.github.com/repos/<AUTHOR>/<REPO>/git/refs
      urlPostBranch = `${gitObj.apiRepo}/git/refs`
      postBody = {
        ref: `refs/heads/${newBranch}`,
        sha: revisionHash
      }
      break
  }
  return {
    url: urlPostBranch,
    newBranchAlreadyExists: newBranchAlreadyExists,
    body: postBody,
    errors: errors
  }
}

export async function buildPutCommitReqData (gitObj, branch, edited, message, author) {
  let url
  let bodyObj = {}

  // specific to github
  let prePostRequestUrl, prePostResponse, prePostResponseData, revisionHash, base64Content

  switch (gitObj.provider) {
    case 'gitlab':
      url = `${gitObj.apiFile}`
      bodyObj = {
        branch: branch,
        author_email: author.email,
        author_name: author.nameComplete,
        content: edited,
        commit_message: message
      }
      break
    case 'github':
      // TO DO
      // see https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents
      // https://docs.github.com/rest/reference/repos#create-or-update-file-contents

      url = `${gitObj.apiFile}`

      // build url for prePostRequest
      prePostRequestUrl = `${gitObj.apiFile}`
      // console.log('U > utilsGitUrl > buildPutCommitReqData > github > prePostRequestUrl : ', prePostRequestUrl)

      // TO DO - CATCH IF BRANCH ALREADY EXISTS
      // if () { newBranchAlreadyExists = true }

      prePostResponse = await fetch(prePostRequestUrl)
      // console.log('U > utilsGitUrl > buildPutCommitReqData > github > prePostResponse : ', prePostResponse)
      prePostResponseData = await prePostResponse.json()
      // console.log('U > utilsGitUrl > buildPutCommitReqData > github > prePostResponseData : ', prePostResponseData)

      // Copy sha
      revisionHash = prePostResponseData.sha
      // console.log('U > utilsGitUrl > buildPutCommitReqData > github > revisionHash : ', revisionHash)

      // encode content / edited
      base64Content = b64encode(edited)
      // console.log('U > utilsGitUrl > buildPutCommitReqData > github > base64Content : ', base64Content)

      bodyObj = {
        branch: branch,
        committer: {
          email: author.email,
          name: author.name
        },
        sha: revisionHash,
        content: base64Content,
        message: message
      }
      break
  }

  // results
  return {
    url: url,
    body: bodyObj
  }
}

export async function buildPostMergeRequestUrl (gitObj, targetBranch, newBranch, token = undefined, userGit = undefined) {
  // console.log('\nU > utilsGitUrl > buildPostMergeRequestUrl > ...')
  // console.log('U > utilsGitUrl > buildPostMergeRequestUrl > gitObj : ', gitObj)
  // console.log('U > utilsGitUrl > buildPostMergeRequestUrl > targetBranch : ', targetBranch)
  // console.log('U > utilsGitUrl > buildPostMergeRequestUrl > newBranch : ', newBranch)
  // console.log('U > utilsGitUrl > buildPostMergeRequestUrl > token : ', token)

  const errors = []
  let urlPostMergeRequest
  let username

  // specific to gitlab
  // let prePostCheckSourceBranch, prePostCheckSourceBranchResp, prePostCheckSourceBranchData
  // let prePostCheckTargetBranch, prePostCheckTargetBranchResp, prePostCheckTargetBranchData

  // specific to github
  // let prePostRequestUrl // prePostResponse, prePostResponseData, revisionHash

  let postBody, userInfosData

  if (!userGit) {
    const userInfosUrl = buildGitUserInfosUrl(gitObj, token)
    const userInfosReq = await fetch(userInfosUrl.url, userInfosUrl.requestOptions)
    userInfosData = await userInfosReq.json()
    // console.log('U > utilsGitUrl > buildPostMergeRequestUrl > userInfosUrl : ', userInfosUrl)
    // console.log('U > utilsGitUrl > buildPostMergeRequestUrl > userInfosData : ', userInfosData)
  } else {
    userInfosData = userGit
  }

  switch (gitObj.provider) {
    case 'gitlab':
      // build url for urlPostMergeRequest
      urlPostMergeRequest = `${gitObj.apiRepo}/merge_requests`
      // console.log('U > utilsGitUrl > buildPostMergeRequestUrl > gitlab > urlPostMergeRequest : ', urlPostMergeRequest)

      username = userInfosData.username

      postBody = {
        title: `Datami ... Contribution from : ${username}`,
        description: `${username} added some contributions on branch '${newBranch}', to add to branch '${targetBranch}'`,
        source_branch: `${newBranch}`,
        target_branch: targetBranch
      }
      break

    case 'github':
      // GET from : https://api.github.com/repos/<AUTHOR>/<REPO>/git/refs/heads

      // build url for urlPostMergeRequest
      urlPostMergeRequest = `${gitObj.apiRepo}/pulls`
      // console.log('U > utilsGitUrl > buildPostMergeRequestUrl > github > urlPostMergeRequest : ', urlPostMergeRequest)

      username = userInfosData.login

      postBody = {
        title: `Datami ... Contribution from : ${username}`,
        body: `${username} added some contributions on branch '${newBranch}', to add to branch '${targetBranch}'`,
        head: `${newBranch}`,
        base: targetBranch
      }
      break
  }
  return {
    url: urlPostMergeRequest,
    body: postBody,
    errors: errors
  }
}
