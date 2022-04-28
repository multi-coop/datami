export const authorizedFileTypes = {
  txt: { family: 'text' },
  md: { family: 'text' },
  csv: { family: 'table' },
  tsv: { family: 'table' },
  json: { family: 'json' },
  geojson: { family: 'json' },
  wiki: { family: 'table' }
}

// ICONS
export const providerIcons = [
  {
    icon: 'gitlab',
    providers: ['gitlab']
  },
  {
    icon: 'github',
    providers: ['github']
  },
  {
    icon: 'wikipedia',
    providers: ['mediawiki']
  },
  {
    icon: 'source',
    providers: ['other']
  }
]
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
    icon: 'wikipedia',
    allowedTypes: ['wiki']
  },
  {
    icon: 'file',
    allowedTypes: ['other']
  }
]

// FOR EDITION
export const editViewsOptions = [
  { code: 'edit', icon: 'pencil', textCode: 'preview.editView' },
  { code: 'diff', icon: 'arrow-left-right', textCode: 'preview.diffView' },
  { code: 'preview', icon: 'eye', textCode: 'preview.previewView' }
]
export const editModes = editViewsOptions.map(v => v.code)

// FOR VIEWS
export const viewsOptions = [
  { code: 'cards', icon: 'apps', textCode: 'preview.cardsView' },
  { code: 'table', icon: 'table', textCode: 'preview.tableView' }
]
export const viewModes = viewsOptions.map(v => v.code)
