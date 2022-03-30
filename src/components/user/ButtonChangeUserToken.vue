<template>
  <div class="ButtonChangeUserToken">
    <b-tooltip
      :label="t('changeToken')"
      position="is-bottom">
      <b-button
        size="is-small"
        class="ml-1"
        icon-left="account">
      </b-button>
    </b-tooltip>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ButtonChangeUserToken',
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
