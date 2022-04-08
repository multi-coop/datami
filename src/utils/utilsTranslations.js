import { objectPaths, nullOnNested, deepAssign, findFromPath } from '@/utils/globalUtils.js'

import fr from '@/locales/fr.js'
import en from '@/locales/en.js'

export const insertLoc = (val, loc) => {
  return Object.keys(val).reduce((acc, key) => {
    const reset = (acc[key] = val[key] === Object(val[key]) ? insertLoc(val[key]) : null, acc)
    return reset
  }, {})
}

export const buildDict = (languages) => {
  // console.log('\nU > utilsTranslations > languages : ', languages)

  const locales = languages.map(l => l.locale)
  const dicts = languages.map(l => l.dict)
  // console.log('U > utilsTranslations > locales : ', locales)
  // console.log('U > utilsTranslations > dicts : ', dicts)

  // get all dicts keys
  // const allKeys = Object.keys(Object.assign({}, ...dicts))
  // console.log('U > utilsTranslations > allKeys : ', allKeys)

  // nullify nested langagues dicts
  const dictsNulls = dicts.map(d => nullOnNested(d))
  // console.log('U > utilsTranslations > dictsNulls : ', dictsNulls)
  const nestedKeys = deepAssign({}, ...dictsNulls)
  // console.log('U > utilsTranslations > nestedKeys : ', nestedKeys)
  const allKeysNested = objectPaths(nestedKeys, true)
  // console.log('U > utilsTranslations > allKeysNested : ', allKeysNested)

  // build concatenate dicts
  // const allLanguages = Object.fromEntries(allKeys.map(k => {
  //   const keyDict = Object.fromEntries(locales.map(l => {
  //     const dictObj = languages.find(lang => lang.locale === l)
  //     // console.log('U > utilsTranslations > dictObj : ', dictObj)
  //     const def = dictObj.dict[k]
  //     return [l, def]
  //   }))
  //   return [k, keyDict]
  // }))
  const allLanguages = Object.fromEntries(allKeysNested.map(k => {
    const keyDict = Object.fromEntries(locales.map(l => {
      const dictObj = languages.find(lang => lang.locale === l)
      // console.log('U > utilsTranslations > dictObj : ', dictObj)
      const def = findFromPath(k, dictObj.dict)
      return [l, def]
    }))
    return [k, keyDict]
  }))
  // console.log('U > utilsTranslations > allLanguages : ', allLanguages)

  return allLanguages
}

const availableLanguaguages = [
  {
    locale: 'fr',
    label: 'Français',
    dict: fr
  },
  {
    locale: 'en',
    label: 'English',
    dict: en
  }
]
export const allowedLanguages = availableLanguaguages
  .map(l => { return { locale: l.locale, label: l.label } })
  .sort((a, b) => (a.label > b.label) ? 1 : -1)

export const dicts = buildDict(availableLanguaguages)

export const translate = (key, locale, debug = false) => {
  // debug && console.log('\nU > utilsTranslations > G > getTranslation > key : ', key)
  // debug && console.log('U > utilsTranslations > G > getTranslation > locale : ', locale)
  if (!dicts[key]) return key
  if (dicts[key]) return dicts[key][locale] || key
  // const translation = findFromPath(key, dicts, debug)
  // debug && console.log('U > utilsTranslations > G > getTranslation > translation : ', translation)
  // if (!translation) return key
  // if (translation) return translation[locale] || key
}
