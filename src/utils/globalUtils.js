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
  // debug && console.log('U > globalUtils > findFromPath > path : ', path)
  // debug && console.log('U > globalUtils > findFromPath > obj : ', obj)
  const props = Array.isArray(path) ? path : path.split(separator)
  // debug && console.log('U > globalUtils > findFromPath > props : ', props)
  const result = props.reduce((prev, curr) => {
    // debug && console.log('\nU > ... > globalUtils > findFromPath > prev : ', prev)
    // debug && console.log('U > ... > globalUtils > findFromPath > curr : ', curr)
    const temp = prev && prev[curr]
    // debug && console.log('U > ... > globalUtils > findFromPath > temp : ', temp)
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

export const booleanFromValue = (val, field = undefined) => {
  // console.log('U > booleanFromValue > val : ', val)
  // console.log('U > booleanFromValue > field : ', field)
  let bool
  const valTrimmed = val && val.toString().trim().toLowerCase()

  const booleanOptions = field && field.booleanOptions
  if (booleanOptions) {
    // in case there are boolean options
    bool = val === booleanOptions.true.value
  } else {
    // default case
    if (FalseBooleanStrings.includes(valTrimmed)) {
      bool = false
    } else {
      bool = Boolean(valTrimmed)
    }
  }
  return bool
}

export const trimText = (str, maxLength = 25) => {
  if (str && str.length > maxLength) return `${str.slice(0, maxLength)}...`
  else return str
}

export const stringToColor = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF
    color += ('00' + value.toString(16)).substr(-2)
  }
  return color
}

export const getContrastYIQ = (hexcolor) => {
  hexcolor = hexcolor.replace('#', '')
  const r = parseInt(hexcolor.substr(0, 2), 16)
  const g = parseInt(hexcolor.substr(2, 2), 16)
  const b = parseInt(hexcolor.substr(4, 2), 16)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
  return (yiq >= 128) ? 'black' : 'white'
}

// NUMBERS UTILS
export const range = (max, min = 0, step = 1) => {
  const arr = []
  for (let i = min; i <= max; i += step) {
    arr.push(i)
  }
  return arr
}

// AGGREGATION UTILS
export const groupByField = (items, groupKey) => {
  const groups = items.reduce((group, item) => {
    const name = item[groupKey]
    const index = group.findIndex(grp => grp.name === name)
    if (index !== -1) {
      group[index].items.push(item)
    } else {
      group.push({
        name: name,
        items: [item]
      })
    }
    return group
  }, [])
  return groups
}

export const aggregateByField = (items, field, aggregationtype = 'countitems') => {
  // console.log('\nU > globalUtils > aggregateByField > field : ', field)
  // console.log('U > globalUtils > aggregateByField > items : ', items)
  const aggregationKey = field.field
  const isTags = field.subtype === 'tags'
  // console.log('U > globalUtils > aggregateByField > isTags : ', isTags)

  const aggregated = items.reduce((series, item) => {
    // console.log('\nU > globalUtils > aggregateByField > item : ', item)
    const name = item[aggregationKey]
    // console.log('U > globalUtils > aggregateByField > name : ', name)

    let index

    if (!isTags) {
      index = series.findIndex(grp => grp.name === name)
      // console.log('U > globalUtils > aggregateByField > index : ', index)
      if (index !== -1 && aggregationtype === 'countitems') {
        series[index].data += 1
      } else {
        series.push({
          name: name,
          data: 1
        })
      }
    } else {
      const vals = name.split(field.tagSeparator)
      // console.log('U > globalUtils > aggregateByField > vals : ', vals)
      vals.forEach(v => {
        const i = series.findIndex(grp => grp.name === v)
        if (i !== -1 && aggregationtype === 'countitems') {
          series[i].data += 1
        } else {
          series.push({
            name: v,
            data: 1
          })
        }
      })
    }

    // console.log('U > globalUtils > aggregateByField > series : ', series)
    return series
  }, [])
  // console.log('...U > globalUtils > aggregateByField > aggregated : ', aggregated)
  return aggregated
}
