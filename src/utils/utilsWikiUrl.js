import { authorizedFileTypes as fileTypes } from '@/utils/fileTypesUtils.js'

export const extractWikiInfos = (str) => {
  // console.log('\nU > utilsGitUrl > extractGitInfos > str : ', str)
  let provider, orga, repo, rawRoot, publicRoot, remaining, api
  // let gitRef, trimmed, split, rawUrl
  let filefullname, filename, filetype

  // provider = 'wikidata'
  // gitRef = gitProviders.gitlab
  // const urlCut = str.split('//')
  // const host = urlCut[1].split('/')[0]
  // trimmed = str.replace(gitRef.root, '')
  // split = trimmed.split('/')
  // orga = split[0]
  // repo = split[1]
  // branch = split[4]
  // remaining = split.splice(5).join('/')
  // api = `https://${host}/${gitRef.apiFix}`

  // if (str.startsWith(gitProviders.github.root) || str.startsWith(gitProviders.github.raw)) {
  //   provider = 'github'
  //   gitRef = gitProviders.github
  //   rawUrl = str.startsWith(gitRef.raw)
  //   trimmed = rawUrl ? str.replace(gitRef.raw, '') : str.replace(gitRef.root, '')
  //   split = trimmed.split('/')
  //   orga = split[0]
  //   repo = split[1]
  //   branch = rawUrl ? split[2] : split[3]
  //   remaining = rawUrl ? split.splice(3).join('/') : split.splice(4).join('/')
  //   api = gitRef.apiFix
  // } else {
  // }

  // rawRoot = `${gitRef.raw}${orga}/${repo}`
  // const publicRootUrl = `${gitRef.root}${orga}/${repo}`
  // let fileraw

  // if (orga === 'github') {
  //   rawRoot = `${rawRoot}${gitRef.fix}/${branch}/`
  //   publicRoot = `${publicRootUrl}${gitRef.rootFix}/${branch}/`
  //   // https://raw.githubusercontent.com/multi-coop/gitribute-content-test/main/texts/markdown/jailbreak-devient-multi-fr.md
  //   fileraw = `${rawRoot}${remaining}`
  // } else {
  //   rawRoot = `${rawRoot}${gitRef.fix}/${branch}/`
  //   publicRoot = `${publicRootUrl}${gitRef.rootFix}/${branch}/`
  //   // https://gitlab.com/multi-coop/gitribute-content-test/-/raw/main/texts/markdown/test-file-gitribute-fr.md
  //   fileraw = `${rawRoot}${remaining}`
  // }

  // // if file in remaining string
  // if (remaining !== '') {
  //   const file = remaining.split('/')
  //   filefullname = remaining.split('/')[file.length - 1]
  //   const filenameArray = filefullname.split('.')
  //   filename = filenameArray.slice(0, -1).join()
  //   filetype = filenameArray[filenameArray.length - 1]
  // }

  const wikiInfos = {
    id: str,
    uuid: undefined,
    provider: provider,
    api: api,
    orga: orga,
    repo: repo,
    // branch: branch || 'master',
    // repoUrl: publicRootUrl,
    rawRoot: rawRoot,
    // fileraw: fileraw,
    publicRoot: publicRoot,
    filepath: remaining,
    filename: filename,
    filetype: filetype,
    filefamily: (fileTypes[filetype] && fileTypes[filetype].family) || 'other',
    filefullname: filefullname
  }
  // const apiRoots = buildApiRoots(wikiInfos)
  // wikiInfos.apiRepo = apiRoots.repo
  // wikiInfos.apiFile = apiRoots.file
  // wikiInfos.apiFileRaw = apiRoots.fileRaw

  console.log('\nU > utilsGitUrl > extractGitInfos > wikiInfos : ', wikiInfos)

  return wikiInfos
}
