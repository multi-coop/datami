<template>
  <div class="GitributeCredits gitribute-component columns is-centered is-multiline mt-6">
    <!-- CREDITS -->
    <div
      class="column is-full is-italic has-text-centered">
      <p class="has-text-grey is-size-7 mb-2">
        <span>
          {{ t('credits.reclaim', locale) }}
        </span>
        <span>
          {{ t('credits.byLove', locale) }}
        </span>
        <span class="ml-1">
          {{ t('credits.byCooperative', locale) }}
        </span>
        <span
          class="has-text-weight-bold">
          <a
            class="link-multi"
            href="https://multi.coop"
            target="_blank">
            multi
            <!-- <img
              :src="require('@/assets/multi-logo-01.png')"
              class="mini-logo"
              alt="The multi Logo"> -->
          </a>
        </span>
      </p>
      <p>
        <b-button
          icon-left="gitlab"
          tag="a"
          href="https://gitlab.com/multi-coop/gitribute"
          outlined
          target="_blank"
          size="is-small"
          class="ml-3 is-size-7">
          {{ t('credits.code', locale) }}
        </b-button>
      </p>
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

<style scoped>
.link-multi {
  color: grey;
  text-decoration: underline;
}
.mini-logo {
  width: 70px !important;
}
</style>
