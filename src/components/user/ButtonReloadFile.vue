<template>
  <div class="ButtonReloadFile">
    <b-tooltip
      :label="t('reloadFile')"
      type="is-dark"
      position="is-left">
      <b-button
        size="is-small"
        class="ml-1"
        icon-left="reload"
        @click="ReloadFile()">
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
  },
  methods: {
    ReloadFile () {
      return 'TO DO...'
    }
  }
}
</script>
