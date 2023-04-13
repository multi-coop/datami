<template>
  <div
    class="DatamiMapLegend datami-component">
    <div
      v-if="currentChoroSource && (currentChoroSource.legend || currentChoroSource.sublayers_legend)"
      class="card map-legend"
      :style="cssMapLegend.join(';')">
      <div class="card-content px-2 py-2">
        <div class="content">
          <b-button
            :type="isDarkMode ? 'is-white': 'is-dark'"
            :class="`${isDarkMode ? 'has-background-dark has-text-white' : ''}`"
            size="is-small"
            :disabled="!currentChoroSource"
            expanded
            outlined
            @click="toggleBtn"
            @mouseover="showGlobalTooltip($event, { position: 'left', type: 'info', label: t(`map.legendBtn`, locale) })"
            @mouseleave="hideGlobalTooltip">
            {{ t('map.legend', locale) }}
          </b-button>

          <!-- DEBUGGING -->
          <div
            v-if="debug"
            class="columns is-multiline">
            <div
              v-if="true"
              class="column is-12">
              visibleLayers: <br><code>{{ visibleLayers }}</code>
            </div>
            <div
              v-if="false"
              class="column is-6">
              <!-- isDrawerOpen: <code>{{ isDrawerOpen }}</code><br> -->
              currentChoroSource.legend: <br><pre><code>{{ currentChoroSource.legend }}</code></pre>
            </div>
            <div
              v-if="false"
              class="column is-6">
              currentChoroSource.sublayers_legend: <br><pre><code>{{ currentChoroSource.sublayers_legend }}</code></pre>
            </div>
          </div>

          <!-- SCALES -->
          <div
            v-if="isDrawerOpen && currentChoroSource"
            class="legend-scales-content px-3 pt-2">
            <!-- MAIN LEGEND IF ANY -->
            <div v-if="currentChoroSource.legend">
              <p class="has-text-weight-bold mb-1 mt-2">
                {{ currentChoroSource.legend.title }}
              </p>
              <div
                v-for="(scale, index) in currentChoroSource.legend.scales"
                :key="`g-map-scale-${mapId}-${index}`"
                class="legend-scale">
                <b-image
                  v-if="currentChoroSource.legend.useSymbols"
                  :src="scale.symbol"
                  class="g-map-legend-symbol"/>
                <span
                  v-else
                  class="g-map-scale-circle"
                  :style="`background-color: ${ scale.color }; ${ cssLegendScale.join(';') }`"/>
                {{ scale.value }}
              </div>
            </div>

            <!-- SUBLAYERS LEGENDS IF ANY -->
            <div v-if="currentChoroSource.sublayers_legend">
              <div
                v-for="(legendObj, index) in currentChoroSource.sublayers_legend.filter(l => visibleLayers.includes(l.layer_id))"
                :key="`g-map-scale-${mapId}-sublegend-${index}`">
                <p class="has-text-weight-bold mb-1 mt-2">
                  {{ legendObj.legend.title }}
                </p>
                <div
                  v-for="(scale, i) in legendObj.legend.scales"
                  :key="`g-map-scale-${mapId}-sublegend-${index}-${i}`"
                  class="legend-scale">
                  <span
                    class="g-map-scale-circle"
                    :style="`background-color: ${ scale.color }; ${ cssLegendScale.join(';') }`"/>
                  {{ scale.value }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { mixinTooltip, mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'DatamiMapLegend',
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
    currentChoroSource: {
      default: null,
      type: Object
    },
    visibleLayers: {
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
      isDrawerOpen: true,
      cssMapLegend: ['margin-bottom: 5px'],
      cssLegendScale: [
        'border-radius: 50% !important',
        'display: inline-block !important',
        'height: 10px !important',
        'margin-right: 5px !important',
        'width: 10px !important'
      ]
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation'
    })
  },
  beforeMount () {
    // console.log('\nC > DatamiMapLegend > beforeMount > this.currentChoroSource : ', this.currentChoroSource)
    // console.log('C > DatamiMapLegend > beforeMount > this.isDefaultOpen : ', this.isDefaultOpen)
    this.isDrawerOpen = this.isDefaultOpen
  },
  methods: {
    toggleBtn () {
      this.isDrawerOpen = !this.isDrawerOpen

      // track with matomo
      this.trackEvent(`click-${this.isDrawerOpen ? 'on' : 'off'}`)
    }
  }
}
</script>
