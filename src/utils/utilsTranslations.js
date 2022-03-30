import fr from '@/locales/fr.js'
import en from '@/locales/en.js'

export const buildDict = (languages) => {
  // console.log('\nU > utilsTranslations > languages : ', languages)

  const locales = languages.map(l => l.locale)
  const dicts = languages.map(l => l.dict)
  // console.log('U > utilsTranslations > locales : ', locales)
  // console.log('U > utilsTranslations > dicts : ', dicts)

  // get all dicts keys
  const allKeys = Object.keys(Object.assign({}, ...dicts))
  // console.log('U > utilsTranslations > allKeys : ', allKeys)

  // build concatenate dicts
  const allLanguages = Object.fromEntries(allKeys.map(k => {
    const keyDict = Object.fromEntries(locales.map(l => {
      const dictObj = languages.find(lang => lang.locale === l)
      // console.log('U > utilsTranslations > dictObj : ', dictObj)
      const def = dictObj.dict[k]
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

export const translate = (key, locale) => {
  // console.log('U > utilsTranslations > G > getTranslation > key : ', key)
  // console.log('U > utilsTranslations > G > getTranslation > locale : ', locale)
  if (!dicts[key]) return key
  if (dicts[key]) return dicts[key][locale] || key
}
