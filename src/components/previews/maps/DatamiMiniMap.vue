<template>
  <div
    class="DatamiMiniMap datami-component">
    <!-- DISPLAY MAP -->
    <div
      :id="mapId"
      :ref="`container-minimap-${mapId}`"
      :style="`height: ${minimapHeight}px; width: 100%;`">
      <!-- MINIMAP CONTAINER -->
    </div>
  </div>
</template>

<script>
import {
  Map,
  Marker,
  NavigationControl
} from 'maplibre-gl'

import { mixinGlobal } from '@/utils/mixins.js'
import { StylesOSM } from '@/utils/mapVectorStyles.js'

import {
  createMarkerElement
} from '@/utils/mapUtils.js'

export default {
  name: 'DatamiMiniMap',
  mixins: [
    mixinGlobal
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
    fields: {
      default: null,
      type: Array
    },
    item: {
      default: null,
      type: Object
    },
    showDetailCard: {
      default: false,
      type: Boolean
    },
    locale: {
      default: 'fr',
      type: String
    }
  },
  data () {
    return {
      map: undefined,
      minimapHeight: 175,

      mapStyle: StylesOSM.testRasterVoyager, // OK better - default

      center: undefined,
      zoom: undefined,
      maxZoom: undefined,
      minZoom: undefined,
      interactive: false,

      item_geo_fields: {
        latitude: 'lat',
        longitude: 'lon'
      },
      fieldLat: undefined,
      fieldLong: undefined,

      marker: undefined,
      markerIcon: 'map-marker',
      markerHeight: 40,
      markerWidth: 40,
      markerColor: '#4a4a4a'
    }
  },
  computed: {
    mapOptions () {
      return this.cardsSettingsMiniMap.mapOptions
    }
  },
  watch: {
    item (next) {
      // console.log('\nC > DatamiMiniMap > watch > item > next : ', next)
      const newCenter = [next[this.fieldLong], next[this.fieldLat]]
      this.marker.setLngLat(newCenter)
      this.map.easeTo({
        center: newCenter,
        zoom: this.zoom
      })
    },
    currentViewMode (next) {
      if (next === 'map' && this.map) {
        this.map.redraw()
      }
    },
    currentEditViewMode () {
      if (this.map) {
        this.map.redraw()
      }
    }
  },
  beforeMount () {
    // console.log('\nC > DatamiMiniMap > beforeMount > this.item : ', this.item)
    const mapOptions = this.mapOptions

    // set up map's basic parameters
    this.minimapHeight = mapOptions.height ?? this.minimapHeight
    this.zoom = mapOptions.zoom_item || 13
    this.maxZoom = mapOptions.maxZoom
    this.minZoom = mapOptions.minZoom
    this.mapStyle = mapOptions.mapStyle ? StylesOSM[mapOptions.mapStyle] : this.mapStyle // StylesOSM.testRasterVoyager // OK better

    // set up lat/long fields
    this.item_geo_fields = mapOptions.item_geo_fields || { latitude: 'lat', longitude: 'lon' }
    // console.log('C > DatamiMiniMap > beforeMount > this.item_geo_fields : ', this.item_geo_fields)

    this.fieldLat = this.fields.find(f => f.name === this.item_geo_fields.latitude).field
    this.fieldLong = this.fields.find(f => f.name === this.item_geo_fields.longitude).field
    // console.log('C > DatamiMiniMap > beforeMount > this.fieldLat : ', this.fieldLat)
    // console.log('C > DatamiMiniMap > beforeMount > this.fieldLong : ', this.fieldLong)

    // set up map's center
    this.center = [this.item[this.fieldLong], this.item[this.fieldLat]]

    // set up item's marker
    this.markerIcon = mapOptions.marker_icon ? mapOptions.marker_icon : this.markerIcon
    this.markerHeight = mapOptions.marker_height ? mapOptions.marker_height : this.markerHeight
    this.markerWidth = mapOptions.marker_width ? mapOptions.marker_width : this.markerWidth
    this.markerColor = mapOptions.marker_color ? mapOptions.marker_color : this.markerColor
  },
  mounted () {
    this.initializeMiniMap()
  },
  methods: {
    initializeMiniMap () {
      // console.log('\nC > DatamiMiniMap > initializeMiniMap > this.item : ', this.item)
      // console.log('C > DatamiMiniMap > initializeMiniMap > this.item.id : ', this.item.id)
      // console.log('C > DatamiMiniMap > initializeMiniMap > this.item[2] : ', this.item[2])
      // Note: MapLibre GL uses longitude, latitude coordinate order (as opposed to latitude, longitude) to match GeoJSON.
      // cf : https://maplibre.org/maplibre-gl-js-docs/api/map/#map-parameters
      const map = new Map({
        container: this.mapId,
        center: this.center,
        // center: [0, 0],
        zoom: this.zoom,
        maxZoom: this.maxZoom,
        minZoom: this.minZoom,
        style: this.mapStyle
      })
      map.dragRotate.disable()
      // map.dragPan.disable()
      map.scrollZoom.disable()
      map.touchZoomRotate.disableRotation()

      // console.log('C > DatamiMiniMap > initializeMiniMap > map : ', map)
      map.on('load', async () => {
        // add navigation control
        const navCtrl = new NavigationControl({ showCompass: false })
        map.addControl(navCtrl, 'bottom-right')

        const markerEl = createMarkerElement(this.markerHeight, this.markerWidth, this.markerIcon, this.markerColor)
        //         const markerEl = document.createElement('div')
        //         markerEl.className = 'marker'
        //         markerEl.innerHTML = `
        // <span
        //   class="icon"
        //   style="height: ${this.markerHeight}px; width: ${this.markerWidth}px; transform: translateY(-${this.markerHeight / 2}px)">
        //   <i
        //     class="mdi mdi-${this.markerIcon}"
        //     style="font-size: ${this.markerHeight}px">
        //   </i>
        // </span>`
        //         console.log('C > DatamiMiniMap > initializeMiniMap > markerEl : ', markerEl)

        const marker = new Marker(markerEl).setLngLat(this.center)
        marker.addTo(map)
        this.marker = marker
      })

      this.map = map
    }
  }
}
</script>
