<template>
  <b-icon
    :class="`HoverableIconWithTooltip ${customClass}`"
    :size="size"
    :icon="icon"
    @mouseover.native="showGlobalTooltip($event, { position: position, type: type, label: label })"
    @mouseleave.native="hideGlobalTooltip"/>
</template>

<script>

import {
  mixinTooltip
} from '@/utils/mixins.js'

export default {
  name: 'HoverableIconWithTooltip',
  mixins: [
    mixinTooltip
  ],
  props: {
    customClass: {
      default: '',
      type: String
    },
    icon: {
      default: null,
      type: String
    },
    size: {
      default: 'is-small',
      type: String
    },
    position: {
      default: 'top',
      type: String
    },
    type: {
      default: 'info',
      type: String
    },
    label: {
      default: '...',
      type: String
    }
  }
}
</script>
