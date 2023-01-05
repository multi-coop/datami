<template>
  <div
    class="ViewModeBtns datami-component is-flex is-align-items-center"
    style="z-index: 2">
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
          aria-controls="dropdown-views">
          <span class="has-text-grey is-size-7 is-italic">
            {{ t(`views.${currentViewMode}`, locale) }}
          </span>
        </b-button>
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
      // console.log('\nC > ViewModeBtns > btnsEdit > this.buttonsView : ', this.buttonsView)
      if (this.fileOptions) {
        let views
        // console.log('C > ViewModeBtns > btnsEdit > this.fileOptions : ', this.fileOptions)
        switch (this.gitObj.filefamily) {
          case 'table':
            views = {
              table: true,
              cards: this.cardsViewIsActive,
              dataviz: this.datavizViewIsActive,
              map: this.mapViewIsActive
            }
            break
          case 'text':
            views = {
              text: this.hasTxtView,
              md: this.hasMdView
            }
            break
          case 'json':
            views = {
              json: true
            }
            break
        }
        // console.log('C > ViewModeBtns > btnsEdit > views : ', views)
        return this.buttonsView.filter(v => views[v.code])
      } else {
        return []
      }
    }
  },
  watch: {
    fileOptions (next) {
      // console.log('\nC > ViewModeBtns > watch > fileOptions > next : ', next)
      if (next) {
        let defaultViews
        switch (this.fileTypeFamily) {
          case 'table':
            defaultViews = [
              {
                view: 'cards',
                activate: this.cardsViewIsActive,
                isDefault: this.cardsViewIsActive && this.cardsViewIsDefault
              },
              {
                view: 'dataviz',
                activate: this.datavizViewIsActive,
                isDefault: this.datavizViewIsActive && this.datavizViewIsDefault
              },
              {
                view: 'map',
                activate: this.mapViewIsActive,
                isDefault: this.mapViewIsActive && this.mapViewIsDefault
              },
              {
                view: 'table',
                activate: true,
                isDefault: true
              }
            ]
            break
          case 'text':
            defaultViews = [
              {
                view: 'md',
                activate: this.hasMdView,
                isDefault: true
              },
              {
                view: 'text',
                activate: this.hasTxtView,
                isDefault: true
              }
            ]
            break
          case 'json':
            defaultViews = [
              {
                view: 'json',
                activate: this.hasJsonView,
                isDefault: true
              }
            ]
            break
        }
        const defaultView = defaultViews.find(v => v.isDefault)
        // console.log('C > ViewModeBtns > watch > fileOptions > defaultView : ', defaultView)
        this.changeView(defaultView.view)
      } else {
        this.changeView('loading')
      }
    }
  },
  beforeMount () {
    // console.log('\nC > ViewModeBtns > beforeMount > this.fileId : ', this.fileId)
    // console.log('C > ViewModeBtns > beforeMount > this.gitObj : ', this.gitObj)
    // console.log('C > ViewModeBtns > beforeMount > this.gitObj.filetype : ', this.gitObj.filetype)
    // console.log('C > ViewModeBtns > beforeMount > this.fileTypeFamily : ', this.fileTypeFamily)
    // console.log('C > ViewModeBtns > beforeMount > this.fileOptions : ', this.fileOptions)
    // this.changeView('table')
    this.changeView(this.fileTypeFamily || 'loading')
  },
  methods: {
    ...mapActions({
      changeViewMode: 'git-data/changeViewMode'
    }),
    changeView (code) {
      this.changeViewMode({ fileId: this.fileId, mode: code })
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
  /* .is-active {
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
  } */

</style>
