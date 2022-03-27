export const separators = [
  { sep: ',', name: 'comma' },
  { sep: '|', name: 'pipe' },
  { sep: ';', name: 'semicolon' },
  { sep: '\t', name: 'tab' }
]

export const defaultCsvOptions = {
  separator: ';',
  asJson: false
}

// cf : https://stackoverflow.com/questions/28543821/convert-csv-lines-into-javascript-objects

export const parseLine = (line) => JSON.parse(`[${line}]`)

export const csvToObject = (csvRaw, options = defaultCsvOptions) => {
  // split data into lines
  const [headerLine, ...lines] = csvRaw.split('\n')

  // get headers
  const headers = parseLine(headerLine)

  // create object from parsing lines
  const objects = lines
    .map((line, index) => {
      let lineParsed

      // parse line
      if (options.asJson) {
        lineParsed = line.split(options.separator)
      } else {
        lineParsed = parseLine(line)
      }

      // reduce values array
      return lineParsed.reduce(
        // reducer callback
        (object, value, index) => ({
          ...object,
          [headers[index]]: value
        })
      )
    })

  // return csv object
  const csv = {
    headers: headers,
    data: objects
  }

  return csv
}
