<template>
  <div
    :class="`datami-tooltip ${positionClass}`"
    :style="`${left}; ${top}; transform: ${transform};`">
    <div v-if="tooltipOptions">
      <p
        v-if="tooltipOptions.type === 'info'"
        class="has-text-centered">
        {{ tooltipOptions.label }}
      </p>
      <p
        v-else-if="tooltipOptions.type === 'field'"
        class="">
        FIELD
      </p>
      <p
        v-else-if="tooltipOptions.type === 'tag'"
        class="">
        TAG
      </p>
    </div>
    <!-- DEBUGGING -->
    <div
      v-if="tooltipOptions"
      class="mt-3 px-2 py-2"
      style="background-color: grey;">
      <p class="mb-2 has-text-centered">
        DEBUG DATAMI-TOOLTIP
      </p>
      <div
        class="columns is-multiline">
        <div class="column is-6">
          isDarkMode : <code>{{ !!isDarkMode }}</code><br>
          tooltip : <code>{{ tooltip }}</code><br>
          tooltipOptions.position : <code>{{ tooltipOptions && tooltipOptions.position }}</code><br>
          tooltipOptions.type : <code>{{ tooltipOptions && tooltipOptions.type }}</code>
        </div>
        <div class="column is-6">
          top : <code>{{ top }}</code><br>
          left : <code>{{ left }}</code><br>
          transform : <code>{{ transform }}</code>
        </div>
        <div
          v-if="tooltipOptions.type !== 'info'"
          class="column is-12">
          tooltipOptions : <br>
          <pre><code>{{ tooltipOptions }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState, mapGetters } from 'vuex'

export default {
  name: 'DatamiTooltip',
  props: {
    debug: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    ...mapState({
      tooltip: (state) => state.showTooltip,
      tooltipOptions: (state) => state.tooltipOptions
    }),
    ...mapGetters({
      isDarkMode: 'git-storage/isDarkMode'
    }),
    position () {
      return this.tooltipOptions && this.tooltipOptions.position
    },
    positionClass () {
      return this.position && `is-${this.position}`
    },
    rect () {
      return this.tooltipOptions && this.tooltipOptions.rect
    },
    left () {
      let pos
      let left
      if (this.rect) {
        switch (this.position) {
          case 'top':
            pos = 'left'
            left = this.rect.left
            break
          case 'left':
            pos = 'left'
            left = this.rect.left - 450
            break
          case 'right':
            pos = 'left'
            left = this.rect.right
            break
        }
      }
      return (left && `${pos}: ${left}px`) || `${pos}: 50%`
    },
    top () {
      const pos = 'top'
      let top = this.rect && this.rect.top
      if (top && this.position === 'top') {
        top -= 5
      }
      return (top && `${pos}: ${top}px`) || `${pos}: auto`
    },
    transform () {
      let transform
      switch (this.position) {
        case 'top':
          transform = 'translateX(-50%) translateY(-100%)'
          break
        case 'left':
          transform = 'translateY(-50%)'
          break
        case 'right':
          transform = 'translateY(-50%)'
          break
      }
      return transform
    }
  }
}
</script>
