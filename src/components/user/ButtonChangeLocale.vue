<template>
  <div class="ButtonChangeLocale">
    <!-- {{ currentLocale(locale) }} -
    {{ allowedLocales }} -->
    <div class="dropdown is-hoverable is-right">
      <div class="dropdown-trigger">
        <b-button
          size="is-small"
          class="ml-1"
          icon-left="translate"
          aria-haspopup="true"
          aria-controls="dropdown-locales">
        </b-button>
        <div
          class="dropdown-menu"
          id="dropdown-locales"
          role="menu">
          <div class="dropdown-content">
            <div class="dropdown-item">
              <span class="is-italic">
                {{ t('changeLocale', locale) }}
              </span>
            </div>
            <hr class="dropdown-divider">
            <a
              v-for="loc in allowedLocales"
              :key="loc.locale"
              :class="`dropdown-item ${ loc.locale === currentLocale(locale) ? 'is-active' : ''}`"
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
    <!-- <b-dropdown
      :triggers="['hover']"
      position="is-bottom-right"
      append-to-body
      aria-role="list">
      <template #trigger>
        <b-button
          size="is-small"
          class="ml-1"
          icon-right="translate"/>
      </template>
      <b-dropdown-item
        v-for="loc in allowedLocales"
        :key="loc.locale"
        aria-role="listitem">
        {{ loc.label }}
      </b-dropdown-item>
    </b-dropdown> -->
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ButtonChangeLocale',
  props: {
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {
      // showLocales: false
    }
  },
  computed: {
    ...mapState({
      allowedLocales: (state) => state['git-translations'].allowedLocales
    }),
    ...mapGetters({
      t: 'git-translations/getTranslation',
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
    }
  }
}
</script>
