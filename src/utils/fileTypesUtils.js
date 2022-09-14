export const authorizedFileTypes = {
  txt: { family: 'text', type: 'text/plain' },
  md: { family: 'text', type: 'text/plain' },
  csv: { family: 'table', type: 'data:text/csv' },
  tsv: { family: 'table', type: 'data:text/tsv' },
  json: { family: 'json', type: 'application/json' },
  geojson: { family: 'json', type: 'application/json' },
  wiki: { family: 'table', type: 'data:text/csv' }
}
const authorizedTableTypes = []
for (const t in authorizedFileTypes) {
  if (authorizedFileTypes[t].family === 'table') authorizedTableTypes.push(t)
}
export const isTableExt = (filename) => {
  // console.log('\nU > fileTypesUtils > isTableExt > filename : ', filename)
  const ext = filename.split('.').at(-1)
  // console.log('U > fileTypesUtils > isTableExt > ext : ', ext)
  return authorizedTableTypes.includes(ext)
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
    icon: 'laptop-user',
    providers: ['localhost']
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
export const fieldTypeIcons = [
  {
    type: 'string',
    subtype: undefined,
    icon: 'alphabetical',
    default: true // default icon for strings
  },
  {
    type: 'string',
    subtype: 'longtext',
    icon: 'text-long'
  },
  {
    type: 'uri',
    subtype: 'image',
    icon: 'image'
  },
  {
    type: 'string',
    subtype: 'link',
    icon: 'link-variant'
  },
  {
    type: 'string',
    subtype: 'email',
    icon: 'email'
  },
  {
    type: 'string',
    subtype: 'tag',
    icon: 'tag-outline'
  },
  {
    type: 'string',
    subtype: 'tags',
    icon: 'tag-multiple-outline'
  },
  {
    type: 'boolean',
    subtype: undefined,
    icon: 'check-bold',
    default: true // default icon for booleans
  },
  {
    type: 'integer',
    subtype: undefined,
    icon: 'numeric',
    default: true // default icon for integers
  },
  {
    type: 'number',
    subtype: undefined,
    icon: 'numeric',
    default: true // default icon for numbers
  },
  {
    type: 'number',
    subtype: 'percent',
    icon: 'percent'
  },
  {
    type: 'number',
    subtype: 'geopoint',
    icon: 'map-marker-outline'
  },
  {
    type: 'date',
    subtype: undefined,
    icon: 'calendar-range',
    default: true // default icon for date
  },
  {
    type: 'any',
    subtype: undefined,
    icon: 'text'
  },

  // GITRIBUTE ICONS
  {
    type: 'datami',
    subtype: 'consolidation',
    icon: 'wrench'
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
  { code: 'cards', icon: 'card-outline', textCode: 'preview.cardsView' },
  { code: 'table', icon: 'table', textCode: 'preview.tableView' },
  { code: 'dataviz', icon: 'chart-bar', textCode: 'preview.datavizView' },
  { code: 'map', icon: 'map-outline', textCode: 'preview.mapView' }
]
export const viewModes = viewsOptions.map(v => v.code)
