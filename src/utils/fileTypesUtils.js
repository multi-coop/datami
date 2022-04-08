export const authorizedFileTypes = {
  txt: { family: 'text' },
  md: { family: 'text' },
  csv: { family: 'table' },
  tsv: { family: 'table' },
  json: { family: 'json' },
  geojson: { family: 'json' }
}

export const typesIcons = [
  {
    icon: 'note-text-outline',
    allowedTypes: ['md']
  },
  {
    icon: 'table',
    allowedTypes: ['csv', 'tsv']
  },
  {
    icon: 'code-json',
    allowedTypes: ['json', 'geojson']
  },
  {
    icon: 'file',
    allowedTypes: ['other']
  }
]

export const filesViewsOptions = [
  { code: 'edit', icon: 'pencil', textCode: 'preview.editView' },
  { code: 'diff', icon: 'arrow-left-right', textCode: 'preview.diffView' },
  { code: 'preview', icon: 'eye', textCode: 'preview.previewView' }
]

export const viewModes = filesViewsOptions.map(v => v.code)
