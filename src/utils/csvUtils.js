export const separators = [
  { separator: ',', name: 'comma' },
  { separator: '|', name: 'pipe' },
  { separator: ';', name: 'semicolon' },
  { separator: '\t', name: 'tab' }
]

export const defaultCsvOptions = {
  separator: ';',
  tagseparator: '-',
  asJson: false
}

// cf : https://stackoverflow.com/questions/28543821/convert-csv-lines-into-javascript-objects

export const parseLine = (line) => JSON.parse(`[${line}]`)

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
