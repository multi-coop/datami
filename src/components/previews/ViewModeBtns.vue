<template>
  <div class="ViewModeBtns datami-component is-flex is-align-items-center">
    <!-- BUTTONS -->
    <div class="dropdown is-hoverable is-left">
      <div class="dropdown-trigger">
        <b-button
          size="is-small"
          :class="`ml-1 mr-2 ${isDarkMode ? 'has-background-dark has-text-white' : ''}`"
          :type="isDarkMode ? 'is-white' : ''"
          :outlined="isDarkMode"
          :icon-left="getIcon(currentViewMode)"
          aria-haspopup="true"
          :disabled="btnsEdit.length < 2"
          aria-controls="dropdown-views"/>
        <div
          v-if="btnsEdit.length > 1"
          id="dropdown-views"
          :class="`dropdown-menu datami-dropdown-viewmode-${isDarkMode ? 'darkmode' : 'clearmode'}`"
          role="menu"
          style="z-index: 90;">
          <div class="dropdown-content">
            <div class="dropdown-item">
              <span class="is-italic">
                {{ t('actions.changeViewMode', locale) }}
              </span>
            </div>
            <hr class="dropdown-divider">
            <a
              v-for="btn in btnsEdit"
              :key="btn.code"
              :class="`dropdown-item ${ btn.code === currentViewMode ? 'is-active' : ''}`"
              @click="changeView(btn.code)">
              <b-icon
                class="media-left"
                size="is-small"
                :icon="btn.icon"/>
              <span
                :class="`${ btn.code === currentViewMode ? 'has-text-weight-bold' : ''}`">
                {{ t(btn.textCode, locale) }}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- DEBUG -->
    <div v-if="debug">
      <p>
        currentViewMode: {{ currentViewMode }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import { mixinGlobal } from '@/utils/mixins.js'
import { viewsOptions } from '@/utils/fileTypesUtils.js'

export default {
  name: 'ViewModeBtns',
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: undefined,
      type: String
    },
    locale: {
      default: 'en',
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      buttonsView: viewsOptions
    }
  },
  computed: {
    btnsEdit () {
      const views = {
        table: true,
        cards: this.cardsViewIsActive,
        dataviz: this.datavizViewIsActive,
        map: this.mapViewIsActive
      }
      return this.buttonsView.filter(v => views[v.code])
    }
  },
  watch: {
    fileOptions (next) {
      // console.log('C > ViewModeBtns > watch > fileOptions > next : ', next)
      if (next) {
        // const defaultViews = [
        //   {
        //     view: 'cards',
        //     activate: this.cardsViewIsActive,
        //     isDefault: this.cardsViewIsActive && this.cardsViewIsDefault
        //   },
        //   {
        //     view: 'dataviz',
        //     activate: this.datavizViewIsActive,
        //     isDefault: this.datavizViewIsActive && this.datavizViewIsDefault
        //   },
        //   {
        //     view: 'map',
        //     activate: this.mapViewIsActive,
        //     isDefault: this.mapViewIsActive && this.mapViewIsDefault
        //   },
        //   {
        //     view: 'table',
        //     activate: true,
        //     isDefault: true
        //   }
        // ]
        // const defaultView = defaultViews.find(v => v.isDefault)
        // console.log(defaultView)
        // console.log('C > ViewModeBtns > watch > fileOptions > defaultView : ', defaultView)
        this.changeView(this.getUserLastView)
      }
    }
  },
  beforeMount () {
    // console.log('\nC > ViewModeBtns > beforeMount > this.fileId : ', this.fileId)
    // console.log('C > ViewModeBtns > beforeMount > this.fileOptions : ', this.fileOptions)
    // this.changeView('table')
    this.initializeUserLastView(this.fileId)
    this.changeViewMode({ fileId: this.fileId, mode: this.getUserLastView })
  },
  methods: {
    ...mapActions({
      changeViewMode: 'git-data/changeViewMode',
      initializeUserLastView: 'git-storage/initializeUserLastView',
      saveUserLastView: 'git-storage/saveUserLastView'
    }),
    changeView (code) {
      this.saveUserLastView(code)
      this.changeViewMode({ fileId: this.fileId, mode: this.getUserLastView })
      this.trackEvent(code)
    },
    getIcon (code) {
      const btn = this.buttonsView.find(btn => btn.code === code)
      return btn && btn.icon
    }
  }
}
</script>

<style scoped>
  .is-active {
    background-color: #000000 !important;
  }

  .datami-dropdown-viewmode-darkmode > .dropdown-content {
    color: white !important;
    background-color: black !important;
  }
  .datami-dropdown-viewmode-clearmode > .dropdown-content {
    color: black !important;
    background-color: white !important;
  }

  .datami-dropdown-viewmode-darkmode > .dropdown-content > .dropdown-item {
    color: white !important;
  }

  .datami-dropdown-viewmode-darkmode > .dropdown-content > .dropdown-item.is-active {
    color: black !important;
    background-color: white !important;
  }
  .datami-dropdown-viewmode-clearmode > .dropdown-content > .dropdown-item.is-active {
    color: white !important;
    background-color: black !important;
  }

  .datami-dropdown-viewmode-darkmode > .dropdown-content > a.dropdown-item:hover:not(.is-active) {
    color: black !important;
  }

</style>
