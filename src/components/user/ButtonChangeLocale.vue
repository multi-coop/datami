<template>
  <div class="ButtonChangeLocale datami-component">
    <!-- {{ currentLocale(locale) }} -
    {{ allowedLocales }} -->
    <div class="dropdown is-hoverable is-right">
      <div class="dropdown-trigger">
        <b-button
          size="is-small"
          :class="`ml-1 is-small ${isDarkMode ? 'has-background-dark has-text-white' : ''}`"
          :type="isDarkMode ? 'is-white' : ''"
          :outlined="isDarkMode"
          icon-left="translate"
          aria-haspopup="true"
          aria-controls="dropdown-locales"/>
        <div
          id="dropdown-locales"
          class="dropdown-menu"
          role="menu"
          style="z-index: 90;">
          <div class="dropdown-content">
            <div class="dropdown-item">
              <span class="is-italic">
                {{ t('actions.changeLocale', locale) }}
              </span>
            </div>
            <hr class="dropdown-divider">
            <a
              v-for="loc in allowedLocales"
              :key="loc.locale"
              :class="`dropdown-item ${ loc.locale === currentLocale(locale) ? 'is-active is-dark' : ''}`"
              @click="changeLocale(loc.locale)">
              <span
                :class="`${ loc.locale === currentLocale(locale) ? 'has-text-weight-bold' : ''}`">
                {{ loc.label }}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonChangeLocale',
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: null,
      type: String
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  computed: {
    ...mapState({
      allowedLocales: (state) => state['git-translations'].allowedLocales
    }),
    ...mapGetters({
      currentLocale: 'git-translations/getCurrentLocale'
    })
  },
  methods: {
    ...mapActions({
      updateUserLocale: 'git-user/updateUserLocale',
      updateLocaleGlobally: 'git-translations/updateLocaleGlobally'
    }),
    changeLocale (locale) {
      this.updateUserLocale(locale)
      this.updateLocaleGlobally(locale)

      // track with matomo
      this.trackEvent(locale)
    }
  }
}
</script>
