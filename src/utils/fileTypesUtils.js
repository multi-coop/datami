export const authorizedFileTypes = {
  // text: ['txt', 'md'],
  // table: ['csv', 'tsv'],
  // json: ['json', 'geojson']
  txt: { type: 'text' },
  md: { type: 'text' },
  csv: { type: 'table' },
  tsv: { type: 'table' },
  json: { type: 'json' },
  geojson: { type: 'json' }
}

export const filesViewsOptions = [
  { code: 'edit', icon: 'pencil', textCode: 'editView' },
  { code: 'diff', icon: 'table-border', textCode: 'diffView' },
  { code: 'preview', icon: 'eye', textCode: 'previewView' }
]

export const viewModes = filesViewsOptions.map(v => v.code)
