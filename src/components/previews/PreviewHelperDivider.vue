<template>
  <div
    class="PreviewHelperDivider divider my-0">
    <span class="no-text-transform is-size-6 has-text-grey-light">
      <b-icon
        :icon="icon"
        size="is-small"/>
      {{ t( `preview.${ code }`, locale) }}
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PreviewHelperDivider',
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
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation'
    })
  }
}
</script>
