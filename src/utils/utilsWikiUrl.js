import { authorizedFileTypes as fileTypes } from '@/utils/fileTypesUtils.js'

/**
 * @typedef {WikiData}
 * @property {string} title Title of the page
 * @property {string} image_url URL of the main image of the page
 * @property {string} description Short description of the page
 *
 *
 **/

/**
 * fetchMediaWikiData takes mediawiki URLs, and returns an array of objects with
 * data for each unique mediawiki page.
 *
 * @param  {Array<string>}   urls URLs of mediawiki pages from same host.
 * @return {Array<WikiData>}      Array of data objects
 *
 * Example usage:
 * fetchMediaWikiData([
 *   "https://wiki.lafabriquedesmobilites.fr/wiki/Compte_Mobilit%C3%A9_Standardis%C3%A9#Suivre_les_travaux",
 *   "https://wiki.lafabriquedesmobilites.fr/wiki/Crankshaft"
 * ]).then(result => {
 *   console.log(result)
 * })
 **/
export async function fetchMediaWikiData (urls) {
  let apiUrl = extractApiEndpoint(urls[0])
  let titles = extractPageTitle(urls[0])

  // Check that all urls are from the same mediawiki host
  urls.forEach(url => {
    if (apiUrl !== extractApiEndpoint(url)) {
      throw new Error('All urls should come from the same host')
    }
    titles += '|' + extractPageTitle(url)
  })

  const params = {
    action: 'query',
    prop: 'revisions',
    titles: titles,
    rvprop: 'content',
    rvslots: 'main',
    formatversion: '2',
    format: 'json'
  }

  apiUrl += '?origin=*'

  Object.keys(params)
    .forEach(key => { apiUrl += `&${key}=${params[key]}` })

  let response, queryResult, pages

  try {
    response = await fetch(apiUrl)
    queryResult = await response.json()
    pages = await queryResult.query.pages
  } catch (error) {
    console.log(error)
  }

  const results = []
  for (const p in pages) {
    const content = pages[p].revisions[0].slots.main.content
    const result = {}
    result.title = pages[p].title
    result.description = extractDescription(content)
    result.image_url = forgeImageUrl(hostname(apiUrl), extractImageName(content))
    results.push(result)
  }

  return results
}

export const extractDescription = (content) => {
  // const regex = /^\|shortDescription=(.*)$/
  const regex = /\|shortDescription=(.*)/
  const description = content.match(regex)
  return description[1]
}

export const extractImageName = (content) => {
  const regex = /\|Main_Picture=(.*)/
  const imageName = content.match(regex)
  return imageName[1]
}

/**
 * extractApiEndpoint takes a url to a mediawiki page and returns the url of
 * the api of the mediawiki.
 * @param {string} url
 *        URL of a mediawiki page
 * @return {string}
 *         URL of the mediawiki API
 **/
export const extractApiEndpoint = (url) => {
  return `https://${hostname(url)}/api.php`
}

/**
 * hostname extracts the host name of a given url string
 * @param  {string} url Any URL
 * @return {string}     Host name of the mediawiki page
 **/
export const hostname = (url) => {
  const urlObj = new URL(url)
  return urlObj.hostname
}

/**
 * extractPageTitle takes a URL to a mediawiki page and returns the title of
 * the page
 * @param  {string} url URL to a valid mediawiki page
 * @return {string}     Name of the mediawiki page (as written in the url)
 **/
export const extractPageTitle = (url) => {
  const urlObj = new URL(url)
  return basename(urlObj.pathname)
}

/**
 * basename takes a URL and returns its basename, i.e. its last segment.
 * @param  {string} url Any URL string
 * @return {string}     Basename of the URL
 **/
export const basename = (url) => {
  return url.substring(url.lastIndexOf('/') + 1)
}

/**
 * forgeImageUrl creates a link for a given file with its name and the host
 * name.
 **/
export const forgeImageUrl = (hostname, imageName) => {
  const imgUrl = new URL(`https://${hostname}/wiki/Special:Redirect/file/${imageName}`)
  return imgUrl.href
}

export const extractWikiInfos = (str) => {
  // console.log('\nU > utilsGitUrl > extractGitInfos > str : ', str)
  let orga, repo, rawRoot, publicRoot, remaining, api
  // let gitRef, trimmed, split, rawUrl
  let filefullname, filename, filetype

  const provider = 'wikidata'

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
