<template>
  <div class="ButtonChangeLocale">
    <b-tooltip
      :label="t('translate')"
      position="is-bottom">
      <b-button
        size="is-small"
        class="ml-1"
        icon-left="translate">
      </b-button>
    </b-tooltip>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ButtonChangeLocale',
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
    ...mapActions({
      updateLocale: 'git-user/updateLocale'
    }),
    changeLocale () {
      this.updateLocale(this.locale)
    }
  }
}
</script>
