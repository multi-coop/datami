<template>
  <div
    class="DatamiMapLegend datami-component">
    <div
      class="card map-legend"
      style="">
      <div class="card-content px-2 py-2">
        <div class="content">
          <b-tooltip
            :label="t(`map.legendBtn`, locale)"
            append-to-body
            position="is-left"
            :type="isDarkMode ? 'is-white': 'is-dark'"
            style="width: 100%">
            <b-button
              :type="isDarkMode ? 'is-white': 'is-dark'"
              :class="`${isDarkMode ? 'has-background-dark has-text-white' : ''}`"
              size="is-small"
              :disabled="!currentChoroSource"
              expanded
              outlined
              @click="toggleBtn">
              {{ t('map.legend', locale) }}
            </b-button>
          </b-tooltip>

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
                <span :style="`background-color: ${ scale.color }`"/>
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
                  <span :style="`background-color: ${ scale.color }`"/>
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

import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'DatamiMapLegend',
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
      isDrawerOpen: true
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation'
    })
  },
  beforeMount () {
    // console.log('\nC > DatamiMapLegend > beforeMount > this.currentChoroSource : ', this.currentChoroSource)
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

<style scoped>

.map-legend {
  margin-bottom: 5px;
}

.legend-scale span {
  border-radius: 50%;
  display: inline-block;
  height: 10px;
  margin-right: 5px;
  width: 10px;
}

</style>
