<template>
  <div
    class="DatamiMap datami-component"
    :style="`z-index: 1; height: ${mapHeight + mapHeightTop}px; margin-top: ${-mapHeightTop}px;`">
    <!-- LOADER -->
    <div
      v-if="!fileIsLoading && (!itemsForMap || showLoader)"
      class="loader big-loader"/>

    <!-- DETAIL CARD FOR DISPLAYED ITEM -->
    <div
      v-show="showCard && displayedItemId && showDetail"
      class="map-card map-detail-card-item"
      :style="`width: ${cardDetailWidth}; transform: translate(-50%, ${mapHeightTop}px); -webkit-transform: translate(-50%, ${mapHeightTop}px)`">
      <DatamiCard
        :file-id="fileId"
        :fields="fields"
        :field-mapping="mapCardsSettingsDetail"
        :item="displayedItem"
        :show-detail="true"
        :show-detail-card="showDetail"
        :is-mini="false"
        :from-map="true"
        :locale="locale"
        @toggleDetail="toggleItemCard"
        @action="SendActionToParent"
        @updateCellValue="emitUpdate"/>
    </div>

    <!-- DISPLAY MAP -->
    <div
      :id="mapId"
      :ref="`container-map-${mapId}`"
      :style="`height: ${mapHeight + mapHeightTop}px; width: 100%;`">
      <div class="controls-container">
        <!-- MINI CARD FOR DISPLAYED ITEM -->
        <div
          v-if="showCard && displayedItemId && !showDetail"
          class="map-card map-mini-card-item"
          :style="`width: ${cardMiniWidth}; top: ${mapHeightTop}px`">
          <DatamiCard
            :file-id="fileId"
            :fields="fields"
            :field-mapping="mapCardsSettingsMini"
            :item="displayedItem"
            :show-detail="false"
            :show-detail-card="showDetail"
            :is-mini="true"
            :from-map="true"
            :locale="locale"
            @toggleDetail="toggleItemCard"
            @action="SendActionToParent"
            @updateCellValue="emitUpdate"/>
        </div>

        <!-- LEGEND & LAYERS -->
        <div class="map-card map-bottom-right">
          <!-- LAYERS -->
          <DatamiMapLayers
            v-if="layersVisibility && layersVisibility.is_activated"
            :file-id="fileId"
            :map-id="mapId"
            :layers-switches="layersVisibility.layers_switches"
            :switches-type="layersVisibility.switches_type"
            :is-default-open="drawerLayersOpen"
            :locale="locale"
            @switchLayer="switchLayerVisibility"/>

          <!-- LEGEND -->
          <DatamiMapLegend
            v-if="currentChoroSource"
            :file-id="fileId"
            :map-id="mapId"
            :current-choro-source="currentChoroSource"
            :visible-layers="visibleLayers"
            :is-default-open="drawerScalesOpen"
            :locale="locale"/>
        </div>

        <!-- DEBUG -->
        <div
          v-if="debug"
          class="columns is-multiline">
          <div class="column is-6">
            mapSettings: <br><pre><code>{{ mapSettings }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import {
  Map,
  Point,
  Popup,
  Marker,
  NavigationControl
  // FullscreenControl
} from 'maplibre-gl'
import * as turf from '@turf/turf'

import { mixinGlobal, mixinCsv } from '@/utils/mixins.js'
import { StylesOSM } from '@/utils/mapVectorStyles.js'

import {
  getData
} from '@/utils/gitProvidersAPI.js'

import {
  createGeoJSONSource,
  createClusterCirclesLayer,
  createClusterCountLayer,
  createClusterUnclusteredLayer,
  createAllPoints,
  createHeatmapLayer,
  createChoroplethLayer,
  createMarkerElement
} from '@/utils/mapUtils.js'

import {
  createGeoJsonDataPoints
  // geoJsonBasesUrls,
  // updateGeoJsonProperties
} from '@/utils/geoJson.js'
// import { LoaderTargetPlugin } from 'webpack'

// import DatamiCard from '@/components/previews/cards/DatamiCard'
// import DatamiMapLayers from '@/components/previews/maps/DatamiMapLayers'
// import DatamiMapLegend from '@/components/previews/maps/DatamiMapLegend'

import PopupContent from '@/components/previews/maps/DatamiMapPopup'
const PopupClass = Vue.extend(PopupContent)

export default {
  name: 'DatamiMap',
  components: {
    // DatamiCard,
    // DatamiMapLayers,
    // DatamiMapLegend
    DatamiCard: () => import(/* webpackChunkName: "DatamiCard" */ '@/components/previews/cards/DatamiCard.vue'),
    DatamiMapLayers: () => import(/* webpackChunkName: "DatamiMapLayers" */ '@/components/previews/maps/DatamiMapLayers.vue'),
    DatamiMapLegend: () => import(/* webpackChunkName: "DatamiMapLegend" */ '@/components/previews/maps/DatamiMapLegend.vue')
  },
  mixins: [
    mixinGlobal,
    mixinCsv
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    mapId: {
      default: null,
      type: String
    },
    mapSettings: {
      default: null,
      type: Object
    },
    items: {
      default: null,
      type: Array
    },
    fields: {
      default: null,
      type: Array
    },
    mapOnTop: {
      default: true,
      type: Boolean
    },
    locale: {
      default: 'fr',
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {

      // MAPLIBRE MAP OBJECT
      map: undefined,
      // isFullscreen: false,
      showLoader: true,
      redrawMap: 1,

      // MAP FLAGS
      isClusterSet: false,
      markersTreshold: 50,
      geoJson: undefined,
      geoJsonSource: undefined,
      isClusterMode: true,
      isAllPointsMode: true,
      isHeatmap: false,

      choroplethGeoJSONS: [],
      updatingChoroLayers: {},
      currentCenterFeature: undefined,

      // MARKERS
      item_geo_fields: {
        latitude: 'lat',
        longitude: 'lon'
      },
      item_marker: 'map-marker',
      item_marker_color: 'dark',
      item_marker_offset: [0, 0],
      item_marker_anchor: undefined,

      popup: undefined,
      drawerLayersOpen: false,
      drawerScalesOpen: false,

      // LOCAL DATA
      fieldLat: undefined,
      fieldLong: undefined,

      // MARKER
      markerIcon: 'map-marker',
      markerHeight: 50,
      markerWidth: 50,
      markerColor: '#4a4a4a',
      mapMarkers: [],
      // iconSizeNormal: [29, 29],
      // iconSizeHighlighted: [49, 49],

      // FIELDS MAPPER
      // contentFields: undefined,

      // LAYERS
      layersVisibility: undefined,
      visibleLayers: [],

      // ITEMS
      showCard: false,
      showDetail: false,
      displayedItem: undefined,
      displayedItemId: undefined,
      markerCoordinates: [2.2137, 46.2276], // { lon : 2.2137, lat : 46.2276 }

      // UX
      hoveredStateId: {},
      selectedStateId: {},

      // MAP SETUP
      mapHeight: 600,
      mapHeightTop: 240,
      preferCanvas: true,

      zoom: 13, // GeoCenters.FRANCE.zoom,
      maxZoom: undefined, // GeoCenters.FRANCE.maxZoom,
      minZoom: undefined, // GeoCenters.FRANCE.minZoom,
      currentZoom: 6,

      center: [-122.420679, 37.772537], // GeoCenters.FRANCE.center,
      currentCenter: undefined, // GeoCenters.FRANCE.center,

      // url: 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
      // attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contibutors',

      // cf : https://openmaptiles.org/docs/website/mapbox-gl-js/
      // mapStyle : undefined,
      // mapStyle: 'https://openmaptiles.github.io/osm-bright-gl-style/style-cdn.json',
      // mapStyle: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',

      // // WORKING MAPS /////////////////////////////////////////
      mapStyle: StylesOSM.testRasterVoyager, // OK better - default

      // CARDS
      cardMiniWidth: '30%',
      cardDetailWidth: '65%'
    }
  },
  computed: {
    mapOptions () {
      return this.mapSettings.mapOptions
    },
    mapLayersOptions () {
      return this.mapOptions.map_layers
    },
    mapCardsSettings () {
      // return this.mapLayersOptions.all_points_layer.cards_settings
      return this.cardsSettingsFromOptions
    },
    mapCardsSettingsMini () {
      return this.fields.map(f => {
        const fieldMap = {
          ...this.trimField(f),
          ...this.mapCardsSettings.mini[f.name]
        }
        const templates = this.cardsSettingsTemplates
        const hasTemplate = templates && templates[f.name] && templates[f.name].use_on_mini
        if (hasTemplate) { fieldMap.templating = templates[f.name].paragraphs }
        return fieldMap
      })
    },
    mapCardsSettingsDetail () {
      return this.fields.map(f => {
        const fieldMap = {
          ...this.trimField(f),
          ...this.mapCardsSettings.detail[f.name]
        }
        const templates = this.cardsSettingsTemplates
        const hasTemplate = templates && templates[f.name] && templates[f.name].use_on_detail
        if (hasTemplate) { fieldMap.templating = templates[f.name].paragraphs }
        return fieldMap
      })
    },
    itemsForMap () {
      // console.log('\nC > DatamiMap > itemsForMap ...')
      if (this.items) {
        // console.log('C > DatamiMap > itemsForMap > this.items ... not empty ...')
        // console.log('C > DatamiMap > itemsForMap > this.items : ', this.items)
        const geoItems = this.items.filter(item => this.checkIfItemHasLatLng(item))
        return geoItems
      } else {
        // console.log('C > DatamiMap > itemsForMap > this.items ... empty or undefined ...')
        // nothing in projects => empty everything
        return undefined
      }
    },
    getZoom () {
      return this.map && this.map.getZoom()
    },
    getCenter () {
      let center = this.map && this.map.getCenter()
      center = center || { lat: null, lng: null }
      return center
    },
    getBbox () {
      let bbox = this.map && this.map.getBounds()
      const emptyBox = {
        _ne: { lat: null, lng: null },
        _sw: { lat: null, lng: null }
      }
      bbox = bbox || emptyBox
      // console.log('C > DatamiMap > getBbox > bbox : ', bbox)
      return bbox
    },
    getViewBbox () {
      const canvas = this.map && this.map.getCanvasContainer()
      // console.log('C > DatamiMap > getViewBbox > canvas : ', canvas)
      const rect = canvas && canvas.getBoundingClientRect()
      // console.log('C > DatamiMap > getViewBbox > rect : ', rect)
      const currentRectSW = canvas && Point(rect.right, rect.bottom)
      const currentRectNE = canvas && Point(rect.left, rect.right)
      const currrentViewBbox = [currentRectSW, currentRectNE]
      // console.log('C > DatamiMap > getViewBbox > currrentViewBbox : ', currrentViewBbox
      return currrentViewBbox
    },
    currentChoroSource () {
      // console.log('\nC > DatamiMap > currentChoroSource ...')
      // console.log('C > DatamiMap > currentChoroSource > this.choroplethGeoJSONS : ', this.choroplethGeoJSONS)
      const choroSource = this.choroplethGeoJSONS.find(c => c.min_zoom < this.getZoom && this.getZoom < c.max_zoom)
      // console.log('C > DatamiMap > currentChoroSource > choroSource : ', choroSource)
      return choroSource
    },
    getCorrespondingChoroConfigs () {
      const currentZoom = this.getZoom
      const mapChoroConfigs = this.mapLayersOptions && this.mapLayersOptions.choropleth_layer && this.mapLayersOptions.choropleth_layer.sources
      // console.log('C > DatamiMap > getCorrespondingChoroConfigs > mapChoroConfigs : ', mapChoroConfigs)

      const emptyChoroConfigs = [
        {
          source_id: null,
          layer_id: null,
          source_url: null,
          max_zoom: null,
          min_zoom: null
        }
      ]
      const choroConfigs = mapChoroConfigs && mapChoroConfigs.filter(conf => {
        const isZoomRrange = conf.max_zoom > currentZoom && conf.min_zoom < currentZoom
        const isActivated = conf.is_activated
        return isZoomRrange && isActivated
      })
      return choroConfigs && choroConfigs.length > 0 ? choroConfigs : emptyChoroConfigs
    },
    getCorrespondingChoroToUpdate () {
      const emptyChoroConfig = {
        source_id: null,
        layer_id: null,
        source_url: null,
        max_zoom: null,
        min_zoom: null
      }
      const choroConfigs = this.getCorrespondingChoroConfigs
      const choroSourceIds = choroConfigs.map(c => {
        return c.source_id
      })
      const choroConfig = choroConfigs.length && choroConfigs.filter(conf => {
        return conf.update_src_from_previous_source && choroSourceIds.includes(conf.source_id)
      })
      return choroConfig || emptyChoroConfig
    }
  },
  watch: {
    showCard (next) {
      if (next) {
        // track with matomo
        this.trackEvent('showCard')
      }
    },
    redrawMap () {
      // console.log('\nC > DatamiMap > watch > redrawMap :', this.redrawMap)
      setTimeout(() => {
        this.map.redraw()
      }, 150)
    },
    currentViewMode (next) {
      if (next === 'map' && this.map) {
        this.redrawMap *= -1
      }
    },
    currentEditViewMode (next) {
      if (this.map) {
        this.getMapHeightTop()
        this.redrawMap *= -1
      }
    },
    async items () {
      if (this.map && !this.isClusterSet && this.itemsForMap) {
        // console.log('\nC > DatamiMap > watch > items > createGeoJsonDataPoints ( from geoJson.js ) ...')
        this.geoJson = createGeoJsonDataPoints(this.itemsForMap, this.fieldLat, this.fieldLong)
        // console.log('C > DatamiMap > watch - items - this.geoJson : ', this.geoJson)
        await this.createMapItems(this.geoJson)
      }

      if (this.map && this.isClusterSet) {
        // console.log('\nC > DatamiMap > watch > items > updateSourceData ...')
        this.updateSourceData(this.itemsForMap)
        // reset zoom and center
        this.map.easeTo({
          center: this.mapOptions.center,
          zoom: this.mapOptions.zoom
        })
      } else {
        // console.log('\nC > DatamiMap > watch > items > else (no map yet) ...')
      }
    },
    activeFilterTags (next) {
      // console.log('\nC > DatamiMap > watch > activeFilterTags > next:', next)
      this.getMapHeightTop()
    },
    userFullscreen (next) {
      // console.log('\nC > DatamiMap > watch > userFullscreen > next:', next)
      if (next) {
        // console.log('C > DatamiMap > watch > activeFilterTags >  screen.height:', screen.height)
        // console.log('C > DatamiMap > watch > activeFilterTags > this.mapHeightTop:', this.mapHeightTop)
        this.mapHeight = screen.height - this.mapHeightTop
      } else {
        this.mapHeight = this.mapOptions.height ?? 600
      }
      this.getMapHeightTop()
    }
  },
  created () {
    window.addEventListener('resize', this.getSizesScreen)
  },
  destroyed () {
    window.removeEventListener('resize', this.getSizesScreen)
  },
  beforeMount () {
    // console.log('\nC > DatamiMap > beforeMount > this.mapSettings : ', this.mapSettings)
    // console.log('C > DatamiMap > beforeMount > this.fields : ', this.fields)
    // set up fields mapper
    this.getSizesScreen()

    // this.contentFields = this.mapSettings.contentFields
    // console.log('C > DatamiMap > beforeMount > this.mapCardsSettingsMini : ', this.mapCardsSettingsMini)
    // console.log('C > DatamiMap > beforeMount > this.contentFields : ', this.contentFields)

    const mapOptions = this.mapOptions

    // set up map's basic parameters
    this.mapHeight = mapOptions.height ?? this.mapHeight
    this.center = mapOptions.center
    this.zoom = mapOptions.zoom
    this.maxZoom = mapOptions.maxZoom
    this.minZoom = mapOptions.minZoom
    this.mapStyle = mapOptions.mapStyle ? StylesOSM[mapOptions.mapStyle] : this.mapStyle // StylesOSM.testRasterVoyager // OK better

    // set up lat/long fields
    this.item_geo_fields = mapOptions.item_geo_fields || { latitude: 'lat', longitude: 'lon' }
    const fieldLat = this.fields.find(f => f.name === this.item_geo_fields.latitude)
    this.fieldLat = (fieldLat && fieldLat.field) || ''
    const fieldLong = this.fields.find(f => f.name === this.item_geo_fields.longitude)
    this.fieldLong = (fieldLong && fieldLong.field) || ''
    // console.log('C > DatamiMap > beforeMount > this.item_geo_fields : ', this.item_geo_fields)
    // console.log('C > DatamiMap > beforeMount > this.fieldLat : ', this.fieldLat)
    // console.log('C > DatamiMap > beforeMount > this.fieldLong : ', this.fieldLong)

    // set up map's basic parameters
    // this.item_marker = mapOptions.item_marker || 'map-marker'
    // this.item_marker_color = mapOptions.item_marker_color || 'primary'
    // this.item_marker_offset = mapOptions.item_marker_offset || [0, 0]
    // this.item_marker_anchor = mapOptions.item_marker_anchor || 'bottom'

    // this.item_marker = mapOptions.item_marker || 'map-marker'
    // this.item_marker = mapOptions.item_marker || 'map-marker'
    // this.item_marker = mapOptions.item_marker || 'map-marker'

    // set up item's marker
    this.markerIcon = mapOptions.marker_icon ? mapOptions.marker_icon : this.markerIcon
    this.markerHeight = mapOptions.marker_height ? mapOptions.marker_height : this.markerHeight
    this.markerWidth = mapOptions.marker_width ? mapOptions.marker_width : this.markerWidth
    this.markerColor = mapOptions.marker_color ? mapOptions.marker_color : this.markerColor

    this.layersVisibility = mapOptions.layers_visibility
    this.drawerLayersOpen = this.layersVisibility && this.layersVisibility.is_drawer_open
  },
  mounted () {
    // console.log('\nC > DatamiMap > mounted > this.mapId : ', this.mapId)
    this.initializeMap()
    // console.log('\nC > DatamiMap > mounted > this.visibleLayers : ', this.visibleLayers)
  },
  methods: {
    getDocWidth () {
      const docWidth = document.body.clientWidth
      // console.log('\nC > DatamiMap > getDocWidth > docWidth : ', docWidth)
      let cardMiniWidth
      let cardDetailWidth
      if (docWidth <= 768) {
        cardMiniWidth = '75%'
        cardDetailWidth = '80%'
      } else if (docWidth > 768 && docWidth < 1024) {
        cardMiniWidth = '50%'
        cardDetailWidth = '75%'
      } else if (docWidth >= 1024 && docWidth < 1215) {
        cardMiniWidth = '30%'
        cardDetailWidth = '65%'
      } else if (docWidth >= 1215 && docWidth < 1408) {
        cardMiniWidth = '25%'
        cardDetailWidth = '60%'
      } else {
        cardMiniWidth = '400px'
        cardDetailWidth = '900px'
      }
      // console.log('C > DatamiMap > getDocWidth > cardMiniWidth : ', cardMiniWidth)
      // console.log('C > DatamiMap > getDocWidth > cardDetailWidth : ', cardDetailWidth)

      this.cardMiniWidth = cardMiniWidth
      this.cardDetailWidth = cardDetailWidth
    },
    getMapHeightTop () {
      let height = 0
      if (this.mapOnTop) {
        height = 240
        const fileNavbarElem = document.getElementById(`file-navbar-${this.fileId}`)
        const sortFiltersElem = document.getElementById(`sort-and-filters-skeleton-${this.fileId}`)
        const editCsvElem = document.getElementById(`edit-csv-skeleton-${this.fileId}`)

        if (fileNavbarElem && sortFiltersElem && editCsvElem) {
          // height = elem.clientHeight
          const h1 = fileNavbarElem.clientHeight
          const h2 = sortFiltersElem.clientHeight
          const h3 = editCsvElem.clientHeight
          // console.log('\nC > DatamiMap > mapHeightTop > fileNavbarElem : ', fileNavbarElem)
          // console.log('C > DatamiMap > mapHeightTop > h1 : ', h1)
          // console.log('C > DatamiMap > mapHeightTop > sortFiltersElem : ', sortFiltersElem)
          // console.log('C > DatamiMap > mapHeightTop > h2 : ', h2)
          // console.log('C > DatamiMap > mapHeightTop > editCsvElem : ', editCsvElem)
          // console.log('C > DatamiMap > mapHeightTop > h3 : ', h3)
          // const adjusting = (this.activeFilterTags && this.activeFilterTags.length) ? 12 : 5
          const adjusting = 4
          height = h1 + h2 + h3 + adjusting
        }
        // console.log('C > DatamiMap > mapHeightTop > height : ', height)
      }
      this.mapHeightTop = height
    },
    getSizesScreen () {
      this.getDocWidth()
      this.getMapHeightTop()
    },
    initializeMap () {
      // Note: MapLibre GL uses longitude, latitude coordinate order (as opposed to latitude, longitude) to match GeoJSON.
      // cf : https://maplibre.org/maplibre-gl-js-docs/api/map/#map-parameters
      const map = new Map({
        container: this.mapId,
        center: this.center,
        zoom: this.zoom,
        maxZoom: this.maxZoom,
        minZoom: this.minZoom,
        style: this.mapStyle
        // hash: true
        // transformRequest: (url, resourceType) => {
        //   if (resourceType === 'Source' && url.startsWith('http://myHost')) {
        //     return {
        //       url: url.replace('http', 'https'),
        //       headers: { 'my-custom-header': true},
        //       credentials: 'include' // Include cookies for cross-origin requests
        //     }
        //   }
        // }
      })
      map.dragRotate.disable()
      map.touchZoomRotate.disableRotation()

      window.dispatchEvent(new Event('resize'))

      // console.log('C > DatamiMap > mounted > map : ', map)
      map.on('load', async () => {
        // add navigation control
        const navCtrl = new NavigationControl()
        map.addControl(navCtrl, 'bottom-right')

        this.geoJson = createGeoJsonDataPoints(this.itemsForMap, this.fieldLat, this.fieldLong)

        await this.createMapItems(this.geoJson)
      })

      this.map = map
    },

    // - - - - - - - - - - - - - - - - - - //
    // MAP ITEMS AS GEOJSON
    // - - - - - - - - - - - - - - - - - - //
    async createMapItems (geoJson) {
      // console.log('\nC > DatamiMap > createMapItems ...')
      const mapOptions = this.mapOptions

      // adding reactive source
      // console.log('C > DatamiMap > createMapItems > geoJson :', geoJson)
      // console.log('C > DatamiMap > createMapItems > this.map :', this.map)
      await this.createAddGeoJsonSource(geoJson)
      await this.createChoroplethSource(false)

      const allPointsSourceId = (mapOptions.all_points_layer && mapOptions.all_points_layer.source_id) || 'allPointsSource'
      const geoJsonSourceId = (mapOptions.cluster_circles_layer && mapOptions.cluster_circles_layer.source_id) || 'clusterSource'
      // cf : https://www.jerriepelser.com/books/airport-explorer/mapping/clustering/
      this.createAddGeoJsonLayers({
        allPointsId: allPointsSourceId, // 'allPointsSource'
        clusterId: geoJsonSourceId // 'clusterSource'
      })
      this.isClusterSet = true
      // console.log("C > DatamiMap > createMapItems > this.map :", this.map)
    },

    // - - - - - - - - - - - - - - - - - - //
    // SOURCES
    // - - - - - - - - - - - - - - - - - - //
    updateSourceData (itemsForMap) {
      this.log && console.log('\nC > DatamiMap > updateSourceData ...')
      // console.log("C > DatamiMap > updateSourceData > this.map :", this.map)
      // console.log("C > DatamiMap > updateSourceData > itemsForMap :", itemsForMap)

      if (itemsForMap) {
        const mapLayersOptions = this.mapLayersOptions

        const allPointsSourceId = (mapLayersOptions.all_points_layer && mapLayersOptions.all_points_layer.source_id) || 'allPointsSource'
        const geoJsonSourceId = (mapLayersOptions.cluster_circles_layer && mapLayersOptions.cluster_circles_layer.source_id) || 'clusterSource'

        // console.log('\nC > DatamiMap > updateSourceData > createGeoJsonDataPoints ( from geoJson.js ) ...')
        const geoJson = createGeoJsonDataPoints(itemsForMap, this.fieldLat, this.fieldLong)
        // console.log('C-SearchResultsMapbox > updateSourceData > geoJson : ', geoJson)

        // console.log('C > DatamiMap > updateSourceData > allPointsSourceId : ', allPointsSourceId)
        this.map.getSource(allPointsSourceId).setData(geoJson)

        // console.log('C > DatamiMap > updateSourceData > geoJsonSourceId : ', geoJsonSourceId)
        this.map.getSource(geoJsonSourceId).setData(geoJson)

        // this.map.getSource('allPointsSource').setData(geoJson)
        // this.map.getSource('clusterSource').setData(geoJson)

        // TO DO : update choropleth
        // const choroplethConfigOptions = mapLayersOptions.choropleth_layer
        // for ( let source of choroplethConfigOptions.sources ) {
        //  this.map.getSource( source.source_id ).setData( geoJson )
        // }
        this.createChoroplethSource(true)
      }
    },
    async createAddGeoJsonSource (geoJson) {
      // console.log('\nC > DatamiMap > createAddGeoJsonSource > geoJson :', geoJson)

      const mapLayersOptions = this.mapLayersOptions
      // console.log('C > DatamiMap > createAddGeoJsonSource > mapLayersOptions :', mapLayersOptions)

      this.showLoader = true

      // - - - - - - - - - - - - - - - - //
      // SOURCE - ALL POINTS
      // - - - - - - - - - - - - - - - - //
      if (mapLayersOptions.all_points_layer && mapLayersOptions.all_points_layer.is_activated) {
        const allPointsConfigOptions = mapLayersOptions.all_points_layer
        const allPointsSourceId = allPointsConfigOptions.source_id || 'allPointsSource'
        const allPointsSource = createGeoJSONSource(geoJson, {
          isCluster: false,
          clusterMaxZoom: 14,
          clusterRadius: 75
        })
        // console.log('C > DatamiMap > createAddGeoJsonSource > allPointsSource :', allPointsSource)
        this.map.addSource(allPointsSourceId, allPointsSource)

        // FOR LIVE DATA --- TO DO
        // if ( allPointsConfigOptions.is_live_data ){
        //   window.setInterval(function() {
        //     this.map
        //     .getSource( allPointsSourceId )
        //     .setData( // TO DO // ) ;
        //   // }, allPointsConfigOptions.refresh_delay)
        // }
      }

      // - - - - - - - - - - - - - - - - //
      // SOURCE - ALL POINTS > CLUSTERS
      // - - - - - - - - - - - - - - - - //
      if (mapLayersOptions.cluster_circles_layer && mapLayersOptions.cluster_circles_layer.is_activated) {
        const clusterLayerConfigOptions = mapLayersOptions.cluster_circles_layer
        const geoJsonSourceId = clusterLayerConfigOptions.source_id || 'clusterSource'
        const geoJsonSource = createGeoJSONSource(geoJson, {
          isCluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 75
        })
        // console.log('C > DatamiMap > createAddGeoJsonSource > geoJsonSource :', geoJsonSource)
        this.map.addSource(geoJsonSourceId, geoJsonSource)
      }

      this.showLoader = false
    },
    async createChoroplethSource (isUpdate = false) {
      // console.log('\nC > DatamiMap > createChoroplethSource > isUpdate : ', isUpdate)

      const mapLayersOptions = this.mapLayersOptions
      // console.log('C > DatamiMap > createChoroplethSource > mapLayersOptions :', mapLayersOptions)

      // - - - - - - - - - - - - - - - - //
      // SOURCE - CHOROPLETH //
      if (mapLayersOptions.choropleth_layer && mapLayersOptions.choropleth_layer.is_activated) {
        // console.log('C > DatamiMap > createChoroplethSource > mapLayersOptions.choropleth_layer :', mapLayersOptions.choropleth_layer)
        this.showLoader = true

        // cf : https://github.com/gregoiredavid/france-geojson
        // cf : https://geojson-maps.ash.ms/
        // cf : https://restcountries.eu/#api-endpoints-all

        // cf : https://docs.mapbox.com/mapbox-gl-js/example/updating-choropleth/
        // cf : https://docs.mapbox.com/mapbox-gl-js/example/data-join/

        const choroplethConfigOptions = mapLayersOptions.choropleth_layer

        this.drawerScalesOpen = choroplethConfigOptions.is_drawer_open

        for (const source of choroplethConfigOptions.sources) {
          if (source.is_activated) {
            // create dummy empty source
            // console.log('\nC > DatamiMap > createChoroplethSource > source : ', source)
            // console.log('C > DatamiMap > createChoroplethSource > source.source_id : ', source.source_id)

            const sublayersLegend = source.sub_layers && source.sub_layers.map(sublayer => {
              return {
                layer_id: sublayer.layer_id,
                legend: sublayer.legend
              }
            })

            this.choroplethGeoJSONS.push({
              source_id: source.source_id,
              legend: source.legend,
              sublayers_legend: sublayersLegend,
              max_zoom: source.max_zoom,
              min_zoom: source.min_zoom,
              is_loaded: false,
              data: undefined
            })

            const dummyGeoJson = {
              type: 'FeatureCollection',
              features: [
                // { "type":"Feature",
                //   "geometry": {
                //     "type":"Polygon",
                //     "coordinates": [ [ [4.780213475718984,46.176677022719375],[4.7945808953124605,46.21831635025701],[4.807756868341096,46.23696871115128] ] ] },
                //   "properties": {"code":"01","nom":"Ain"}
                // }
              ]
            }

            if (source.need_aggregation && !isUpdate) {
              // creation as dummy empty source
              // console.log('C > DatamiMap > createChoroplethSource > source.need_aggregation && !isUpdate ')
              this.map.addSource(source.source_id, { type: 'geojson', data: dummyGeoJson })
              this.showLoader = false
            }

            if (source.need_aggregation && !source.update_src_from_previous_source) {
              // console.log('C > DatamiMap > createChoroplethSource > source.need_aggregation + isUpdate : ', isUpdate)
              const choroRefIdex = this.choroplethGeoJSONS.findIndex(c => c.source_id === source.source_id)

              if (!isUpdate) {
                // console.log('C > DatamiMap > createAddGeoJsonSource > source.source_url :', source.source_url)
                const choroSource = await getData(source.source_url, 'createAddGeoJsonSource')
                // console.log('C > DatamiMap > createAddGeoJsonSource > choroSource :', choroSource)
                const dataLoaded = choroSource.data
                this.joinItemsToPolygon(source, dataLoaded, choroRefIdex)
              }

              if (isUpdate) {
                const isDataLoaded = this.choroplethGeoJSONS[choroRefIdex].is_loaded
                const dataLoaded = this.choroplethGeoJSONS[choroRefIdex].data
                if (isDataLoaded) {
                  // modify > agregate data
                  this.joinItemsToPolygon(source, dataLoaded, choroRefIdex)
                }
              }
            }

            if (!source.need_aggregation && !isUpdate) {
              // console.log('C > DatamiMap > createChoroplethSource > !source.need_aggregation ')
              this.map.addSource(source.source_id, { type: 'geojson', data: source.source_url })
              const choroRefIdex = this.choroplethGeoJSONS.findIndex(c => c.source_id === source.source_id)
              this.choroplethGeoJSONS[choroRefIdex].is_loaded = true

              this.showLoader = false
            }
          }
        }
      }
    },
    getRenderedChoroFeatures (layerId) {
      // console.log('\nC > DatamiMap > getRenderedFeatures... ')
      let renderedFeatures
      try {
        // renderedFeatures = this.map.queryRenderedFeatures( )
        renderedFeatures = this.mapStyle.queryRenderedFeatures(this.getViewBbox, { layers: [layerId] })
      } catch (err) {
        renderedFeatures = err
      }
      // console.log('C > DatamiMap > getRenderedFeatures > renderedFeatures : ', renderedFeatures)
      return renderedFeatures
    },
    async updateChoroSourceByZoom (choroSourceConfig, featuresArray = undefined) {
      // called by watching "getCorrespondingChoroConfigs" computed value
      this.updatingChoroLayers[choroSourceConfig.layer_id] = { is_updating: true }

      // console.log('\nC > DatamiMap > updateChoroSourceByZoom > choroSourceConfig : ', choroSourceConfig)
      const center = this.getCenter

      const choroRefIdex = this.chroplethGeoJSONS.findIndex(c => c.source_id === choroSourceConfig.source_id)
      // console.log('\nC > DatamiMap > updateChoroSourceByZoom > choroRefIdex : ', choroRefIdex)

      for (const update of choroSourceConfig.update_src_options) {
        // const upperSourceId = update.upper_source_id
        const upperLayerId = update.upper_layer_id
        const slugsMap = update.slugs_map

        let upperRenderredFeatures
        if (!featuresArray) {
          upperRenderredFeatures = this.getRenderedChoroFeatures(upperLayerId)

          const renderredCenters = {
            type: 'FeatureCollection',
            features: []
          }
          for (const f of upperRenderredFeatures) {
            const fCenter = turf.centerOfMass(f)
            fCenter.properties = f.properties
            renderredCenters.features.push(fCenter)
          }
          // console.log('C > DatamiMap > updateChoroSourceByZoom > renderredCenters : ', renderredCenters)

          if (update.upper_load_feat === 'only_center') {
            const viewCenter = turf.point([center.lng, center.lat])
            // console.log('\nC > DatamiMap > updateChoroSourceByZoom > viewCenter : ', viewCenter)

            const nearest = turf.nearestPoint(viewCenter, renderredCenters)
            // console.log('C > DatamiMap > updateChoroSourceByZoom > nearest : ', nearest)
            const nearestFeature = upperRenderredFeatures.find(f => f.properties[update.upper_main_matching_prop] === nearest.properties[update.upper_main_matching_prop])
            upperRenderredFeatures = [nearestFeature]
            this.currentCenterFeature = nearestFeature
          }
        } else {
          upperRenderredFeatures = featuresArray
        }
        // console.log('C > DatamiMap > updateChoroSourceByZoom > upperRenderredFeatures : ', upperRenderredFeatures)

        // if ( update.upper_load_feat === "only_center" ){

        // }

        // const promisesArray = []

        for (const feat of upperRenderredFeatures) {
          // console.log("C > DatamiMap > updateChoroSourceByZoom > feat.properties : ", feat.properties )

          let urlBase = update.url_base
          for (const slug of slugsMap) {
            const propField = slug.value_property
            const value = feat.properties[propField]
            const slugCode = '<' + slug.value_slug_code + '>'
            urlBase = urlBase.replace(slugCode, value)
          }

          // console.log('C > DatamiMap > updateChoroSourceByZoom > urlBase : ', urlBase)
          const choroSource = await getData(urlBase, 'updateChoroSourceByZoom')
          // console.log('C > DatamiMap > updateChoroSourceByZoom > choroSource : ', choroSource)
          // promisesArray.push(choroSource)
          const dataLoaded = {
            type: 'FeatureCollection',
            features: []
          }
          const data = choroSource.data && choroSource.data.features
          if (data && data.length > 0) {
            dataLoaded.features = dataLoaded.features.concat(data)
          }

          // console.log('C-SearchResultsMapbox > updateChoroSourceByZoom > dataLoaded : ', dataLoaded)

          if (choroSourceConfig.need_aggregation) {
            this.joinItemsToPolygon(choroSourceConfig, dataLoaded, choroRefIdex, true)
          }

          this.map.getSource(choroSourceConfig.source_id).setData(dataLoaded)
        }

        // Promise.all(promisesArray).then(results => {
        //   console.log('C-SearchResultsMapbox > updateChoroSourceByZoom > results : ', results)
        //   const dataLoaded = {
        //     type: 'FeatureCollection',
        //     features: []
        //   }
        //   results.forEach(r => {
        //     const data = r.data && r.data.features
        //     if (data && data.length > 0) {
        //       dataLoaded.features = dataLoaded.features.concat(data)
        //     }
        //   })
        //   console.log('C-SearchResultsMapbox > updateChoroSourceByZoom > dataLoaded : ', dataLoaded)

        //   if (choroSourceConfig.need_aggregation) {
        //     this.joinItemsToPolygon(choroSourceConfig, dataLoaded, choroRefIdex, true)
        //   }

        //   this.map.getSource(choroSourceConfig.source_id).setData(dataLoaded)
        // })
      }

      this.updatingChoroLayers[choroSourceConfig.layer_id] = { is_updating: false }
    },

    // - - - - - - - - - - - - - - - - - - //
    // LAYERS
    // - - - - - - - - - - - - - - - - - - //
    createAddGeoJsonLayers (geoJsonSourceId) {
      // console.log('\nC > DatamiMap > createAddGeoJsonLayers ... ')
      // console.log('C > DatamiMap > createAddGeoJsonLayers > this.map : ', this.map)
      // console.log('C > DatamiMap > createAddGeoJsonLayers > geoJsonSourceId : ', geoJsonSourceId)

      const mapLibre = this.map
      const mapLayersOptions = this.mapLayersOptions
      const mapZoom = this.getZoom

      const fileId = this.fileId
      const mapId = this.mapId
      const fields = this.fields
      const locale = this.locale
      // console.log('C > DatamiMap > createAddGeoJsonLayers > mapLayersOptions : ', mapLayersOptions)
      // console.log('C > DatamiMap > createAddGeoJsonLayers > mapZoom : ', mapZoom)
      // console.log('C > DatamiMap > createAddGeoJsonLayers > loc : ', loc)

      const itemIdField = this.getBlockField('block_id') || 'id'
      // console.log('C > DatamiMap > createAddGeoJsonLayers > itemIdField : ', itemIdField)

      const showItemCard = this.showItemCard
      const goToDetailPage = this.goToDetailPage
      // console.log('C > DatamiMap > createAddGeoJsonLayers > showItemCard : ', showItemCard)
      // console.log('C > DatamiMap > createAddGeoJsonLayers > goToDetailPage : ', goToDetailPage)

      const toggleSelectedOn = this.toggleSelectedOn
      const popup = new Popup({
        closeButton: false,
        closeOnClick: false
      })
      // console.log('C > DatamiMap > createAddGeoJsonLayers > toggleSelectedOn : ', toggleSelectedOn)
      // console.log('C > DatamiMap > createAddGeoJsonLayers > popup : ', popup)

      //  CHOROPLETH
      if (mapLayersOptions.choropleth_layer && mapLayersOptions.choropleth_layer.is_activated) {
        const choroplethConfigOptions = mapLayersOptions.choropleth_layer
        for (const source of choroplethConfigOptions.sources) {
          if (source.is_activated) {
            this.createAddChoroplethLayers(source)
          }
        }
      }

      //  HEATMAP
      if (mapLayersOptions.heatmap_layer && mapLayersOptions.heatmap_layer.is_activated) {
        const heatmapLayerConfigOptions = mapLayersOptions.heatmap_layer
        const heatmapSourceId = heatmapLayerConfigOptions.source_id || geoJsonSourceId.allPointsId
        const heatmapLayerId = heatmapLayerConfigOptions.layer_id || 'heatmap-layer'
        const heatmapLayerConfig = createHeatmapLayer(
          heatmapSourceId,
          heatmapLayerConfigOptions,
          heatmapLayerId
        )
        this.map.addLayer(heatmapLayerConfig)
        this.updateVisibleLayers(heatmapLayerId, heatmapLayerConfigOptions.is_default_visible)
      }

      // ALL POINTS
      if (mapLayersOptions.all_points_layer && mapLayersOptions.all_points_layer.is_activated) {
        const allPointsConfigOptions = mapLayersOptions.all_points_layer
        const allPointsLayerId = allPointsConfigOptions.layer_id || 'all-points'

        const allPointsConfig = createAllPoints(
          geoJsonSourceId.allPointsId,
          allPointsConfigOptions,
          allPointsLayerId,
          fields
        )
        // console.log('C > DatamiMap > createAddGeoJsonLayers > allPointsConfig : ', allPointsConfig)
        this.map.addLayer(allPointsConfig)
        this.updateVisibleLayers(allPointsLayerId, allPointsConfigOptions.is_default_visible)
        if (allPointsConfigOptions.is_clickable) {
          // CLICK
          mapLibre.on('click', allPointsLayerId, (e) => {
            const featuresPoint = mapLibre.queryRenderedFeatures(e.point, { layers: [allPointsLayerId] })
            // console.log('C > DatamiMap > createGeoJsonLayers > click - all-points - featuresPoint : ', featuresPoint)

            const item = featuresPoint[0]
            const itemSource = item.source
            const itemProps = item.properties

            // toggle as selected
            toggleSelectedOn(e, itemSource)

            const pointId = itemProps[itemIdField]
            // console.log('C > DatamiMap > createGeoJsonLayers > click - all-points - pointId : ', pointId)

            if (allPointsConfigOptions.direct_to_detail) {
              goToDetailPage(pointId)
            } else {
              const coordinates = e.features[0].geometry.coordinates.slice()
              // console.log('C > DatamiMap > createGeoJsonLayers > click - all-points - coordinates : ', coordinates)

              // fly to point
              const mapZoomItem = 12 // allPointsConfigOptions.zoom_item
              const mapZoomAdd = allPointsConfigOptions.add_zoom_on_click || 2
              mapLibre.easeTo({
                center: coordinates,
                zoom: mapZoomItem || (mapZoom + mapZoomAdd)
              })

              itemProps.lon = coordinates[0]
              itemProps.lat = coordinates[1]
              showItemCard(itemProps)
            }
          })

          // HOVER ENTER
          this.map.on('mouseenter', allPointsLayerId, (e) => {
            mapLibre.getCanvas().style.cursor = 'pointer'

            // ADD POPUP ON MARKER IF ACTIVE
            // cf : https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/
            if (allPointsConfigOptions.has_popup) {
              const featuresPolygon = mapLibre.queryRenderedFeatures(e.point, { layers: [allPointsLayerId] })
              // console.log('\nC > DatamiMap > createAddGeoJsonLayers > hover => featuresPolygon : ', featuresPolygon)

              // const coordinates = e.features[0].geometry.coordinates.slice()
              const itemPropsRaw = featuresPolygon[0].properties
              // console.log('C > DatamiMap > createAddGeoJsonLayers > hover => itemPropsRaw : ', itemPropsRaw)
              // remap item with fields
              const itemProps = {}
              // console.log('C > DatamiMap > createAddGeoJsonLayers > hover => fields : ', fields)
              fields.forEach(f => {
                itemProps[f.name] = itemPropsRaw[f.field]
              })
              // console.log('C > DatamiMap > createAddGeoJsonLayers > hover => itemProps : ', itemProps)

              const pop = popup
                .setLngLat({ lng: e.lngLat.lng, lat: e.lngLat.lat })
                .setHTML(`
                  <div id="vue-popup-marker">
                  </div>`
                )
                .addTo(mapLibre)
              // console.log('C > DatamiMap > createAddGeoJsonLayers > hover => pop : ', pop)

              const popupConfig = allPointsConfigOptions.popup_config.fields_settings
              const config = Object.keys(popupConfig).map(k => {
                return {
                  ...popupConfig[k],
                  field: k
                }
              })
              // console.log('C > DatamiMap > createAddGeoJsonLayers > hover => config : ', config)

              const popInstance = new PopupClass({
                propsData: {
                  fileId: fileId,
                  mapId: mapId,
                  feature: featuresPolygon[0],
                  item: itemProps,
                  config: config,
                  locale: locale
                }
              })
              // console.log('C > DatamiMap > createAddGeoJsonLayers > hover => popInstance : ', popInstance)
              popInstance.$mount('#vue-popup-marker')
              pop._update()
            }
          })

          // HOVER LEAVE
          this.map.on('mouseleave', allPointsLayerId, () => {
            mapLibre.getCanvas().style.cursor = ''
            if (allPointsConfigOptions.has_popup) {
              popup.remove()
            }
          })
        }
      }

      // CLUSTERING CIRCLES
      if (mapLayersOptions.cluster_circles_layer && mapLayersOptions.cluster_circles_layer.is_activated) {
        const clusterLayerConfigOptions = mapLayersOptions.cluster_circles_layer
        // const clusterSourceId = clusterLayerConfigOptions.source_id || 'clusterSource'
        const clusterLayerId = clusterLayerConfigOptions.layer_id || 'cluster-circles'
        const clusterLayerConfig = createClusterCirclesLayer(
          geoJsonSourceId.clusterId,
          clusterLayerConfigOptions,
          clusterLayerId
        )
        this.map.addLayer(clusterLayerConfig)
        this.updateVisibleLayers(clusterLayerId, clusterLayerConfigOptions.is_default_visible)
        if (clusterLayerConfigOptions.is_clickable) {
          this.map.on('click', clusterLayerId, (e) => {
            // const featuresSource = mapLibre.getSource(geoJsonSourceId.clusterId)
            // console.log('C > DatamiMap > createGeoJsonLayers > clic - clusters -  featuresSource : ', featuresSource)
            const featuresCluster = mapLibre.queryRenderedFeatures(e.point, { layers: [clusterLayerId] })
            // console.log('C > DatamiMap > createGeoJsonLayers > clic - clusters -  featuresCluster : ', featuresCluster)
            const clusterId = featuresCluster[0].properties.cluster_id
            // console.log('C > DatamiMap > createGeoJsonLayers > clic - clusters - clusterId : ', clusterId)
            mapLibre.getSource(geoJsonSourceId.clusterId).getClusterExpansionZoom(clusterId, function (err, zoom) {
              if (err) { return }
              this.map.easeTo({
                center: featuresCluster[0].geometry.coordinates,
                zoom: zoom
              })
            })
          })
          this.map.on('mouseenter', clusterLayerId, () => {
            mapLibre.getCanvas().style.cursor = 'pointer'
          })
          this.map.on('mouseleave', clusterLayerId, () => {
            mapLibre.getCanvas().style.cursor = ''
          })
        }
      }

      // CLUSTERING COUNTS
      if (mapLayersOptions.cluster_count_layer && mapLayersOptions.cluster_count_layer.is_activated) {
        const countLayerConfigOptions = mapLayersOptions.cluster_count_layer
        const countLayerId = countLayerConfigOptions.layer_id || 'cluster-counts'
        const countLayerConfig = createClusterCountLayer(
          geoJsonSourceId.clusterId,
          countLayerConfigOptions,
          countLayerId
        )
        this.map.addLayer(countLayerConfig)
        this.updateVisibleLayers(countLayerId, countLayerConfigOptions.is_default_visible)
        if (countLayerConfigOptions.is_clickable) {
          this.map.on('click', countLayerId, (e) => {
            const featuresCluster = mapLibre.queryRenderedFeatures(e.point, { layers: [countLayerId] })
            // console.log('C > DatamiMap > createGeoJsonLayers > clic - cluster-count -  featuresCluster : ', featuresCluster)
            const clusterId = featuresCluster[0].properties.cluster_id
            // console.log('C > DatamiMap > createGeoJsonLayers > clic - cluster-count - clusterId : ', clusterId)
            mapLibre.getSource(geoJsonSourceId.clusterId).getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) { return }
              mapLibre.easeTo({
                center: featuresCluster[0].geometry.coordinates,
                zoom: zoom
              })
            })
          })
          this.map.on('mouseenter', countLayerId, () => {
            mapLibre.getCanvas().style.cursor = 'pointer'
          })
          this.map.on('mouseleave', countLayerId, () => {
            mapLibre.getCanvas().style.cursor = ''
          })
        }
      }

      // UNCLUSTERING
      if (mapLayersOptions.cluster_unclustered_layer && mapLayersOptions.cluster_unclustered_layer.is_activated) {
        const unclusteredLayerConfigOptions = mapLayersOptions.cluster_unclustered_layer
        const unclusteredLayerId = unclusteredLayerConfigOptions.layer_id || 'unclustered-points'
        const unclusteredLayerConfig = createClusterUnclusteredLayer(
          geoJsonSourceId.clusterId,
          unclusteredLayerConfigOptions,
          unclusteredLayerId
        )
        this.map.addLayer(unclusteredLayerConfig)
        this.updateVisibleLayers(unclusteredLayerId, unclusteredLayerConfigOptions.is_default_visible)

        if (unclusteredLayerConfigOptions.is_clickable) {
          // CLICK
          this.map.on('click', unclusteredLayerId, (e) => {
            const featuresPoint = mapLibre.queryRenderedFeatures(e.point, { layers: [unclusteredLayerId] })
            // console.log('C > DatamiMap > createGeoJsonLayers > clic - unclustered-point - featuresPoint : ', featuresPoint)

            const item = featuresPoint[0]
            const itemSource = item.source
            const itemProps = item.properties

            // toggle as selected
            toggleSelectedOn(e, itemSource)

            const pointId = itemProps[itemIdField]
            // console.log('C > DatamiMap > createGeoJsonLayers > clic - unclustered-point - pointId : ', pointId)

            if (unclusteredLayerConfigOptions.direct_to_detail) {
              goToDetailPage(pointId)
            } else {
              const coordinates = e.features[0].geometry.coordinates.slice()
              // console.log('C > DatamiMap > createGeoJsonLayers > clic - unclustered-point - coordinates : ', coordinates)

              // fly to point
              const mapZoomAdd = unclusteredLayerConfigOptions.add_zoom_on_click || 2
              mapLibre.easeTo({
                center: coordinates,
                zoom: mapZoom + mapZoomAdd
              })
              itemProps.lon = coordinates[0]
              itemProps.lat = coordinates[1]
              showItemCard(itemProps)
            }
          })

          this.map.on('mouseenter', unclusteredLayerId, (e) => {
            mapLibre.getCanvas().style.cursor = 'pointer'

            // ADD POPUP ON MARKER IF ACTIVE
            // cf : https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/
            if (unclusteredLayerConfigOptions.has_popup) {
              // const featuresPolygon = mapLibre.queryRenderedFeatures(e.point, { layers: [unclusteredLayerId] })
              // console.log('C > DatamiMap > createAddGeoJsonLayers > hover => featuresPolygon : ', featuresPolygon)

              // const coordinates = e.features[0].geometry.coordinates.slice()
              // const itemProps = featuresPolygon[0].properties
              // console.log('C > DatamiMap > createAddGeoJsonLayers > hover => coordinates : ', coordinates)
              // console.log('C > DatamiMap > createAddGeoJsonLayers > hover => itemProps : ', itemProps)

              const pop = popup
                .setLngLat({ lng: e.lngLat.lng, lat: e.lngLat.lat })
                .setHTML(`
                  <div id="vue-popup-marker">
                  </div>`
                )
              pop.addTo(mapLibre)
              // console.log('C > DatamiMap > createAddGeoJsonLayers > hover => pop : ', pop)

              // const popInstance = new PopupClass({
              //   propsData: {
              //     feature: featuresPolygon[0],
              //     properties: itemProps,
              //     config : unclusteredLayerConfigOptions.popup_config,
              //     locale : loc
              //   },
              // })
              // // console.log('C > DatamiMap > createAddGeoJsonLayers > hover => popInstance : ', popInstance)
              // popInstance.$mount('#vue-popup-marker')
              // pop._update()
            }
          })

          this.map.on('mouseleave', unclusteredLayerId, () => {
            mapLibre.getCanvas().style.cursor = ''
            if (unclusteredLayerConfigOptions.has_popup) {
              popup.remove()
            }
          })
        }
      }
    },
    createAddChoroplethLayers (source) {
      // console.log('\nC > DatamiMap > createAddChoroplethLayers ... ')
      // console.log('C > DatamiMap > createAddChoroplethLayers > source : ', source)

      const mapLibre = this.map
      const choroplethSourceId = source.source_id
      const choroplethLayerId = source.layer_id
      const choroplethSublayers = source.sub_layers
      // console.log('C > DatamiMap > createAddChoroplethLayers > choroplethSourceId : ', choroplethSourceId)
      // console.log('C > DatamiMap > createAddChoroplethLayers > choroplethLayerId : ', choroplethLayerId)
      // console.log('C > DatamiMap > createAddChoroplethLayers > choroplethSublayers : ', choroplethSublayers)

      // const fileId = this.fileId
      // const mapId = this.mapId
      // const locale = this.locale

      if (choroplethSublayers && choroplethSublayers.length) {
        choroplethSublayers.forEach(subLayer => {
          const choroplethConfig = createChoroplethLayer(
            choroplethSourceId,
            subLayer,
            subLayer.layer_id
          )
          // console.log('C > DatamiMap > createAddChoroplethLayers > choroplethConfig : ', choroplethConfig)
          mapLibre.addLayer(choroplethConfig)
          this.updateVisibleLayers(subLayer.layer_id, subLayer.is_default_visible)
          if (subLayer.has_popup) {
            this.createAddChoroplethLayersPopup(subLayer.layer_id, subLayer.popup_config)
          }
        })
      } else {
        const choroplethConfig = createChoroplethLayer(
          choroplethSourceId,
          source,
          choroplethLayerId
        )
        // console.log('C > DatamiMap > createAddChoroplethLayers > choroplethConfig : ', choroplethConfig)
        this.map.addLayer(choroplethConfig)
        this.updateVisibleLayers(choroplethLayerId, source.is_default_visible)
        if (source.has_popup) {
          this.createAddChoroplethLayersPopup(choroplethLayerId, source.popup_config)
        }
      }

      // if (source.has_popup) {
      //   // cf : https://tech.beyondtracks.com/posts/mapbox-gl-popups-with-vue/
      //   // cf : https://github.com/phegman/vue-mapbox-gl
      //   // cf : https://github.com/phegman/vue-mapbox-gl/issues/22

      //   // Create a popup, but don't add it to the map yet
      //   const popup = new Popup({
      //     closeButton: false,
      //     closeOnClick: false
      //   })

      //   this.map.on(source.popup_config.action, choroplethLayerId, (e) => {
      //     // console.log('C > DatamiMap > createAddChoroplethLayers > map.on - choroplethLayerId - e : ', e)

      //     const featuresPolygon = mapLibre.queryRenderedFeatures(e.point, { layers: [choroplethLayerId] })
      //     // console.log("C > DatamiMap > createAddChoroplethLayers > map.on - choroplethLayerId - featuresPolygon : ", featuresPolygon)

      //     // const coordinates = e.features[0].geometry.coordinates.slice()
      //     // console.log('\nC > DatamiMap > createAddChoroplethLayers > map.on - choroplethLayerId - coordinates : ', coordinates)

      //     // Ensure that if the map is zoomed out such that multiple
      //     // copies of the feature are visible, the popup appears
      //     // over the copy being pointed to.
      //     // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      //     //   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      //     // }
      //     // console.log("C > DatamiMap > createAddChoroplethLayers > map.on - choroplethLayerId - coordinates : ", coordinates)

      //     const itemProps = featuresPolygon[0].properties
      //     // console.log('C > DatamiMap > createAddChoroplethLayers > map.on - choroplethLayerId - itemProps : ', itemProps)

      //     const pop = popup
      //       .setLngLat({ lng: e.lngLat.lng, lat: e.lngLat.lat })
      //       .setHTML('<div id="vue-popup-content"></div>')
      //       .addTo(mapLibre)
      //     // console.log('C > DatamiMap > createAddChoroplethLayers > map.on - choroplethLayerId - pop : ', pop)
      //     // console.log("C > DatamiMap > createAddChoroplethLayers > map.on - choroplethLayerId - source.popup_config : ", source.popup_config)

      //     const popupConfig = source.popup_config.fields_settings
      //     const config = Object.keys(popupConfig).map(k => {
      //       return {
      //         ...popupConfig[k],
      //         field: k
      //       }
      //     })
      //     // console.log('C > DatamiMap > createAddChoroplethLayers > map.on - choroplethLayerId - config : ', config)

      //     const popInstance = new PopupClass({
      //       propsData: {
      //         fileId: fileId,
      //         mapId: mapId,
      //         feature: featuresPolygon[0],
      //         item: itemProps,
      //         config: config,
      //         locale: locale
      //       }
      //     })
      //     popInstance.$mount('#vue-popup-content')
      //     // console.log('C > DatamiMap > createAddChoroplethLayers > clic - choroplethLayerId - popInstance : ', popInstance)

      //     pop._update()
      //   })

      //   this.map.on('mouseleave', choroplethLayerId, () => {
      //     mapLibre.getCanvas().style.cursor = ''
      //     popup.remove()
      //   })
      // }
    },
    createAddChoroplethLayersPopup (layerId, popupConfig) {
      const mapLibre = this.map
      const fileId = this.fileId
      const mapId = this.mapId
      const locale = this.locale

      // Create a popup, but don't add it to the map yet
      const popup = new Popup({
        closeButton: false,
        closeOnClick: false
      })

      this.map.on(popupConfig.action, layerId, (e) => {
        // console.log('C > DatamiMap > createAddChoroplethLayers > map.on - choroplethLayerId - e : ', e)

        const featuresPolygon = mapLibre.queryRenderedFeatures(e.point, { layers: [layerId] })
        // console.log("C > DatamiMap > createAddChoroplethLayers > map.on - choroplethLayerId - featuresPolygon : ", featuresPolygon)

        const itemProps = featuresPolygon[0].properties
        // console.log('C > DatamiMap > createAddChoroplethLayers > map.on - choroplethLayerId - itemProps : ', itemProps)

        const pop = popup
          .setLngLat({ lng: e.lngLat.lng, lat: e.lngLat.lat })
          .setHTML('<div id="vue-popup-content"></div>')
          .addTo(mapLibre)
        // console.log('C > DatamiMap > createAddChoroplethLayers > map.on - choroplethLayerId - pop : ', pop)
        // console.log("C > DatamiMap > createAddChoroplethLayers > map.on - choroplethLayerId - popupConfig : ", popupConfig)

        const popupFieldsSettings = popupConfig.fields_settings
        const config = Object.keys(popupFieldsSettings).map(k => {
          return {
            ...popupFieldsSettings[k],
            field: k
          }
        })
        // console.log('C > DatamiMap > createAddChoroplethLayers > map.on - choroplethLayerId - config : ', config)

        const popInstance = new PopupClass({
          propsData: {
            fileId: fileId,
            mapId: mapId,
            feature: featuresPolygon[0],
            item: itemProps,
            config: config,
            locale: locale
          }
        })
        popInstance.$mount('#vue-popup-content')
        // console.log('C > DatamiMap > createAddChoroplethLayers > clic - choroplethLayerId - popInstance : ', popInstance)

        pop._update()
      })

      this.map.on('mouseleave', layerId, () => {
        mapLibre.getCanvas().style.cursor = ''
        popup.remove()
      })
    },

    // - - - - - - - - - - - - - - - - - - //
    // HIGHLIGHTS FUNCTIONS
    // - - - - - - - - - - - - - - - - - - //
    // toggleHighlightOn (event, source) {
    //   const canvas = this.map.getCanvas()
    //   canvas.style.cursor = 'pointer'
    //   if (event.features.length > 0) {
    //     if (this.hoveredStateId[source]) {
    //       this.map.setFeatureState(
    //         { source, id: this.hoveredStateId[source] },
    //         { hover: false }
    //       ) // clean all sources to prevent error
    //     }
    //     this.hoveredStateId[source] = event.features[0].id
    //     this.map.setFeatureState(
    //       { source, id: this.hoveredStateId[source] },
    //       { hover: true }
    //     )
    //   }
    // },
    // toggleHighlightOff (event, source) {
    //   const canvas = this.map.getCanvas()
    //   canvas.style.cursor = ''
    //   if (this.hoveredStateId[source] !== null) {
    //     this.map.setFeatureState(
    //       { source, id: this.hoveredStateId[source] },
    //       { hover: false }
    //     )
    //   }
    // },
    toggleSelectedOn (event, source) {
      if (event.features.length > 0) {
        // console.log('\nC > DatamiMap > toggleSelectedOn > event.features : ', event.features)
        if (this.selectedStateId[source]) {
          this.map.setFeatureState(
            { source, id: this.selectedStateId[source] },
            { selected: false }
          ) // clean all sources to prevent error
        }

        // remove all map markers if any
        this.mapMarkers.forEach(mapMarker => {
          mapMarker.remove()
        })
        this.mapMarkers = []

        // set feature state and marker
        // console.log('C > DatamiMap > toggleSelectedOn > this.selectedStateId[ : ', this.selectedStateId)
        // console.log('C > DatamiMap > toggleSelectedOn > event.features[0] : ', event.features[0])
        this.selectedStateId[source] = event.features[0].id
        this.map.setFeatureState(
          { source, id: this.selectedStateId[source] },
          { selected: true }
        )

        const itemProps = event.features[0].properties
        // console.log('C > DatamiMap > toggleSelectedOn > itemProps : ', itemProps)
        const itemCoordinates = [itemProps[this.fieldLong], itemProps[this.fieldLat]]
        const markerEl = createMarkerElement(this.markerHeight, this.markerWidth, this.markerIcon, this.markerColor)
        // const markerEl = document.createElement('div')
        // markerEl.className = 'marker'
        // markerEl.innerHTML = `<span class="icon" style="height: ${this.markerHeight}px; width: ${this.markerWidth}px; transform: translateY(-${this.markerHeight / 2}px)"><i class="mdi mdi-${this.markerIcon}" style="font-size: ${this.markerHeight}px"></i></span>`
        // // console.log('C > DatamiMap > toggleSelectedOn > markerEl : ', markerEl)
        const marker = new Marker(markerEl).setLngLat(itemCoordinates)
        this.mapMarkers.push(marker)
        marker.addTo(this.map)
      }
    },
    // toggleAllSelectedOff (event, source) {
    //   if (this.hoveredStateId[source] !== null) {
    //     this.map.setFeatureState(
    //       { source, id: this.hoveredStateId[source] },
    //       { selected: false }
    //     )
    //   }
    // },

    // - - - - - - - - - - - - - - - - - - //
    // UX FUNCTIONS
    // - - - - - - - - - - - - - - - - - - //
    updateVisibleLayers (layerId, isVisible) {
      // console.log('\nC > DatamiMap > updateVisibleLayers > layerId : ', layerId)
      // console.log('C > DatamiMap > updateVisibleLayers > isVisible : ', isVisible)
      if (isVisible && !this.visibleLayers.includes(layerId)) {
        this.visibleLayers.push(layerId)
      }
      if (!isVisible && this.visibleLayers.includes(layerId)) {
        this.visibleLayers = this.visibleLayers.filter(l => l !== layerId)
      }
      // console.log('C > DatamiMap > updateVisibleLayers > this.visibleLayers : ', this.visibleLayers)
    },
    switchLayerVisibility (layer) {
      // console.log('\nC > DatamiMap > switchLayerVisibility > layer : ', layer)
      // console.log('C > DatamiMap > switchLayerVisibility > this.layersVisibility.layers_switches : ', this.layersVisibility.layers_switches)
      if (this.layersVisibility.switches_type === 'radio') {
        // console.log('C > DatamiMap > switchLayerVisibility > layer.switchesType : ', layer.switchesType)
        this.layersVisibility.layers_switches.forEach(layers => {
          layers.layers.forEach(layerId => {
            this.map.setLayoutProperty(layerId, 'visibility', 'none')
            this.updateVisibleLayers(layerId, false)
          })
        })
      }
      for (const layerId of layer.layers) {
        const visibility = this.map.getLayoutProperty(layerId, 'visibility')
        if (visibility === 'visible') {
          this.map.setLayoutProperty(layerId, 'visibility', 'none')
          this.updateVisibleLayers(layerId, false)
        } else {
          this.map.setLayoutProperty(layerId, 'visibility', 'visible')
          this.updateVisibleLayers(layerId, true)
        }
      }
    },
    goToDetailPage (itemId) {
      console.log('C > DatamiMap > goToDetailPage > itemId : ', itemId)
    },

    // - - - - - - - - - - - - - - - - - - //
    // ITEM MATCHING
    // - - - - - - - - - - - - - - - - - - //
    getItemField (fieldName) {
      const fieldObj = this.fields.find(f => f.name === fieldName)
      return fieldObj && fieldObj.field
    },
    getBlockField (fieldBlock) {
      // console.log('C > DatamiMap > getBlockField > fieldBlock : ', fieldBlock)
      // console.log('C > DatamiMap > getBlockField > this.contentFields : ', this.contentFields)
      // console.log('C > DatamiMap > getBlockField > this.fields : ', this.fields)

      const contentField = this.mapCardsSettingsMini.find(f => f.position === fieldBlock)
      // const contentField = this.contentFields.find(f => f.position === fieldBlock)
      if (contentField) {
        // console.log('C > DatamiMap > getBlockField > contentField : ', contentField)
        return this.getItemField(contentField.field)
      } else {
        return undefined
      }
    },
    matchItemWithConfig (item, fieldBlock) {
      // const contentField = this.contentFields.find(f => f.position === fieldBlock)
      const contentField = this.getBlockField(fieldBlock)
      if (contentField) {
        return item[contentField]
      } else {
        return undefined
      }
    },
    itemId (item) {
      return this.matchItemWithConfig(item, 'block_id') || item.id
    },
    showItemCard (item) {
      // console.log('C > DatamiMap > showItemCard > item : ', item)
      this.showCard = true
      this.displayedItem = item
      this.displayedItemId = item.id
      // const itemId = this.itemId(item)
      // console.log('C > DatamiMap > showItemCard > itemId : ', itemId)
    },

    // - - - - - - - - - - - - - - - - - - //
    // SIGNALS
    // - - - - - - - - - - - - - - - - - - //
    // handleIconSignal (itemData) {
    //   this.showItemCard(itemData)
    // },
    // getIconSize (item, highlightedItem) {
    //   if (highlightedItem) {
    //     return this.itemId(item, 'block_id') === this.itemId(highlightedItem, 'block_id') ? this.iconSizeHighlighted : this.iconSizeNormal
    //   } else {
    //     return this.iconSizeNormal
    //   }
    // },
    toggleItemCard (event) {
      // console.log('\nC > DatamiMap > toggleItemCard > event : ', event)
      if (event.btn === 'closeButton') {
        this.showCard = false
        this.showDetail = false
        this.displayedItem = undefined
        this.displayedItemId = undefined
      } else {
        this.showCard = true
        if (event.btn === 'showDetailButton') {
          this.showDetail = true
        }
      }
    },
    emitUpdate (event) {
      // console.log('\nC > DatamiMap > emitUpdate > event : ', event)
      this.$emit('updateCellValue', event)
    },
    SendActionToParent (event) {
      this.$emit('action', event)
    },

    // - - - - - - - - - - - - - - - - - - //
    // UTILS
    // - - - - - - - - - - - - - - - - - - //
    joinItemsToPolygon (source, dataLoaded, choroRefIdex, noDataProxy = false) {
      // console.log('\nC > DatamiMap > joinItemsToPolygon ...')
      // console.log('C > DatamiMap > joinItemsToPolygon > source : ', source)
      // console.log('C > DatamiMap > joinItemsToPolygon > source.polygon_prop_id : ', source.polygon_prop_id)
      // console.log('C > DatamiMap > joinItemsToPolygon > source.join_polygon_id_to_field : ', source.join_polygon_id_to_field)
      // console.log('C > DatamiMap > joinItemsToPolygon > source.agregated_data_field : ', source.agregated_data_field)

      // console.log('C > DatamiMap > joinItemsToPolygon > this.contentFields : ', this.contentFields)
      // console.log('C > DatamiMap > joinItemsToPolygon > this.fields : ', this.fields)
      // console.log('C > DatamiMap > joinItemsToPolygon > this.items : ', this.items)

      // modify > agregate data
      this.showLoader = true

      const dataFeatures = dataLoaded.features
      // console.log('C > DatamiMap > joinItemsToPolygon > dataFeatures : ', dataFeatures)
      const jointureFieldPolygon = source.polygon_prop_id
      const jointureFieldItem = this.getItemField(source.join_polygon_id_to_field)
      // console.log('C > DatamiMap > joinItemsToPolygon > jointureFieldItem : ', jointureFieldItem)

      // looping each choropleth source geojson feature
      dataFeatures.forEach(feat => {
        // count joined items for this feature
        const itemsCountResult = this.items.reduce((sum, item) =>
          (String(item[jointureFieldItem]) === String(feat.properties[jointureFieldPolygon]) ? sum + 1 : sum), 0
        )
        feat.properties[source.agregated_data_field] = itemsCountResult

        // added props if any
        if (source.joined_props) {
          source.joined_props.forEach(f => {
            let result
            const aggregType = f.aggregation_type || 'sum'
            switch (aggregType) {
              case 'sum':
                result = this.items.reduce((sum, item) => {
                  // console.log('\n...C > DatamiMap > joinItemsToPolygon > item : ', item)
                  const itemJoinField = String(item[jointureFieldItem])
                  const polygonJoinField = String(feat.properties[jointureFieldPolygon])
                  const itemField = this.getItemField(f.field)
                  // console.log('...C > DatamiMap > joinItemsToPolygon > itemField : ', itemField)
                  // console.log('...C > DatamiMap > joinItemsToPolygon > item[itemField] : ', item[itemField])
                  return itemJoinField === polygonJoinField ? sum + item[itemField] : sum
                }, 0)
                // console.log('...C > DatamiMap > joinItemsToPolygon > result : ', result)
                result = result === 0 ? null : result
                break
              case 'copy':
                result = 'test'
                break
            }
            feat.properties[f.field] = result
          })
        }
      })
      dataLoaded.features = dataFeatures
      // console.log('C > DatamiMap > joinItemsToPolygon > dataLoaded : ', dataLoaded)

      this.map.getSource(source.source_id).setData(dataLoaded)

      this.choroplethGeoJSONS[choroRefIdex].is_loaded = true
      if (!noDataProxy) {
        this.choroplethGeoJSONS[choroRefIdex].data = dataLoaded
      }
      this.showLoader = false
    },
    checkIfStringFloat (value) {
      const val = parseFloat(value)
      if (!isNaN(val)) {
        return val
      } else {
        return false
      }
    },
    checkIfItemHasLatLng (item) {
      const itemLat = item[this.fieldLat]
      const itemLong = item[this.fieldLong]
      return this.checkIfStringFloat(itemLat) && this.checkIfStringFloat(itemLong)
    }
  }
}

</script>

<style lang="css">
@import '~maplibre-gl/dist/maplibre-gl.css';

/* @media screen and (min-width: 1216px)
.controls-container:not(.is-max-desktop) {
  max-width: 1152px;
} */

.map-card {
  z-index: 1;
  position: absolute;
}

.map-bottom-right {
  right: 50px;
  bottom: 25px;
}

.map-mini-card-item {
  z-index: 10;
  left: 50px;
}

.map-detail-card-item {
  z-index: 10;
  width: 75%;
  left: 50%;
  /* -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%); */
}

.big-loader {
  z-index: 10;
  position: absolute !important;
  left: 50%;
  top: calc(50% - 8em);
  border-width: 10px !important;
  /* border: 10px solid #dbdbdb !important; */
  height: 8em !important;
  width: 8em !important;
}

</style>
