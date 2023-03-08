export const availableParams = [
  {
    param: 'datami_tab',
    type: 'int'
  },
  {
    param: 'datami_view',
    type: 'string',
    available: [
      'table',
      'map',
      'dataviz',
      'cards',
      'text',
      'md',
      'json'
    ]
  },
  {
    param: 'datami_edit',
    type: 'string',
    available: [
      'preview',
      'diff',
      'edit'
    ]
  },
  {
    param: 'datami_detail_id',
    type: 'string'
  },
  {
    param: 'datami_filter',
    type: 'string'
  },
  {
    param: 'datami_lon',
    type: 'number'
  },
  {
    param: 'datami_lat',
    type: 'number'
  },
  {
    param: 'datami_zoom',
    type: 'number'
  }
]

export const paramsToObject = (urlParams) => {
  const obj = {}
  for (const [key, value] of urlParams.entries()) {
    obj[key] = value
  }
  return obj
}

export const cleanParams = (paramsRaw, onlyDatamiParams = false) => {
  const params = onlyDatamiParams ? {} : paramsToObject(paramsRaw)
  availableParams.forEach(p => {
    if (paramsRaw.has(p.param)) {
      let canAdd = true
      let value = paramsRaw.get(p.param)
      switch (p.type) {
        case 'int':
          value = parseInt(value)
          break
        case 'number':
          value = parseFloat(value)
          break
        case 'string':
          if (p.available && !p.available.includes(value)) {
            canAdd = false
          }
          break
      }
      if (canAdd) { params[p.param] = value }
    }
  })
  return params
}

export const getUrlParams = () => {
  // console.log('\nU > utilsUrl > getParams > window.location : ', window.location)
  // console.log('U > utilsUrl > getParams > window.location : ', window.location.search)
  const urlParams = new URLSearchParams(window.location.search)
  // console.log('U > utilsUrl > getParams > urlParams : ', urlParams)
  const params = cleanParams(urlParams)
  return params
}

export const builUrlNewParams = (param, value) => {
  // console.log('\nU > utilsUrl > builUrlNewParams > param : ', param)
  // console.log('U > utilsUrl > builUrlNewParams > value : ', value)
  // console.log('U > utilsUrl > builUrlNewParams > window.location : ', window.location)
  // console.log('U > utilsUrl > builUrlNewParams > window.location.search : ', window.location.search)
  const urlParams = new URLSearchParams(window.location.search)
  if (value) {
    urlParams.set(param, value)
  } else {
    urlParams.delete(param)
  }
  // console.log('U > utilsUrl > builUrlNewParams > urlParams : ', urlParams)
  return {
    obj: cleanParams(urlParams, true),
    str: urlParams.toString()
  }
}

export const updateUrlParams = (paramString) => {
  // console.log('\nU > utilsUrl > updateUrlParams > paramString : ', paramString)
  const href = window.location.toString().replace(location.search, '')
  const newUrl = `${href}${href.endsWith('/') ? '?' : '/?'}${paramString}`
  // console.log('U > utilsUrl > updateUrlParams > newUrl : ', newUrl)
  if (typeof window.history.pushState !== 'undefined') {
    window.history.replaceState({}, null, newUrl)
  }
}
