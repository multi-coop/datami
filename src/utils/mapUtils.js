
// GEOJSON SOURCE
export const createGeoJSONSource = (geoJSON, options) => {
  // console.log('+ + + createGeoJSONSource ... ')
  const generateId = options.generateId || true

  const geoJsonSource = {
    type: 'geojson',
    data: geoJSON,
    cluster: options.isCluster,
    clusterMaxZoom: options.clusterMaxZoom,
    clusterRadius: options.clusterRadius,
    generateId: generateId
  }
  return geoJsonSource
}

// - - - LAYERS - - - //

// GEOJSON LAYERS - CLUSTER CIRCLES
export const createClusterCirclesLayer = (sourceId, vars, layerId = 'clusters') => {
  const layerConfig = {
    id: layerId,
    type: 'circle',
    source: sourceId,
    filter: ['has', 'point_count'],
    paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750

      'circle-stroke-width': vars.circle_stroke_width,
      'circle-stroke-color': vars.circle_stroke_color,

      // "circle-color": [
      //   "step",
      //   ["get", "point_count"],
      //   // "#51bbd6",
      //   // 100, "#f1f075",
      //   // 750,"#f28cb1"
      //   "#a174ac",
      //   100, "#90689a",
      //   250, "#805c89",
      //   500, "#705178",
      //   750, "#503a56",
      // ],
      'circle-color': [
        'step',
        ['get', 'point_count'],
        vars.circle_color,
        100, vars.circle_color_100,
        250, vars.circle_color_250,
        500, vars.circle_color_500,
        750, vars.circle_color_750
      ],

      // "circle-radius": [
      //   "step",
      //   ["get", "point_count"],
      //   20,
      //   100, 20,
      //   250, 30,
      //   500, 40,
      //   750, 50
      // ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        vars.circle_radius,
        100, vars.circle_radius_100,
        250, vars.circle_radius_250,
        500, vars.circle_radius_500,
        750, vars.circle_radius_750
      ]
    },
    layout: {
      visibility: vars.is_default_visible ? 'visible' : 'none'
    }
  }
  return layerConfig
}

// GEOJSON LAYERS - CLUSTER COUNTS
export const createClusterCountLayer = (sourceId, vars, layerId = 'cluster-counts') => {
  const layerConfig = {
    id: layerId,
    type: 'symbol',
    source: sourceId,
    filter: ['has', 'point_count'],
    layout: {
      visibility: vars.is_default_visible ? 'visible' : 'none',
      'text-field': '{point_count_abbreviated}',
      'text-font': ['Open Sans Bold'], // OK
      // "text-font": ["Open Sans Regular"], // OK
      // "text-font": ["Roboto Regular"], // not working
      'text-size': vars.text_size
    },
    paint: {
      'text-color': vars.text_color
    }
  }
  return layerConfig
}

// GEOJSON LAYERS - UNCLUSTERED CIRCLES
export const createClusterUnclusteredLayer = (sourceId, vars, layerId = 'unclustered-point') => {
  const layerConfig = {
    id: layerId,
    type: 'circle',
    source: sourceId,
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': vars.circle_color,
      'circle-radius': vars.circle_radius,
      'circle-stroke-color': vars.circle_stroke_color,
      'circle-stroke-width': vars.circle_stroke_width
    },
    layout: {
      visibility: vars.is_default_visible ? 'visible' : 'none'
    }
  }
  return layerConfig
}

// GEOJSON LAYERS - ALL POINTS CIRCLES
export const createAllPoints = (sourceId, vars, layerId = 'all-points', fields = undefined) => {
  const activatedColor = vars.circle_color_activated ? vars.circle_color_activated : '#e75b0e'

  // console.log('\nC > mapUtils > createAllPoints > sourceId : ', sourceId)
  // console.log('C > mapUtils > createAllPoints > vars : ', vars)
  // console.log('C > mapUtils > createAllPoints > layerId : ', layerId)
  // console.log('C > mapUtils > createAllPoints > fields : ', fields)

  let circleColor = vars.circle_color || '#363636'
  if (typeof circleColor !== 'string') {
    circleColor = [...circleColor]
    const getter = circleColor[1][0]
    const fieldName = circleColor[1][1]
    const field = fields.find(f => f.name === fieldName)
    const fieldId = field && field.field | fieldName
    circleColor[1] = [getter, `${fieldId}`]
  }
  // console.log('C > mapUtils > createAllPoints > circleColor : ', circleColor)

  const layerConfig = {
    id: layerId,
    // type: 'circle',
    source: sourceId,
    // filter: ['==', '$type', 'Point'],
    // paint: {

    //   'circle-stroke-width': [
    //     'interpolate',
    //     ['linear'],
    //     ['zoom'],
    //     9, 0,
    //     vars.max_zoom, 1
    //   ],

    //   'circle-stroke-color': vars.circle_stroke_color || '#FFFFFF',

    //   // "circle-color": vars.circle_color,
    //   'circle-color': [
    //     'case',
    //     ['boolean', ['feature-state', 'selected'], false],
    //     activatedColor,
    //     circleColor
    //   ],

    //   // "circle-opacity": vars.circle_opacity,
    //   'circle-opacity': [
    //     'case',
    //     ['boolean', ['feature-state', 'selected'], false],
    //     1,
    //     vars.circle_opacity
    //   ],

    //   'circle-radius': [
    //     'interpolate',
    //     ['linear'],
    //     ['zoom'],
    //     vars.min_zoom, vars.radius_min,
    //     vars.max_zoom, vars.radius_max
    //   ]

    // },
    layout: {
      visibility: vars.is_default_visible ? 'visible' : 'none'
    }
  }

  if (vars.useSymbols) {
    layerConfig.type = 'symbol'
    layerConfig.filter = ['==', '$type', 'Point']
    const symbolsFieldName = vars.symbolsConfig.field
    const symbolsField = fields.find(f => f.name === symbolsFieldName)
    const symbolsConfig = {
      'icon-image': ['get', symbolsField.field],
      'icon-size': vars.symbolsConfig.iconSize || 0.1,
      'icon-overlap': 'always'
    }
    layerConfig.layout = { ...layerConfig.layout, ...symbolsConfig }
  } else {
    layerConfig.type = 'circle'
    layerConfig.filter = ['==', '$type', 'Point']
    const paintConfig = {
      'circle-stroke-width': [
        'interpolate',
        ['linear'],
        ['zoom'],
        9, 0,
        vars.max_zoom, 1
      ],

      'circle-stroke-color': vars.circle_stroke_color || '#FFFFFF',

      // "circle-color": vars.circle_color,
      'circle-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        activatedColor,
        circleColor
      ],

      // "circle-opacity": vars.circle_opacity,
      'circle-opacity': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        1,
        vars.circle_opacity
      ],

      'circle-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        vars.min_zoom, vars.radius_min,
        vars.max_zoom, vars.radius_max
      ]
    }
    layerConfig.paint = paintConfig
  }

  console.log('C > mapUtils > createAllPoints > layerConfig : ', layerConfig)
  return layerConfig
}

// GEOJSON LAYERS - HEATMAP
export const createHeatmapLayer = (sourceId, vars, layerId = 'heatmap-layer') => {
  // cf : https://docs.mapbox.com/help/tutorials/make-a-heatmap-with-mapbox-gl-js/
  const layerConfig = {
    id: layerId,
    type: 'heatmap',
    source: sourceId,
    maxzoom: vars.max_zoom,
    paint: {

      // Increase the heatmap weight based on frequency and property magnitude
      'heatmap-weight': [
        'interpolate',
        ['linear'],
        ['get', vars.prop_weight],
        0, 0,
        0.1, 1
      ],

      // Increase the heatmap color weight weight by zoom level
      // heatmap-intensity is a multiplier on top of heatmap-weight
      'heatmap-intensity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0, 0.1,
        vars.max_zoom, 1.5
      ],

      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparancy color
      // to create a blur-like effect.
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(33,102,172,0)',
        0.2, 'rgb(103,169,207)',
        0.4, 'rgb(209,229,240)',
        0.6, 'rgb(253,219,199)',
        0.8, 'rgb(239,138,98)',
        1, 'rgb(178,24,43)'
      ],

      // Adjust the heatmap radius by zoom level
      'heatmap-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        vars.radius_min, vars.radius_max,
        vars.max_zoom, 100
      ],

      // Transition from heatmap to circle layer by zoom level
      'heatmap-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        6, 0.7,
        vars.max_zoom, 0.1
      ]
    },
    layout: {
      visibility: vars.is_default_visible ? 'visible' : 'none'
    }
  }
  return layerConfig
}

// GEOJSON LAYERS - CHOROPLETH
// cf : https://docs.mapbox.com/mapbox-gl-js/example/data-join/
// cf :
export const createChoroplethLayer = (sourceId, source, layerId = 'choropleth') => {
  const layerConfig = {
    id: layerId,
    type: 'fill',
    source: sourceId,
    maxzoom: source.max_zoom,
    minzoom: source.min_zoom,
    // "source-layer": sourceId,
    paint: {
      // cf : https://docs.mapbox.com/mapbox-gl-js/style-spec/#layer-paint
      'fill-color': source.fill_color,
      'fill-opacity': source.fill_opacity, // 0.5,
      'fill-outline-color': source.fill_outline_color // "rgb(256,256,256)",
    },
    layout: {
      visibility: source.is_default_visible ? 'visible' : 'none'
    }
  }

  return layerConfig
}

export const createMarkerElement = (height, width, icon, color = '#4a4a4a') => {
  const markerEl = document.createElement('div')
  markerEl.className = 'marker'
  markerEl.innerHTML = `
<span
  class="icon"
  style="height: ${height}px; width: ${width}px; transform: translateY(-${height / 2}px)">
  <i
    class="mdi mdi-${icon}"
    style="font-size: ${height}px; color: ${color}">
  </i>
</span>`

  return markerEl
}
