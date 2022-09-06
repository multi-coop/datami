<template>
  <div class="ViewModeBtns gitribute-component is-flex is-align-items-center">
    <!-- BUTTONS -->
    <!-- <b-field
      v-if="fileTypeFamily === 'table' && hasCardsView"
      class="mr-4"
      custom-class="is-small edit-mode-btns">
      <b-tooltip
        v-for="btn in buttonsView"
        :key="btn.code"
        :label="`${t(btn.textCode, locale)}`"
        type="is-dark"
        position="is-top">
        <b-button
          :icon-left="btn.icon"
          :type="currentViewMode === btn.code ? 'is-dark' : ''"
          :active="currentViewMode === btn.code"
          size="is-small"
          @click="changeView(btn.code)"/>
      </b-tooltip>
    </b-field> -->

    <!-- <b-dropdown
      v-model="viewMode"
      class="g-view-mode-dropdown"
      :triggers="['hover']"
      aria-role="list">
      <template #trigger>
        <b-tooltip
          :label="t('preview.changeViewMode', locale)"
          type="is-dark"
          position="is-top">
          <b-button
            :icon-left="getIcon(viewMode)"/>
        </b-tooltip>
      </template>

      <b-dropdown-item
        v-for="btn in buttonsView"
        :key="btn.code"
        :value="btn.code"
        aria-role="listitem"
        @click="changeView(btn.code)">
        <div class="media">
          <b-icon
            class="media-left"
            :icon="btn.icon"/>
          <div class="media-content">
            <h3>{{ t(btn.textCode, locale) }}</h3>
          </div>
        </div>
      </b-dropdown-item>
    </b-dropdown> -->

    <div class="dropdown is-hoverable is-left">
      <div class="dropdown-trigger">
        <b-button
          size="is-small"
          class="ml-1 mr-2"
          :icon-left="getIcon(currentViewMode)"
          aria-haspopup="true"
          aria-controls="dropdown-views"/>
        <div
          id="dropdown-views"
          class="dropdown-menu"
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
              :class="`dropdown-item ${ btn.code === currentViewMode ? 'is-active is-dark' : ''}`"
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
      if (next) {
        const defaultViews = [
          {
            view: 'cards',
            isDefault: this.cardsViewIsActive && this.cardsViewIsDefault
          },
          {
            view: 'dataviz',
            isDefault: this.datavizViewIsActive && this.datavizViewIsDefault
          },
          {
            view: 'map',
            isDefault: this.mapViewIsActive && this.mapViewIsDefault
          },
          {
            view: 'table',
            isDefault: true
          }
        ]
        // console.log('C > ViewModeBtns > mounted > defaultViews : ', defaultViews)
        const defaultView = defaultViews.find(v => v.isDefault)
        // console.log('C > ViewModeBtns > mounted > defaultView : ', defaultView)
        this.changeView(defaultView.view)
      }
    }
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
  .is-active {
    background-color: #000000 !important;
  }
  /* .EditModeBtns > .field > .field-body > .field.has-addons {
    justify-content: center !important;
  } */
</style>
