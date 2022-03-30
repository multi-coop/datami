<template>
  <div class="ButtonDownloadFile">
    <b-tooltip
      :label="t('downloadFile')"
      type="is-dark"
      position="is-left">
      <b-button
        size="is-small"
        class="ml-1"
        icon-left="download"
        @click="DownloadFile()">
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
  },
  methods: {
    DownloadFile () {
      return 'TO DO...'
    }
  }
}
</script>
