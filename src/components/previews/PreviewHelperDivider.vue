<template>
  <div
    class="PreviewHelperDivider datami-component divider my-0">
    <span class="no-text-transform is-size-6 has-text-grey-light">
      <b-icon
        :icon="icon"
        size="is-small"/>
      {{ t( `preview.${ code }`, locale) }}
    </span>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'PreviewHelperDivider',
  mixins: [mixinGlobal],
  props: {
    icon: {
      default: '',
      type: String
    },
    code: {
      default: '',
      type: String
    },
    locale: {
      default: '',
      type: String
    }
  }
}
</script>
