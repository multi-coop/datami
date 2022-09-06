// console.log('+ + + plugins/geoJson... ')

// let urlChoropleth = "https://restcountries.eu/rest/v2/all"

export const geoJsonBasesUrls = {

  // cf : https://github.com/georgique/world-geojson
  // cf :
  WORLD: {
    local: '~/assets/geojsons/regions/world.geojson',
    src01: 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
    src02: ''
  },

  REGIONS: {
    europe: '',
    europeNoRussia: '',
    asia: '',
    africa: '',
    americas: '',
    americaSouth: '',
    americaNorth: '',
    oceania: ''
  },

  EUROPE: {
    // cf : https://github.com/gregoiredavid/france-geojson
    FRANCE: {
      regions: {
        all: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-avec-outre-mer.geojson',
        allSimple: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-version-simplifiee.geojson',
        allMetro: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions.geojson',
        pre2015: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-avant-redecoupage-2015.geojson'
      },
      departements: {
        all: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-avec-outre-mer.geojson',
        allSimple: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson',
        allMetro: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements.geojson'
      },
      communes: {
        all: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/communes-avec-outre-mer.geojson',
        allSimple: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/communes-avec-outre-mer.geojson',
        allMetro: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/communes.geojson'
      },
      cantons: {
        all: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/cantons-avec-outre-mer.geojson',
        allSimple: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/cantons-version-simplifiee.geojson',
        allMetro: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/cantons.geojson'
      },
      arrondissements: {
        all: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/arrondissements-avec-outre-mer.geojson',
        allSimple: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/arrondissements-version-simplifiee.geojson',
        allMetro: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/arrondissements.geojson'
      },
      metroples: {
        all: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/metropole-et-outre-mer.geojson',
        allSimple: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/metropole-version-simplifiee.geojson',
        allMetro: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/metropole.geojson'
      }

    }

  }

}

export const GeoCenters = {

  // AS : [<LONG>, <LAT>]

  FRANCE: { center: [2.2137, 46.2276], zoom: 6, maxZoom: 18, minZoom: 2 }
  // EUROPE: { center : [2.2137, 46.2276], zoom : 6, maxZoom : 18, minZoom : 2 },
  // AMERICAS: { center : [2.2137, 46.2276], zoom : 6, maxZoom : 18, minZoom : 2 },
  // AFRICA: { center : [2.2137, 46.2276], zoom : 6, maxZoom : 18, minZoom : 2 },
  // ASIA: { center : [2.2137, 46.2276], zoom : 6, maxZoom : 18, minZoom : 2 },
  // OCEANIA: { center : [2.2137, 46.2276], zoom : 6, maxZoom : 18, minZoom : 2 },
  // WORLD: { center : [2.2137, 46.2276], zoom : 6, maxZoom : 18, minZoom : 2 },
}

export const createGeoJsonDataPoints = (dataArray, fieldLat = 'lat', fieldLong = 'lon', icon = 'map-marker') => {
  // console.log('\n+ + + createGeoJsonDataPoints ... ')
  // console.log('+ + + createGeoJsonDataPoints / dataArray : ', dataArray)

  // geojson wrappeer object
  const geoJSON = {
    type: 'FeatureCollection',
    features: []
  }
  // const notAllowedKeys = [fieldLat, fieldLong]
  const notAllowedKeys = []

  // remap items array
  const dataGeoJson = dataArray.map(item => {
    const trimmedItemProps = Object.keys(item)
      .filter(key => !notAllowedKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = item[key]
        return obj
      }, {})
    trimmedItemProps.icon = icon
    trimmedItemProps.weigth = 0.1

    const tempObject = {
      type: 'Feature',
      properties: trimmedItemProps,
      geometry: {
        type: 'Point',
        coordinates: [item[fieldLong], item[fieldLat]]
      }
    }
    return tempObject
  })
  geoJSON.features = dataGeoJson

  // console.log('')
  return geoJSON
}
