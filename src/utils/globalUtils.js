// OBJECTS UTILS

export const nullOnNested = (val, def = '') => {
  return Object.keys(val).reduce((acc, key) => {
    const reset = (acc[key] = val[key] === Object(val[key]) ? nullOnNested(val[key], def) : def, acc)
    return reset
  }, {})
}

export const objectPaths = (obj, onlyValuesPath = false, prefix = '', store = [], separator = '.') => {
  for (const key in obj) {
    let nextPath
    const curPath = `${prefix}${key}`
    if (typeof obj[key] === 'object') {
      nextPath = `${prefix}${key}${separator}`
      if (!onlyValuesPath) { store.push(curPath) }
      objectPaths(obj[key], onlyValuesPath, nextPath, store, separator)
    } else {
      store.push(curPath)
    }
  }
  return store
}

export const deepAssign = (target, ...sources) => {
  for (const source of sources) {
    for (const k in source) {
      const vs = source[k]; const vt = target[k]
      if (Object(vs) === vs && Object(vt) === vt) {
        target[k] = deepAssign(vt, vs)
        continue
      }
      target[k] = source[k]
    }
  }
  return target
}

export const findFromPath = (path, obj, debug = false, separator = '.') => {
  debug && console.log('U > globalUtils > findFromPath > path : ', path)
  debug && console.log('U > globalUtils > findFromPath > obj : ', obj)
  const props = Array.isArray(path) ? path : path.split(separator)
  debug && console.log('U > globalUtils > findFromPath > props : ', props)
  const result = props.reduce((prev, curr) => {
    debug && console.log('\nU > ... > globalUtils > findFromPath > prev : ', prev)
    debug && console.log('U > ... > globalUtils > findFromPath > curr : ', curr)
    const temp = prev && prev[curr]
    debug && console.log('U > ... > globalUtils > findFromPath > temp : ', temp)
    return temp
  }, obj)
  debug && console.log('\nU > globalUtils > findFromPath > result : ', result)
  return result
}

export const setFromPath = (obj, path, value, separator = '.') => {
  const pathArray = path.split(separator)
  const pathArrayLength = pathArray.length
  return pathArray.reduce((o, p, i) => {
    o[p] = pathArrayLength === ++i ? value : o[p] || {}
    return o[p]
  }, obj)
}

// DEBOUNCE UTILS

export function debounce (fn, delay = 500) {
  // cf : https://stackoverflow.com/questions/42199956/how-to-implement-debounce-in-vue2
  // console.log('\nU > globalUtils > debounce > fn : ', fn)
  // console.log('U > globalUtils > debounce > delay : ', delay)
  let timeoutID = null
  return function () {
    clearTimeout(timeoutID)
    const args = arguments
    const that = this
    timeoutID = setTimeout(function () {
      fn.apply(that, args)
    }, delay)
  }
}

// PAGINATION UTILS

export const itemsPerPageChoicesTable = [3, 5, 10, 15, 20, 25, 50, 100]
export const itemsPerPageChoicesCards2perRow = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
export const itemsPerPageChoicesCards3perRow = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
export const itemsPerPageChoicesCards4perRow = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40]

export const getClosest = (array, goal) => {
  // https://stackoverflow.com/questions/8584902/get-the-closest-number-out-of-an-array
  return array.reduce((prev, curr) => {
    return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev)
  })
}

export const paginate = (array, pageSize, pageNumber) => {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
}

// TEXT UTILS
export const defaultTagsSeparator = '-'

export const FalseBooleanStrings = [
  'no',
  'non',
  'niet',
  'nope',
  'nein',
  'n',
  'nan',
  'no way',
  'mé non',
  'pas question',
  'jamais de la vie',
  'no f***ing way',
  'naaa',
  'no no no',
  'no means no',
  'false',
  '0'
]

export const booleanFromValue = (val) => {
  // console.log('U > booleanFromValue > val : ', val)
  const valTrimmed = val && val.toString().trim().toLowerCase()
  let bool = Boolean(valTrimmed)
  if (FalseBooleanStrings.includes(valTrimmed)) {
    bool = false
  }
  return bool
}

export const trimText = (str, maxLength = 25) => {
  if (str && str.length > maxLength) return `${str.slice(0, maxLength)}...`
  else return str
}

export const stringToColour = (str) => {
  const colour = 'white'
  return colour
}

export const getContrastYIQ = (hexcolor) => {
  hexcolor = hexcolor.replace('#', '')
  const r = parseInt(hexcolor.substr(0, 2), 16)
  const g = parseInt(hexcolor.substr(2, 2), 16)
  const b = parseInt(hexcolor.substr(4, 2), 16)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
  return (yiq >= 128) ? 'black' : 'white'
}
