<template>
  <div
    class="DatamiMapLayers datami-component">
    <div
      class="card map-layers"
      style="">
      <div class="card-content px-2 py-2">
        <b-tooltip
          :label="t(`map.layersBtn`, locale)"
          append-to-body
          position="is-left"
          type="is-dark"
          style="width: 100%">
          <b-button
            type="is-dark"
            size="is-small"
            expanded
            outlined
            @click="toggleBtn">
            {{ t('map.layers', locale) }}
          </b-button>
        </b-tooltip>

        <!-- DEBUGGING -->
        <div
          v-if="debug"
          class="columns is-multiline">
          <!-- isDrawerOpen: <code>{{ isDrawerOpen }}</code><br> -->
          layersSwitches: <br><pre><code>{{ layersSwitches }}</code></pre>
        </div>

        <!-- LAYERS CHECKBOXES -->
        <p
          v-show="isDrawerOpen"
          class="legend-content px-3 pt-3">
          <b-field
            v-for="(layer, index) in visibleLayers"
            :key="`g-map-layer-${mapId}-${index}`"
            class="mb-1">
            <b-checkbox
              v-model="layer.visible"
              type="is-dark"
              @input="switchLayerVisibility(layer)">
              <span :class="`${ layer.visible ? 'has-text-weight-bold' : ''}`">
                {{ layer.label }}
              </span>
            </b-checkbox>
          </b-field>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'DatamiMapLayers',
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: null,
      type: String
    },
    mapId: {
      default: null,
      type: String
    },
    layersSwitches: {
      default: null,
      type: Array
    },
    isDefaultOpen: {
      default: false,
      type: Boolean
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
  data () {
    return {
      isDrawerOpen: false,
      visibleLayers: []
    }
  },
  beforeMount () {
    // console.log('\nC > DatamiMap > beforeMount > this.layersSwitches : ', this.layersSwitches)
    this.isDrawerOpen = this.isDefaultOpen
    this.visibleLayers = this.layersSwitches.map(layer => {
      return {
        label: layer.label,
        layers: layer.layers,
        visible: layer.default_visible
      }
    })
  },
  methods: {
    toggleBtn () {
      this.isDrawerOpen = !this.isDrawerOpen

      // track with matomo
      this.trackEvent(`click-${this.isDrawerOpen ? 'on' : 'off'}`)
    },
    switchLayerVisibility (layer) {
      // console.log('\nC > DatamiMap > switchLayerVisibility > layer : ', layer)
      this.$emit('switchLayer', layer)

      // track with matomo
      this.trackEvent(`${layer.label}-${layer.visible ? 'on' : 'off'}`)
    }
  }
}
</script>

<style scoped>

.map-layers {
  margin-bottom: 5px;
}

</style>
