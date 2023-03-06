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

  // nullify nested langagues dicts
  const dictsNulls = dicts.map(d => nullOnNested(d))
  const nestedKeys = deepAssign({}, ...dictsNulls)
  const allKeysNested = objectPaths(nestedKeys, true)

  // build concatenate dicts
  const allLanguages = Object.fromEntries(allKeysNested.map(k => {
    const keyDict = Object.fromEntries(locales.map(l => {
      const dictObj = languages.find(lang => lang.locale === l)
      const def = findFromPath(k, dictObj.dict)
      return [l, def]
    }))
    return [k, keyDict]
  }))

  return allLanguages
}

const availableLanguaguages = [
  {
    locale: 'fr',
    label: 'Français',
    i18nCode: 'fr-FR',
    dict: fr
  },
  {
    locale: 'en',
    label: 'English',
    i18nCode: 'en-EN',
    dict: en
  }
]
export const allowedLanguages = availableLanguaguages
  .map(l => {
    return {
      locale: l.locale,
      label: l.label,
      i18nCode: l.i18nCode
    }
  })
  .sort((a, b) => (a.label > b.label) ? 1 : -1)

export const dicts = buildDict(availableLanguaguages)

export const translate = (key, locale, params = undefined, debug = false) => {
  // debug && console.log('\nU > utilsTranslations > G > getTranslation > key : ', key)
  // debug && console.log('U > utilsTranslations > G > getTranslation > locale : ', locale)
  // debug && console.log('U > utilsTranslations > G > getTranslation > params : ', params)
  if (!dicts[key]) return key
  if (dicts[key]) {
    let translated = dicts[key][locale] || key
    if (params) {
      for (const key in params) {
        const reg = new RegExp(`{{${key}}}`, 'g')
        translated = translated.replace(reg, params[key])
      }
    }
    return translated
  }
}

export const localeValue = (value, locale, round = undefined) => {
  // cf : https://github.com/TiagoDanin/Locale-Codes
  const loc = availableLanguaguages.find(l => l.locale === locale) || availableLanguaguages[0]
  const rounder = {}
  if (round) {
    rounder.minimumFractionDigits = round.digits
  }
  return Number(value).toLocaleString(loc.i18nCode, rounder)
}
