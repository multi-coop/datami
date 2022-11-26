<template>
  <div class="DatamiMapGrid datami-component">
    <!-- DISPLAY MAPS -->
    <div
      class="columns is-multiline is-centered">
      <div
        v-for="(map, idx) in mapViewOptions.maps"
        :key="`${fileId}-map-${idx}`"
        :class="`column is-${map.cols || 6}`">
        <!-- {{ map.title[locale] }} -->
        <DatamiMap
          v-if="map.mapOptions"
          :file-id="fileId"
          :map-id="`g-map-${fileId}-${idx}`"
          :map-settings="map"
          :fields="fields"
          :items="items"
          :map-on-top="isMapOnTop(map, idx)"
          :locale="locale"/>
      </div>
    </div>

    <!-- DEBUG -->
    <div
      v-if="debug"
      class="columns is-multiline">
      <div class="column is-4">
        mapViewOptions: <br><pre><code>{{ mapViewOptions }}</code></pre>
      </div>
      <div class="column is-4">
        fields: <br><pre><code>{{ fields }}</code></pre>
      </div>
      <div class="column is-4">
        items: <br><pre><code>{{ items }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script>

import { mixinGlobal, mixinMap } from '@/utils/mixins.js'

// import DatamiMap from '@/components/previews/maps/DatamiMap'

export default {
  name: 'DatamiMapGrid',
  components: {
    // DatamiMap
    DatamiMap: () => import(/* webpackChunkName: "DatamiMap" */ '@/components/previews/maps/DatamiMap.vue')
  },
  mixins: [
    mixinGlobal,
    mixinMap
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    items: {
      default: null,
      type: Array
    },
    fields: {
      default: null,
      type: Array
    },
    locale: {
      default: '',
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    isMapOnTop (map, idx) {
      // console.log('\nC > DatamiMapGrid > isMapOnTop > map : ', map)
      if (!idx) {
        return true
      } else {
        const mapsRange = this.range(idx)
        // console.log('C > DatamiMapGrid > isMapOnTop > mapsRange : ', mapsRange)
        const mapsColsSum = mapsRange.reduce((acc, mapIdx) => {
          return acc + this.mapViewOptions.maps[mapIdx].cols
        }, 0)
        // console.log('C > DatamiMapGrid > isMapOnTop > mapsColsSum : ', mapsColsSum)
        return mapsColsSum <= 12
      }
    }
    // SendActionToParent (event) {
    //   this.$emit('action', event)
    // }
  }
}

</script>
