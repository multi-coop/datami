<template>
  <div class="ButtonWrapCell pl-2 pr-1">
    <b-tooltip
      v-if="showExpand"
      :label="t(`actions.${ nowrap ? 'expandCell' : 'reduceCell'}`, locale)"
      append-to-body
      :type=" `${isDarkMode ? 'is-white' : 'is-dark'}`">
      <b-icon
        :icon="`arrow-${nowrap ? 'expand' : 'collapse'}`"
        :type="nowrap ? 'is-grey-light' : 'is-dark'"
        size="is-small"
        @click.native="handleInput(!nowrap)"/>
    </b-tooltip>
    <b-icon
      v-else
      size="is-small"/>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonWrapCell',
  mixins: [mixinGlobal],
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

.ButtonWrapCell {
  position: relative;
  left: -2px;
  top: 0px;
}

</style>
