
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
