<template>
  <div class="columns is-centered is-multiline mt-6">
    <!-- CREDITS -->
    <div class="column is-full is-italic has-text-centered">
      <span class="has-text-grey is-size-6">
        {{ t('reclaim', locale) }}
      </span>
      <a
        href="https://multi.coop"
        target="_blank">
        multi
      </a>
      <b-button
        icon-left="gitlab"
        tag="a"
        href="https://gitlab.com/multi-coop/gitribute"
        outlined
        size="is-small"
        class="ml-3">
        {{ t('code', locale) }}
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default ({
  name: 'GitributeCredits',
  props: {
    locale: {
      default: '',
      type: String
    }
  },
  computed: {
    ...mapState({
      testTranslation: (state) => state['git-translations'].test
    }),
    ...mapGetters({
      t: 'git-translations/getTranslation'
    })
  },
  beforeMount () {
    // console.log('\nC > GitributeCredits > beforeMount > this.locale : ', this.locale)
  }
})
</script>
