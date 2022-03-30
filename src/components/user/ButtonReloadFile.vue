<template>
  <div class="ButtonReloadFile">
    <b-tooltip
      :label="t('reload')"
      position="is-bottom">
      <b-button
        size="is-small"
        class="ml-1"
        icon-left="reload">
      </b-button>
    </b-tooltip>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ButtonReloadFile',
  props: {
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
    }),
    ...mapGetters({
      t: 'git-translations/getTranslation'
    })
  }
}
</script>
