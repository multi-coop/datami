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
 * csvToObject takes a string parses it as a lien object
 * @param  {string} csvRaw
 *          string equivalent to csv content
 * @param  {options} options
 *          object containing the options to parse csv content
 * @return {csv}
 *          csv as an object
**/
export const csvToObject = (csvRaw, options = defaultCsvOptions) => {
  // console.log('\nU > csvToObject > csvRaw : \n', csvRaw)
  // console.log('U > csvToObject > options : ', options)
  let headers, reduced

  // split data into lines
  const [headerLine, ...lines] = csvRaw.split('\n')

  // get headers
  if (options.asJson) {
    headers = parseLine(headerLine)
  } else {
    headers = headerLine.split(options.separator)
  }
  // headers = options.abstractHeaders ? { ...headers } : headers
  headers = { ...headers }
  // console.log('U > csvToObject > headers : ', headers)
  // console.log('U > csvToObject > lines : ', lines)

  // create object from parsing lines
  const objects = lines
    .filter(l => l !== '')
    .map((line, index) => {
      let lineParsed

      // parse line
      if (options.asJson) {
        lineParsed = parseLine(line)
      } else {
        lineParsed = line.split(options.separator)
      }
      // console.log(`U > csvToObject > ${index} - lineParsed : `, lineParsed)

      // reduce values array
      // if (options.abstractHeaders) {
      //   reduced = { ...lineParsed }
      // } else {
      //   reduced = lineParsed.reduce((ac, a, idx) => ({ ...ac, [headers[idx]]: a }), {})
      // }
      reduced = { ...lineParsed }

      // add row/line index
      reduced.id = index.toString()

      // console.log(`U > csvToObject > ${index} - reduced : `, reduced)
      // console.log('...')
      return reduced
    })

  // return csv object
  const csv = {
    headers: headers,
    data: objects
  }

  return csv
}

/**
 * ObjectToCsv takes headers infos and data to build a string corresponding to a raw csv
 * @param  {headers} headers
 *          Array of headers
 * @param  {data} data
 *          Array of objects
 * @param  {options} options
 *          object containing the options to parse csv content
 * @return {csv}
 *          csv as an object
**/
export const ObjectToCsv = (headers, data, options = defaultCsvOptions) => {
  // console.log('\nU > ObjectToCsv > headers : \n', headers)
  // console.log('U > ObjectToCsv > data : \n', data)
  // console.log('U > ObjectToCsv > options : ', options)

  let csvOut = ''

  // build headers - 1st line
  const headersLabels = headers.map(h => h.label).join(options.separator)
  csvOut += `${headersLabels}\n`
  // console.log('U > ObjectToCsv > csvOut : ', csvOut)

  // build rows
  data.forEach(d => {
    // console.log('U > ObjectToCsv > d : ', d)
    const dataStr = headers.map(h => d[h.field]).join(options.separator)
    csvOut += `${dataStr}\n`
  })

  return csvOut
}
