<template>
  <div
    class="ButtonWrapCell pl-2 pr-1"
    style="position: relative; left: -2px; top: 0px;">
    <b-tooltip
      v-if="showExpand"
      :label="t(`actions.${ nowrap ? 'expandCell' : 'reduceCell'}`, locale)"
      :type="`${isDarkMode ? 'is-white' : 'is-dark'}`">
      <!-- append-to-body -->
      <b-icon
        :icon="`arrow-${nowrap ? 'expand' : 'collapse'}`"
        :type="nowrap ? 'is-grey-light' : 'is-dark'"
        size="is-small"
        @click.native="handleInput(!nowrap)"
        @mouseover.native="showGlobalTooltip($event, { position: 'left', type: 'info', label: t(`actions.${ nowrap ? 'expandCell' : 'reduceCell'}`, locale) })"
        @mouseleave.native="hideGlobalTooltip"/>
    </b-tooltip>
    <b-icon
      v-else
      size="is-small"/>
  </div>
</template>

<script>
import { mixinTooltip, mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonWrapCell',
  mixins: [
    mixinTooltip,
    mixinGlobal
  ],
  model: {
    prop: 'hidden',
    event: 'blur'
  },
  props: {
    hidden: {
      default: false,
      type: Boolean
    },
    showExpand: {
      default: false,
      type: Boolean
    },
    locale: {
      default: '',
      type: String
    }
  },
  computed: {
    nowrap () {
      return this.hidden
    }
  },
  methods: {
    handleInput (value) {
      this.$emit('blur', value)
    }
  }
}
</script>

<style scoped>

/* .ButtonWrapCell {
  position: relative;
  left: -2px;
  top: 0px;
} */

</style>
