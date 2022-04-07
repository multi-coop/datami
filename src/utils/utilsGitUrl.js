import { authorizedFileTypes as fileTypes } from '@/utils/fileTypesUtils.js'

export const gitProviders = {
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
    rootFix: '/~/blob',
    raw: 'https://gitlab.com/',
    apiFix: 'api/v4',
    fix: '/-/raw/'
    // root: 'https://gitlab.com/jailbreak/jailbreak.paris/ -/blob/ master/package.json'
    // raw:  'https://gitlab.com/jailbreak/jailbreak.paris/ -/raw/  master/package.json',
  }
}

export const buildApiRoots = (gitInfos) => {
  let apiRepo, apiFile, apiFileBase, apiFileRaw
  if (gitInfos.provider === 'github') {
    // cf : https://docs.github.com/en/rest/reference/repos#contents
    apiRepo = `${gitInfos.api}/repos/${gitInfos.orga}/${gitInfos.repo}`
    apiFileBase = `${apiRepo}/contents/${gitInfos.filepath}`
    apiFile = `${apiFileBase}?ref=${gitInfos.branch}`
    apiFileRaw = `${gitInfos.rawRoot}${gitInfos.filepath}`
  } else {
    // cf : https://docs.gitlab.com/ee/api/repository_files.html
    const URIrepo = encodeURIComponent(`${gitInfos.orga}/${gitInfos.repo}`)
    const URIfilepath = encodeURIComponent(gitInfos.filepath)
    apiRepo = `${gitInfos.api}/projects/${URIrepo}`
    apiFileBase = `${apiRepo}/repository/files/${URIfilepath}`
    apiFile = `${apiFileBase}?ref=${gitInfos.branch}`
    apiFileRaw = `${apiFileBase}/raw?ref=${gitInfos.branch}`
  }
  return {
    repo: apiRepo,
    file: apiFile,
    fileRaw: apiFileRaw
  }
}

export const extractGitInfos = (str) => {
  // console.log('\nU > utilsGitUrl > extractGitInfos > str : ', str)
  let provider, orga, repo, branch, rawRoot, publicRoot, remaining, api
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
  } else {
    provider = 'gitlab'
    gitRef = gitProviders.gitlab
    const urlCut = str.split('//')
    const host = urlCut[1].split('/')[0]
    trimmed = str.replace(gitRef.root, '')
    split = trimmed.split('/')
    orga = split[0]
    repo = split[1]
    branch = split[4]
    remaining = split.splice(5).join('/')
    api = `https://${host}/${gitRef.apiFix}`
  }

  rawRoot = `${gitRef.raw}${orga}/${repo}`
  const publicRootUrl = `${gitRef.root}${orga}/${repo}`

  if (orga === 'github') {
    rawRoot = `${rawRoot}${gitRef.fix}/${branch}/`
    publicRoot = `${publicRootUrl}${gitRef.rootFix}/${branch}/`
  } else {
    rawRoot = `${rawRoot}${gitRef.fix}/${branch}/`
    publicRoot = `${publicRootUrl}${gitRef.rootFix}/${branch}/`
  }

  // if file in remaining string
  if (remaining !== '') {
    const file = remaining.split('/')
    filefullname = remaining.split('/')[file.length - 1]
    const filenameArray = filefullname.split('.')
    filename = filenameArray.slice(0, -1).join()
    filetype = filenameArray[filenameArray.length - 1]
  }

  const gitInfos = {
    id: str,
    uuid: undefined,
    provider: provider,
    api: api,
    orga: orga,
    repo: repo,
    branch: branch || 'master',
    repoUrl: publicRootUrl,
    rawRoot: rawRoot,
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

  return gitInfos
}

export const buildGitRequestOptions = (method, provider, token, body = undefined) => {
  console.log('\nU > utilsGitUrl > buildGitRequestOptions > method : ', method)
  console.log('U > utilsGitUrl > buildGitRequestOptions > provider : ', provider)
  console.log('U > utilsGitUrl > buildGitRequestOptions > token : ', token)
  console.log('U > utilsGitUrl > buildGitRequestOptions > body : ', body)
  const requestOptions = {
    method: method
  }
  // build headers
  let authHeader = {}
  switch (provider) {
    case 'gitlab':
      authHeader = { 'PRIVATE-TOKEN': token }
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

export async function buildPostBranchUrl (gitObj, sourceBranch, newBranch, token = undefined) {
  let errors
  let urlPostBranch
  let prePostRequestUrl, prePostResponse, prePostResponseData, revisionHash
  let postBody
  switch (gitObj.provider) {
    case 'gitlab':
      prePostRequestUrl = `${gitObj.apiRepo}/repository/branches/${sourceBranch}`
      console.log('U > utilsGitUrl > buildPostBranchUrl > gitlab > prePostRequestUrl : ', prePostRequestUrl)

      prePostResponse = await fetch(prePostRequestUrl)
      console.log('U > utilsGitUrl > buildPostBranchUrl > gitlab > prePostResponse : ', prePostResponse)
      prePostResponseData = await prePostResponse.json()
      console.log('U > utilsGitUrl > buildPostBranchUrl > gitlab > prePostResponseData : ', prePostResponseData)

      urlPostBranch = `${gitObj.apiRepo}/repository/branches?branch=${newBranch}&ref=${sourceBranch}`
      break
    case 'github':
      // cf : https://stackoverflow.com/questions/9506181/github-api-create-branch#:~:text=So%20it%20should%20be%20possible,heads%20'%20in%20the%20ref%20parameter.&text=Find%20the%20revision%20you%20want%20to%20branch%20from.&text=You%20will%20need%20to%20use,your%20branch%20will%20be%20created!
      // GET from : https://api.github.com/repos/<AUTHOR>/<REPO>/git/refs/heads

      // build url for prePostRequest
      prePostRequestUrl = `${gitObj.apiRepo}/git/refs/heads/${sourceBranch}`
      // console.log('U > utilsGitUrl > buildPostBranchUrl > github > prePostRequestUrl : ', prePostRequestUrl)

      // TO DO - CATCH IF BRANCH ALREADY EXISTS

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
    body: postBody,
    errors: errors
  }
}
