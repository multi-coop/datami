<template>
  <div class="ButtonDownloadFile">
    <b-tooltip
      :label="t('download')"
      position="is-bottom">
      <b-button
        size="is-small"
        class="ml-1"
        icon-left="download">
      </b-button>
    </b-tooltip>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ButtonDownloadFile',
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
