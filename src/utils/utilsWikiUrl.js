import { authorizedFileTypes as fileTypes } from '@/utils/fileTypesUtils.js'

/**
 * GOAL : fetch every ressource from such page :
 * https://wiki.lafabriquedesmobilites.fr/wiki/Sp%C3%A9cial:WfExplore?title=Sp%C3%A9cial%3AWfExplore&page=1&wf-expl-Category-Commun=on&wf-expl-Page_creator-fulltext=&wf-expl-Tags=
 * https://wiki.lafabriquedesmobilites.fr/wiki/Compte_Mobilit%C3%A9_Standardis%C3%A9#Suivre_les_travaux
/**
 * @typedef {WikiData}
 * @property {string} title Title of the page
 * @property {string} image_url URL of the main image of the page
 * @property {string} description Short description of the page
 *
 *
 **/

// export function wait(milliseconds) {
//   return new Promise(resolve => {
//     setTimeout(resolve, milliseconds)
//   })
// }

export async function delayFetch (url, options) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fetch(url, options))
    }, options.delay)
  })
}

export const buildWikiRequestOptions = (method = 'GET') => {
  const userAgent = window.navigator.userAgent
  const options = {
    method: method,
    headers: {
      'User-Agent': `${userAgent} Datami/1.0 (https://datami.multi.coop; datami@multi.coop)`
    },
    delay: 3000
  }
  return options
}

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
  const reqOpts = buildWikiRequestOptions()

  try {
    response = await delayFetch(apiUrl, reqOpts)
    // response = await fetch(apiUrl, reqOpts)
    queryResult = await response.json()
    pages = await queryResult.query.pages
  } catch (error) {
    // console.log(error)
    console.log('U > utilsWikiUrl > fetchMediaWikiData > error : ', error)
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

export const objectFromWikitext = (wikitext) => {
  const headers = []
  const obj = {}
  let splitted = wikitext && wikitext.split('\n|')
  splitted = splitted && splitted.slice(1, splitted.length)
  splitted && splitted.forEach(i => {
    const iSplit = i.split('=')
    headers.push(iSplit[0])
    obj[iSplit[0]] = iSplit[1]
  })
  return {
    parted: extractWikitextPartGen(wikitext),
    headers: headers,
    data: obj
  }
}

export const extractWikitextPartGen = (content) => {
  const regex = /[\n]|(.*)=(.*)/
  const part = content && content.split(regex)
  return part
}

export const extractWikitextPart = (key, content) => {
  const regex = new RegExp(`\\|${key}=(.*)`)
  const part = content && content.match(regex)
  return part && part[1]
}

export const extractDescription = (content) => {
  // const regex = /^\|shortDescription=(.*)$/
  const regex = /\|shortDescription=(.*)/
  const description = content && content.match(regex)
  return description[1] ?? ''
}

export const extractImageName = (content) => {
  const regex = /\|Main_Picture=(.*)/
  const imageName = content && content.match(regex)
  return imageName[1] ?? ''
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

export const extractWikiInfos = (urlStr, options) => {
  // cf https://www.mediawiki.org/wiki/API:Categorymembers#Example_1:_List_twenty_pages_in_a_category
  // console.log('\nU > utilsWikiUrl > extractWikiInfos > urlStr : ', urlStr)
  // console.log('U > utilsWikiUrl > extractWikiInfos > options : ', options)

  const filetype = 'wiki'
  const provider = 'mediawiki'

  // let orga, repo, rawRoot, publicRoot, remaining, api
  // let gitRef, trimmed, split, rawUrl
  // let filefullname, filename

  const apiRoot = extractApiEndpoint(urlStr)
  // console.log('U > utilsWikiUrl > extractWikiInfos > apiRoot : ', apiRoot)

  let apiUrl = `${apiRoot}`
  apiUrl += '?origin=*'
  let uniqueCategApiUrl = ''

  const categoriesApis = []

  const params = {
    action: 'query',
    utf8: '',
    list: 'categorymembers',
    // cmtitle: `Category:${options.category}`,
    cmlimit: 'max',
    formatversion: '2',
    format: 'json'
  }
  Object.keys(params)
    .forEach(key => { apiUrl += `&${key}=${params[key]}` })

  if (options.category) {
    params.cmtitle = `Category:${options.category}`
    uniqueCategApiUrl = `${apiUrl}&cmtitle=${params.cmtitle}`
    const uniqueCategApi = {
      category: options.category,
      apiUrl: `${apiUrl}&cmtitle=Category:${options.category}`
    }
    categoriesApis.push(uniqueCategApi)
  }
  if (options.categories) {
    options.categories.forEach(categ => {
      const categApi = {
        category: categ,
        apiUrl: `${apiUrl}&cmtitle=Category:${categ}`
      }
      categoriesApis.push(categApi)
    })
  }

  // Object.keys(params)
  //   .forEach(key => { apiUrl += `&${key}=${params[key]}` })
  // console.log('U > utilsWikiUrl > extractWikiInfos > apiUrl : ', apiUrl)

  const wikiInfos = {
    id: urlStr,
    uuid: undefined,
    provider: provider,

    hostname: hostname(urlStr),
    basename: basename(urlStr),
    pageTitle: extractPageTitle(urlStr),
    apiRoot: apiRoot,
    apiUrl: uniqueCategApiUrl,
    pageUrlRoot: `https://${hostname(urlStr)}/wiki/`,

    filename: hostname(urlStr),
    filefullname: `${hostname(urlStr)} => ${params.cmtitle}`,
    filetype: filetype,
    filefamily: (fileTypes[filetype] && fileTypes[filetype].family) || 'other',

    multipleCategories: categoriesApis

    // api: api,
    // orga: orga,
    // repo: repo,
    // branch: branch || 'master',
    // repoUrl: publicRootUrl,
    // rawRoot: rawRoot,
    // fileraw: fileraw,
    // publicRoot: publicRoot,
    // filepath: remaining,
    // filename: filename,
    // filefullname: filefullname
  }
  // const apiRoots = buildApiRoots(wikiInfos)
  // wikiInfos.apiRepo = apiRoots.repo
  // wikiInfos.apiFile = apiRoots.file
  // wikiInfos.apiFileRaw = apiRoots.fileRaw

  // console.log('\nU > utilsWikiUrl > extractGitInfos > wikiInfos : ', wikiInfos)

  return wikiInfos
}

export async function getMediawikiData (apiUrl, options = undefined) {
  let response, responseData, errors
  const reqOpts = buildWikiRequestOptions()

  try {
    // response = await fetch(apiUrl, reqOpts)
    response = await delayFetch(apiUrl, reqOpts)
    responseData = await response.json()
  } catch (error) {
    console.log('\nU > utilsWikiUrl > getMediawikiData > error : ', error)
    errors = [error]
  }

  return {
    data: responseData && responseData.query.categorymembers,
    dataRaw: responseData,
    errors: errors
  }
}

// export async function populateMediawikiItem (wikiInfosObject, items, options = undefined) {
//   console.log('\nU > utilsWikiUrl > populateMediawikiItem > wikiInfosObject : ', wikiInfosObject)
//   console.log('U > utilsWikiUrl > populateMediawikiItem > items : ', items)
//   console.log('U > utilsWikiUrl > populateMediawikiItem > options : ', options)

//   const results = []
//   for (const item of items) {
//     const data = await getMediawikiItem(wikiInfosObject, item, options)
//     results.push(data)
//   }
//   return results
// }

export async function getMediaWikiPage (wikiInfosObject, pageUrl, uuid, options = undefined) {
  // console.log('\nU > utilsWikiUrl > getMediaWikiPage > pageUrl : ', pageUrl)

  const apiRoot = wikiInfosObject.apiRoot
  const title = extractPageTitle(pageUrl)
  // console.log('U > utilsWikiUrl > getMediaWikiPage > title : ', title)
  const item = {
    id: uuid,
    pageId: undefined,
    title: title,
    ns: 0
  }
  let response, responseData, errors // , imageUrl
  let urlItemDetail = `${apiRoot}?origin=*`

  const params = {
    action: 'query',
    prop: 'revisions',
    titles: title,
    rvprop: 'content',
    rvslots: 'main',
    formatversion: '2',
    format: 'json'
  }
  Object.keys(params)
    .forEach(key => { urlItemDetail += `&${key}=${params[key]}` })
  // console.log('U > utilsWikiUrl > getMediaWikiPage > urlItemDetail : ', urlItemDetail)
  const reqOpts = buildWikiRequestOptions()

  try {
    // response = await fetch(urlItemDetail, reqOpts)
    response = await delayFetch(urlItemDetail, reqOpts)
    responseData = await response.json()
    // console.log('U > utilsWikiUrl > getMediaWikiPage > responseData : ', responseData)
    const pageData = responseData.query.pages[0]
    item.pageId = pageData.pageId
    item.title = pageData.title
    item.isLoaded = true
  } catch (error) {
    console.log('\nU > utilsWikiUrl > getMediaWikiPage > error : ', error)
    errors = [error]
    console.log('\nU > utilsWikiUrl > getMediaWikiPage > errors : ', errors)
  }

  // console.log('U > utilsWikiUrl > getMediaWikiPage > item : ', item)
  return extractWikiContent(wikiInfosObject, responseData, item, errors, options)
}

// Get items one by one
export async function getMediawikiItems (wikiInfosObject, items, wikiFields, options = undefined, extractPage = false) {
  const itemsToSend = []
  for (const item of items) {
    const pageData = await getMediawikiItem(wikiInfosObject, item, options)
    // console.log('C > utilsWikiUrl > getMediawikiItems > pageData : ', pageData)
    pageData.temp = restructurePageData(pageData, wikiFields)
    // console.log('C > utilsWikiUrl > getMediawikiItems > pageData.temp : ', pageData.temp)
    itemsToSend.push(pageData.temp)
  }
  return itemsToSend
}

// Get items by batch array
export async function getItemsByBatch (wikiInfosObject, itemsToLoad, wikiFields, options = undefined, extractPage = false) {
  // console.log('\nU > utilsWikiUrl > getItemsByBatch > itemsToLoad : ', itemsToLoad)
  // console.log('U > utilsWikiUrl > getItemsByBatch > options : ', options)

  const apiRoot = wikiInfosObject.apiRoot
  let response, responseBatchData, errors
  let urlItemsBatch = `${apiRoot}?origin=*`
  const params = {
    action: 'query',
    prop: 'revisions',
    pageids: itemsToLoad.join('|'),
    rvslots: 'main',
    rvprop: 'content',
    utf8: '',
    formatversion: '2',
    format: 'json'
  }

  Object.keys(params)
    .forEach(key => { urlItemsBatch += `&${key}=${params[key]}` })
  // console.log('U > utilsWikiUrl > getItemsByBatch > urlItemsBatch : ', urlItemsBatch)
  const reqOpts = buildWikiRequestOptions()

  // fetch items batch in one request
  try {
    // response = await fetch(urlItemsBatch, reqOpts)
    response = await delayFetch(urlItemsBatch, reqOpts)
    responseBatchData = await response.json()
    console.log('U > utilsWikiUrl > getItemsByBatch > responseBatchData : ', responseBatchData)
  } catch (error) {
    // console.log('\nU > utilsWikiUrl > getItemsByBatch > error : ', error)
    errors = [error]
  }

  const items = responseBatchData?.query.pages.map(pageResponse => {
    // console.log('\nU > utilsWikiUrl > getItemsByBatch > pageResponse : ', pageResponse)
    const pageData = extractWikiBatchContent(wikiInfosObject, pageResponse, errors, options)
    // console.log('\nU > utilsWikiUrl > getItemsByBatch > pageData : ', pageData)
    pageData.temp = restructurePageData(pageData, wikiFields)
    return pageData.temp
    // return pageResponse
  })
  // console.log('\nU > utilsWikiUrl > getItemsByBatch > items : ', items)

  // debugging
  // return {
  //   items: items,
  //   responseBatchData: responseBatchData,
  //   errors: errors
  // }
  // return await extractWikiContent(wikiInfosObject, responseData, item, errors, options)
  return items
}

export function extractWikiBatchContent (wikiInfosObject, pageData, errors, options) {
  // console.log('U > utilsWikiUrl > extractWikiBatchContent > pageData : ', pageData)
  // let pageData
  let imageUrl

  const content = pageData && (pageData.revisions[0].content || pageData.revisions[0].slots.main.content)
  // console.log('U > utilsWikiUrl > extractWikiBatchContent > content : ', content)

  // WIKITEXT TO OBJECT - HARD CODEED
  const fields = options.fields
  const structured = {}
  fields.forEach(field => {
    structured[field] = extractWikitextPart(field, content)
  })

  // WIKITEXT TO OBJECT - GENERIC
  const wikiContent = objectFromWikitext(content)

  // build image url
  if (wikiContent.data.Main_Picture) {
    const hostName = wikiInfosObject.hostname
    imageUrl = forgeImageUrl(hostName, wikiContent.data.Main_Picture)
  }

  return {
    id: pageData.pageid.toString(),
    pageId: pageData.pageid,
    pageUrl: `${wikiInfosObject.pageUrlRoot}${pageData.title.replace(' ', '_')}`,
    title: pageData.title,
    imageUrl: imageUrl,
    // responseData: responseData,
    item: pageData,
    content: content,
    structured: structured,
    // headers: wikiContent.headers,
    data: wikiContent.data,
    // parted: wikiContent.parted,
    errors: errors
  }
}

export async function getMediawikiItem (wikiInfosObject, item, options = undefined, extractPage = false) {
  // console.log('\nU > utilsWikiUrl > getMediawikiItem > item : ', item)
  // console.log('U > utilsWikiUrl > getMediawikiItem > options : ', options)
  const apiRoot = wikiInfosObject.apiRoot
  let response, responseData, errors
  let urlItemDetail = `${apiRoot}?origin=*`

  const params = {
    action: 'query',
    prop: 'revisions',
    // titles: item.title,
    pageids: item.pageid,
    rvslots: 'main',
    rvprop: 'content',
    utf8: '',
    formatversion: '2',
    format: 'json'
  }

  Object.keys(params)
    .forEach(key => { urlItemDetail += `&${key}=${params[key]}` })
  // console.log('U > utilsWikiUrl > getMediawikiItem > urlItemDetail : ', urlItemDetail)
  const reqOpts = buildWikiRequestOptions()

  try {
    response = await delayFetch(urlItemDetail, reqOpts)
    // response = await fetch(urlItemDetail, reqOpts)
    responseData = await response.json()
    // console.log('U > utilsWikiUrl > getMediawikiItem > responseData : ', responseData)
  } catch (error) {
    // console.log('\nU > utilsWikiUrl > getMediawikiData > error : ', error)
    errors = [error]
  }

  return await extractWikiContent(wikiInfosObject, responseData, item, errors, options)
}

export async function extractWikiContent (wikiInfosObject, responseData, item, errors, options) {
  // console.log('U > utilsWikiUrl > extractWikiContent > responseData : ', responseData)
  // let responseData
  let imageUrl

  const content = responseData && (responseData.query.pages[0].revisions[0].content || responseData.query.pages[0].revisions[0].slots.main.content)
  // console.log('U > utilsWikiUrl > extractWikiContent > content : ', content)

  // WIKITEXT TO OBJECT - HARD CODEED
  const fields = options.fields
  const structured = {}
  fields.forEach(field => {
    structured[field] = extractWikitextPart(field, content)
  })

  // WIKITEXT TO OBJECT - GENERIC
  const wikiContent = objectFromWikitext(content)

  // build image url
  if (wikiContent.data.Main_Picture) {
    const hostName = wikiInfosObject.hostname
    imageUrl = forgeImageUrl(hostName, wikiContent.data.Main_Picture)
  }
  /* example wikitext response :
  "{{Project
    |shortDescription=solutions digitales clé en main pour maîtriser et optimiser votre réseau de transport public
    |description=Solutions digitales agiles et puissantes organisées à partir de Smartphone ou de Tablette et du Cloud, en lieu et place de systèmes lourds, physiques et complexes, pour aider à maîtriser, sécuriser et optimiser les réseaux de transport scolaires (2School), interurbains, péri-urbains, petit et moyen urbain (2Place).  Véritables outils d’aides à la décision, collaboratifs, simples à déployer, ergonomiques, les outils sont réfléchis techniquement et économiquement pour répondre au besoin des territoires peu denses. Elles intéressent de plus en plus les territoires moyennement denses et sont porteuses de nombreuses efficiences économiques, environnementales et sociétales.  Ces solutions permettent de géolocaliser en temps réel des flottes de véhicules (SAE , Système d’aide à l’exploitation), suivre la fréquentation, gérer les titres de transport (Billettique) , aider le conducteur dans son service au quotidien, offrir des services aux usagers. Les données sont remontées dans le Cloud, traitées et réorganisées sous forme de statistiques dynamiques pour les acteurs du transport. Par exemple, suivre en temps réel l’avance/retard d’un véhicule, évaluer son taux de remplissage, connaître les montées par point d’arrêt, faciliter la gestion des recettes, connaître le nombre de km parcourus, informer les voyageurs des prochains horaires ou acheter un titre de transport sur une boutique en ligne.
    |location=France
    |url=https://www.ubitransport.com/une-suite-logicielle/ubitransport-solution-2-school/
    |Tags=autobus, smartphone, données
    |Theme=Voiture Connectée, Accessibilité dans les transports, Traces de mobilité et des données associées, Ecomobilité scolaire, Collectivité
    |from=UBI Transport
    |challenge=Accompagner une collectivité à ouvrir un maximum de ressources et construire un kit d'aide à l'innovation, Augmenter les connaissances partagées en cartographie et usages des véhicules et réseaux de transports
    |communauté d'intérêt=Communauté des Territoires et Collectivités, Communauté autour des traces de mobilité et des données associées
    |chat=https://chat.fabmob.io/channel/traces_mobilite
    |complement=Utilisation d’un outil connu et grand public, le Smartphone, transformé en outil de travail pour les collectivités et opérateurs de transport. Il est utilisé pour la première fois en association avec le Cloud dans l’univers de l'Aide à l’Exploitation et de la billettique pour un réseau de transport public.  Pour les territoires peu denses, ces solutions leur permettent enfin d’avoir accès à des services qui leur étaient jusqu’alors complètement fermés.  Pour les territoires à densité moyenne, les solutions sont plus complètes, abouties, fiables et donnent accés à des informations qu’ils n’avaient pas nécessairement ou pas en temps réel.  Pour les territoires à très forte densité, les solutions ne sont pas (encore) adaptées à leurs besoins. En revanche, elles permettent de connecter, de mailler ces « gros «  territoires  à leurs territoires voisins moyennement ou peu denses et ainsi de mieux organiser la chaîne de mobilité.
    |pageCo=https://www.communecter.org/#@2schoolEt2place }}"
  */

  return {
    id: item.id,
    pageId: item.pageid,
    pageUrl: `${wikiInfosObject.pageUrlRoot}${item.title.replace(' ', '_')}`,
    title: item.title,
    imageUrl: imageUrl,
    // responseData: responseData,
    item: item,
    content: content,
    structured: structured,
    // headers: wikiContent.headers,
    data: wikiContent.data,
    // parted: wikiContent.parted,
    errors: errors
  }
}

export const restructurePageData = (pageObj, wikiFields) => {
  const pageData = {
    id: pageObj.id,
    pageId: pageObj.pageId,
    pageUrl: pageObj.pageUrl,
    // structured: pageObj.structured,
    content: pageObj.content
  }
  Object.keys(wikiFields).forEach(k => {
    let pageObjValue
    const field = wikiFields[k]
    switch (field) {
      case 'title':
        pageObjValue = pageObj.title
        break
      case 'imageUrl':
        pageObjValue = pageObj.imageUrl
        break
      case 'pageUrl':
        pageObjValue = pageObj.pageUrl
        break
      default:
        pageObjValue = pageObj.structured[field]
    }
    pageData[k] = pageObjValue
  })
  return pageData
}
