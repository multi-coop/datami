<template>
  <div
    :class="`datami-tooltip ${positionClass}`"
    :style="`${left}; ${top}; transform: ${transform};${isFixedWidth ? 'width: 300px;' : ''}; ${isDarkMode ? 'color: black; background-color: lightgrey' : ''}`">
    <div v-if="tooltipOptions">
      <!-- INFO -->
      <p
        v-if="tooltipOptions.type === 'info'"
        class="has-text-centered">
        {{ tooltipOptions.label }}
      </p>

      <!-- FIELD -->
      <p
        v-else-if="tooltipOptions.type === 'field'"
        class="">
        <DatamiTooltipField :locale="locale"/>
      </p>

      <!-- FIELDTYPE -->
      <p
        v-else-if="tooltipOptions.type === 'fieldtype'"
        class="">
        <span class="mr-3">
          {{ t('field.type', locale) }} :
        </span>
        <b-icon
          :icon="tooltipOptions.icon"
          class="ml-0 mr-1"
          type="is-white"
          size="is-small"/>
        {{ t(`field.${tooltipOptions.field.type}`, locale) }}
        {{ tooltipOptions.field.subtype ? '(' + t(`field.${tooltipOptions.field.subtype}`, locale) + ')' : '' }}
      </p>

      <!-- TAG -->
      <p
        v-else-if="tooltipOptions.type === 'tag'"
        class="">
        <DatamiTooltipTag :locale="locale"/>
      </p>
    </div>
    <!-- DEBUGGING -->
    <div
      v-if="debugTypes.includes(tooltipOptions.type)"
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
          class="column is-4">
          scrolled : <br>
          <pre style="max-height: 160px;"><code>{{ scrolled }}</code></pre>
        </div>
        <div
          class="column is-8">
          tooltipOptions : <br>
          <pre style="max-height: 150px;"><code>{{ tooltipOptions }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState, mapGetters } from 'vuex'

import { mixinTooltip } from '@/utils/mixins.js'

export default {
  name: 'DatamiTooltip',
  components: {
    DatamiTooltipField: () => import(/* webpackChunkName: "DatamiTooltipField" */ '@/components/user/DatamiTooltipField.vue'),
    DatamiTooltipTag: () => import(/* webpackChunkName: "DatamiTooltipTag" */ '@/components/user/DatamiTooltipTag.vue')
  },
  mixins: [mixinTooltip],
  props: {
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
      debugTypes: [
        // 'field',
        // 'tag',
        // 'info'
      ]
    }
  },
  computed: {
    ...mapState({
      tooltip: (state) => state.showTooltip,
      tooltipOptions: (state) => state.tooltipOptions
    }),
    ...mapGetters({
      t: 'git-translations/getTranslation',
      isDarkMode: 'git-storage/isDarkMode'
    }),
    isFixedWidth () {
      const fixedTypes = ['field', 'tag']
      return this.tooltipOptions && fixedTypes.includes(this.tooltipOptions.type)
    },
    position () {
      return this.tooltipOptions && this.tooltipOptions.position
    },
    positionClass () {
      return (this.position && `is-${this.position}`) || ''
    },
    rect () {
      return this.tooltipOptions && this.tooltipOptions.rect
    },
    left () {
      let left
      if (this.rect) {
        switch (this.position) {
          case 'top':
            left = this.rect.left + (this.rect.width / 2)
            break
          case 'bottom':
            left = this.rect.left + (this.rect.width / 2)
            break
          case 'left':
            left = this.rect.left - 5
            break
          case 'right':
            left = this.rect.right + 5
            break
        }
      }
      return (left && `left: ${left}px`) || 'left: 50%'
    },
    top () {
      let top
      if (this.rect) {
        switch (this.position) {
          case 'top':
            top = this.rect.top - 5
            break
          case 'bottom':
            top = this.rect.bottom + 5
            break
          case 'left':
            top = this.rect.top + (this.rect.height / 2)
            break
          case 'right':
            top = this.rect.top + (this.rect.height / 2)
            break
        }
        top += this.scrolled.top
      }
      return (top && `top: ${top}px`) || 'top: auto'
    },
    transform () {
      let transform
      switch (this.position) {
        case 'top':
          transform = 'translateX(-50%) translateY(-100%)'
          break
        case 'bottom':
          transform = 'translateX(-50%) translateY(100%)'
          break
        case 'left':
          transform = 'translateX(-100%) translateY(-50%)'
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
