<template>
  <div class="GitributeCredits columns is-centered is-multiline mt-6">
    <!-- CREDITS -->
    <div
      class="column is-full is-italic has-text-centered">
      <span
        class="has-text-grey is-size-7"
        v-html="t('credits.reclaim', locale, true)"/>
      <span
        class="has-text-grey is-size-7">
        <a
          href="https://multi.coop"
          target="_blank">
          multi
          <!-- <img
            :src="require('@/assets/multi-logo-01.png')"
            class="mini-logo"
            alt="The multi Logo"> -->
        </a>
      </span>
      <b-button
        icon-left="gitlab"
        tag="a"
        href="https://gitlab.com/multi-coop/gitribute"
        outlined
        size="is-small"
        class="ml-3 is-size-7">
        {{ t('credits.code', locale) }}
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mixinGlobal } from '@/utils/mixins.js'

export default ({
  name: 'GitributeCredits',
  mixins: [mixinGlobal],
  props: {
    locale: {
      default: '',
      type: String
    }
  },
  computed: {
    ...mapState({
      testTranslation: (state) => state['git-translations'].test
    })
  },
  beforeMount () {
    // console.log('\nC > GitributeCredits > beforeMount > this.locale : ', this.locale)
  }
})
</script>

<style>
.mini-logo {
  width: 70px !important;
}
</style>
