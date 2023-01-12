<template>
  <div
    class="DatamiMapLayers datami-component">
    <div
      class="card map-layers"
      style="">
      <div class="card-content px-2 py-2">
        <b-button
          :type="isDarkMode ? 'is-white': 'is-dark'"
          :class="`${isDarkMode ? 'has-background-dark has-text-white' : ''}`"
          size="is-small"
          expanded
          outlined
          @click="toggleBtn"
          @mouseover="showGlobalTooltip($event, { position: 'left', type: 'info', label: t(`map.layersBtn`, locale) })"
          @mouseleave="hideGlobalTooltip">
          {{ t('map.layers', locale) }}
        </b-button>

        <!-- DEBUGGING -->
        <div
          v-if="debug"
          class="columns is-multiline">
          <div class="column is-12">
            <!-- isDrawerOpen: <code>{{ isDrawerOpen }}</code><br> -->
            <!-- layersSwitches: <br><pre><code>{{ layersSwitches }}</code></pre> -->
            radioChoice: <code>{{ radioChoice }}</code><br>
          </div>
          <div class="column is-12">
            visibleLayers: <br><pre><code>{{ visibleLayers }}</code></pre>
          </div>
        </div>

        <!-- LAYERS CHECKBOXES / RADIO -->
        <p
          v-show="isDrawerOpen"
          class="legend-content px-3 pt-3">
          <b-field
            v-for="(layer, index) in visibleLayers"
            :key="`g-map-layer-${mapId}-${index}`"
            class="mb-1">
            <b-checkbox
              v-if="switchesType === 'checkbox'"
              v-model="layer.visible"
              type="is-dark"
              @input="switchLayerVisibility(layer)">
              <span :class="`${ layer.visible ? 'has-text-weight-bold' : ''}`">
                {{ layer.label }}
              </span>
            </b-checkbox>
            <b-radio
              v-if="switchesType === 'radio'"
              v-model="radioChoice"
              :native-value="layer.index"
              type="is-dark">
              <span :class="`${ layer.index === radioChoice ? 'has-text-weight-bold' : ''}`">
                {{ layer.label }}
                <!-- DEBUGGING -->
                <!-- <br><code>{{ layer }}</code> -->
              </span>
            </b-radio>
          </b-field>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinTooltip, mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'DatamiMapLayers',
  mixins: [
    mixinTooltip,
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
    layersSwitches: {
      default: null,
      type: Array
    },
    switchesType: {
      default: 'checkbox',
      type: String
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
      visibleLayers: [],
      radioChoice: undefined,
      switchesAreSet: false
    }
  },
  watch: {
    radioChoice (next) {
      if (this.switchesAreSet && next) {
        const layer = this.visibleLayers.find(l => l.index === next)
        this.switchLayerVisibility(layer)
      }
    }
  },
  beforeMount () {
    // console.log('\nC > DatamiMapLayers > beforeMount > this.layersSwitches : ', this.layersSwitches)
    this.isDrawerOpen = this.isDefaultOpen
    this.visibleLayers = this.layersSwitches.map((layer, i) => {
      return {
        index: `${this.mapId}-layer-switch-${i}`,
        label: layer.label,
        layers: layer.layers,
        visible: layer.default_visible
      }
    })
    if (this.switchesType === 'radio') {
      this.radioChoice = this.visibleLayers.find(l => l.visible).index
    }
    this.switchesAreSet = true
  },
  methods: {
    toggleBtn () {
      this.isDrawerOpen = !this.isDrawerOpen

      // track with matomo
      this.trackEvent(`click-${this.isDrawerOpen ? 'on' : 'off'}`)
    },
    switchLayerVisibility (layer) {
      // console.log('\nC > DatamiMapLayers > switchLayerVisibility > layer : ', layer)
      this.$emit('switchLayer', layer)

      // track with matomo
      this.trackEvent(`${layer.label}-${layer.visible ? 'on' : 'off'}`)
    }
  }
}
</script>
