export const separators = [
  { separator: ',', name: 'comma' },
  { separator: '|', name: 'pipe' },
  { separator: ';', name: 'semicolon' },
  { separator: '\t', name: 'tab' }
]

/**
 * @typedef {Object} options
 * @property {string} separator
 * @property {string} tagseparator
 * @property {boolean} asJson
**/

export const defaultCsvOptions = {
  separator: ';',
  tagseparator: '-',
  asJson: false
}

export const dblQuotesGitribute = '~~gitribute-quotes~~'
export const breaklineGitribute = '~~gitribute-br~~'

// cf : https://stackoverflow.com/questions/28543821/convert-csv-lines-into-javascript-objects

/**
 * parseLine takes a string parses it as a lien object
 * @param  {string} line string equivalent to a line content encoded as JSON
 * @return {object}      line as an object
 **/
export const parseLine = (line) => JSON.parse(`[${line}]`)

/**
 * @typedef {Object} csv
 * @property {Object} headers The csv headers
 * @property {Object} data The csv data
**/

// cf : https://stackoverflow.com/questions/59218548/what-is-the-best-way-to-convert-from-csv-to-json-when-commas-and-quotations-may
/**
 * Takes a raw CSV string and converts it to a JavaScript object.
 * @param {string} text The raw CSV string.
 * @param {string} separator A character to use between columns.
 * @param {string} quoteChar A character to use as the encapsulating character.
 * @param {string[]} headers An optional array of headers to use. If none are
 * given, they are pulled from the first line of `text`.
 * @returns {object[]} An array of JavaScript objects containing headers as keys
 * and row entries as values.
 */
export const csvToJson = (text, separator = ',', quoteChar = '"', headers = undefined) => {
  // console.log('\nU > csvToJson > headers : ', headers)
  // console.log('U > csvToJson > quoteChar : ', quoteChar)
  // console.log('U > csvToJson > text : ', text)

  const dblQuoteChar = quoteChar.repeat(2) // `${quoteChar}${quoteChar}`

  // replace dblQuotes
  let textClean = text.replaceAll(dblQuoteChar, dblQuotesGitribute)
  // console.log('U > csvToJson > textClean (start) : ', textClean)

  // prepare regex
  const quotesRegex = new RegExp(`(${quoteChar}.*?${quoteChar})`)
  const regex = new RegExp(`\\s*(${quoteChar})?(.*?)\\1\\s*(?:${separator}|$)`, 'gs')
  // console.log('\nU > csvToJson > quotesRegex : ', quotesRegex)

  // textClean with single quoteChar without linebreaks
  textClean = textClean.split(quotesRegex)
  // console.log('\nU > csvToJson > textClean (A) : ', textClean)
  textClean = textClean.map(item => {
    const s = item.includes(quoteChar) ? item.replace('\n', breaklineGitribute) : item
    return s
  })
  // console.log('\nU > csvToJson > textClean (B) : ', textClean)
  textClean = textClean.join('')
  // console.log('\nU > csvToJson > textClean (C) : ', textClean)

  const match = line => {
    const matches = [...line.matchAll(regex)].map(m => m[2])
    matches.pop() // cut off blank match at the end
    return matches
  }

  let lines = textClean.split('\n')
  // filter empty lines
  lines = lines.filter(l => l !== '')
  const heads = headers ?? match(lines.shift())
  // console.log('U > csvToJson > lines : ', lines)
  // console.log('U > csvToJson > heads : ', heads)

  return lines.map(line => {
    return match(line).reduce((acc, cur, i) => {
      // Attempt to parse as a number; replace blank matches with `false` (or `null`)
      let val = cur.length === 0 ? null : cur
      // const val = cur.toString()
      // Put back quotes and breaklines indicators in cells
      val = Number(cur) || cur.replaceAll(dblQuotesGitribute, quoteChar).replaceAll(breaklineGitribute, '\n')
      const key = heads[i] ?? `extra_${i}`
      return { ...acc, [key]: val }
    }, {})
  })
}

/**
 * Takes an array of objects and a dict of keys
 * @param {object[]} arr An array of objects as { header_label : value }
 * @param {object} headers The headers object as { header_index : header_label }
 * @returns {object[]} An array of JavaScript objects containing headers as header_index
 * and row entries as values, as { header_index : value }.
 */
export const changeKeyObjects = (arr, headers) => {
  // console.log('\nU > changeKeyObjects > arr : ', arr)
  // console.log('U > changeKeyObjects > headers : ', headers)
  return arr.map(item => {
    const newItem = {}
    Object.keys(headers).forEach(key => {
      newItem[key] = item[headers[key]]
    })
    return newItem
  })
}

/**
 * csvToObject takes a string parses it as a lien object
 * @param  {string} csvRaw string equivalent to csv content
 * @param  {options} options object containing the options to parse csv content
 * @return {csv} csv as an object
**/
export const csvToObject = (csvRaw, options = defaultCsvOptions) => {
  // console.log('\nU > csvToObject > options : ', options)
  // console.log('U > csvToObject > csvRaw : \n', csvRaw)

  const separator = options.separator || ','
  const quoteChar = options.quoteChar || '"'
  let headersArr

  // split data into lines
  const headerLine = csvRaw.split('\n')[0].trim()
  // console.log('U > csvToObject > headerLine : ', headerLine)

  // use csvToJson function
  let lines = csvToJson(csvRaw, separator, quoteChar, headersArr)
  // console.log('U > csvToObject > lines (A) : ', lines)

  // get headers
  if (options.asJson) {
    headersArr = parseLine(headerLine)
  } else {
    headersArr = headerLine.split(separator)
  }
  // console.log('U > csvToObject > headersArr : ', headersArr)

  const headers = { ...headersArr }
  // console.log('U > csvToObject > headers : ', headers)

  lines = changeKeyObjects(lines, headers)
  // console.log('U > csvToObject > lines (B) : ', lines)

  // add id to each line
  const objects = lines.map((line, index) => {
    const lineWithId = {
      ...line,
      ...{ id: index.toString() }
    }
    return lineWithId
  })
  // console.log('U > csvToObject > headers : ', headers)
  // console.log('U > csvToObject > objects : ', objects)

  // return csv object
  const csv = {
    headers: headers,
    data: objects
  }

  return csv
}

/**
 * ObjectToCsv takes headers infos and data to build a string corresponding to a raw csv
 * @param  {headers} headers Array of headers
 * @param  {data} data Array of objects
 * @param  {options} options object containing the options to parse csv content
 * @return {csv} csv as an object
**/
export const ObjectToCsv = (headers, data, options = defaultCsvOptions, quoteChar = '"') => {
  // console.log('\nU > ObjectToCsv > headers : \n', headers)
  // console.log('U > ObjectToCsv > data : \n', data)
  // console.log('U > ObjectToCsv > options : ', options)

  const dblQuoteChar = quoteChar.repeat(2) // `${quoteChar}${quoteChar}`
  let csvOut = ''

  // build headers - 1st line
  const headersLabels = headers.map(h => h.label).join(options.separator)
  csvOut += `${headersLabels}\n`
  // console.log('U > ObjectToCsv > csvOut : ', csvOut)

  // build rows
  data.forEach(d => {
    // console.log('U > ObjectToCsv > d : ', d)
    const dataStr = headers
      .map(h => {
        let val = d[h.field]
        const hasSep = val && val.toString().includes(options.separator)
        const hasQuotesIn = val && val.toString().includes(quoteChar)
        // const hasBreaklineIn = val && val.toString().includes('\n')
        const addQuotesExt = hasSep ? quoteChar : ''
        val = hasQuotesIn ? val.replaceAll(quoteChar, dblQuoteChar) : val
        const valStr = `${addQuotesExt}${val}${addQuotesExt}`
        return valStr
      })
      .join(options.separator)
    csvOut += `${dataStr}\n`
  })

  return csvOut
}
