<template>
  <div class="ButtonChangeUserToken">
    <b-tooltip
      :label="t('changeToken', locale)"
      type="is-dark"
      position="is-left">
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
    locale: {
      default: 'en',
      type: String
    }
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
