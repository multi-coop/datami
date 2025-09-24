import Papa from 'papaparse'

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

export const dblQuotesDatami = '~~datami-quotes~~'
export const breaklineDatami = '~~datami-br~~'

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
export const csvToJson = (
  text,
  separator = ',',
  quoteChar = '"',
  headers = undefined,
  schema = undefined
) => {
  const parseOptions = {
    delimiter: separator,
    quoteChar: quoteChar,
    header: !headers, // If headers not provided, parse header row from CSV
    skipEmptyLines: true
  }

  // First parse
  const result = Papa.parse(text, parseOptions)

  // Handle custom headers
  const actualHeaders = headers ?? result.meta.fields

  // Normalize rows
  return result.data.map((row) => {
    return actualHeaders.reduce((acc, key, i) => {
      let val = row[key] ?? ''
      const headerSchema = schema?.fields?.find((f) => f.name === key)

      if (headerSchema?.type === 'number') {
        val = Number(val)
      } else if (headerSchema?.type === 'integer') {
        val = parseInt(val)
      }

      acc[key] = val
      return acc
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
  let lines = csvToJson(csvRaw, separator, quoteChar, headersArr, options.schema)
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
