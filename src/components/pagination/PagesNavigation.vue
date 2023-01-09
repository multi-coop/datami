<template>
  <div :class="`PagesNavigation datami-component ${isDarkMode ? 'datami-darkmode' : ''}`">
    <div>
      <b-pagination
        v-model="currentPage"
        :total="totalItems"
        :per-page="itemsPerPageSelected"
        :size="size"
        :order="order"
        :simple="isSimple"
        :rounded="isRounded"
        :aria-page-label="t('pagination.page', locale)"
        :aria-current-label="t('pagination.currentPage', locale)"
        :range-before="rangeBefore"
        :range-after="rangeAfter"
        :page-input="hasInput"
        :page-input-position="position"
        :debounce-page-input="inputDebounce">
        <!-- PREVIOUS PAGE BUTTON -->
        <template #previous="props">
          <b-pagination-button
            :page="props.page"
            :class="`${isDarkMode ? 'datami-darkmode-white-text-dark-bg' : ''}`">
            <b-icon
              :size="size"
              :icon="prevIcon"/>
            {{ t('pagination.prevPage', locale) }}
          </b-pagination-button>
        </template>

        <!-- NEXT PAGE BUTTON -->
        <template #next="props">
          <b-pagination-button
            :page="props.page"
            :class="`${isDarkMode ? 'datami-darkmode-white-text-dark-bg' : ''}`">
            {{ t('pagination.nextPage', locale) }}
            <b-icon
              :size="size"
              :icon="nextIcon"/>
          </b-pagination-button>
        </template>
      </b-pagination>
    </div>

    <!-- HELPERS PAGINATION -->
    <div class="mt-4 mx-5 columns is-multiline">
      <div class="column is-12 has-text-centered py-0">
        <p class="is-size-7 is-italic mb-0">
          <span :class="`${isDarkMode ? 'has-text-white' : ''}`">
            {{ t('pagination.pageN', locale) }}
            {{ currentPage }}
            {{ t('pagination.pageToPages', locale) }}
            {{ totalPages }}
            {{ t('pagination.pages', locale) }}
          </span>
        </p>
      </div>
      <div class="column is-12 has-text-centered py-0">
        <p class="is-size-7 is-italic mb-0">
          <span :class="`${isDarkMode ? 'has-text-white' : ''}`">
            {{ countElements }}
            {{ t('pagination.items', locale) }}
            {{ t('pagination.itemsTotal', locale) }}
            {{ totalItems }}
            {{ t('pagination.items', locale) }}
          </span>
        </p>
      </div>
      <div class="column is-12 has-text-centered">
        <!-- itemsPerPageSelected : <code>{{ itemsPerPageSelected }}</code><br> -->
        <b-field class="mb-0 mx-2">
          <b-select
            v-model="itemsPerPageSelected"
            rounded
            :class="`${isDarkMode ? 'select-datami-darkmode has-text-white' : ''}`"
            placeholder="---"
            size="is-small">
            <option
              v-for="num in itemsPerPageChoices"
              :key="`select-${num}`"
              :value="num">
              {{ num }} {{ t('pagination.itemsPerPage', locale) }}
            </option>
          </b-select>
        </b-field>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'PagesNavigation',
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: null,
      type: String
    },
    totalItems: {
      default: 0,
      type: Number
    },
    // itemsPerPage: {
    //   default: 10,
    //   type: Number
    // },
    itemsPerPageTable: {
      default: 10,
      type: Number
    },
    itemsPerPageCards: {
      default: 9,
      type: Number
    },
    itemsPerPageChoices: {
      default: null,
      type: Array
    },
    locale: {
      default: '',
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      // cssFiles: [
      //   'styles/components/pagination/datami-pages-navigation.css'
      // ],
      // default settings
      currentPage: 1,
      currentPageTable: 1,
      currentPageCards: 1,
      size: 'is-small',
      prevIcon: 'arrow-left',
      nextIcon: 'arrow-right',
      order: 'is-centered',
      isSimple: false,
      isRounded: true,
      rangeBefore: 1,
      rangeAfter: 1,
      hasInput: false,
      position: '',
      inputDebounce: 100,
      itemsPerPageSelected: undefined,
      itemsPerPageForTable: undefined,
      itemsPerPageForCards: undefined,
      holdOn: false
      // itemsPerPageChoices: [3, 5, 10, 15, 20, 25, 50, 100]
    }
  },
  computed: {
    countElements () {
      const result = this.totalItems > this.itemsPerPageSelected ? this.itemsPerPageSelected : this.totalItems
      return result
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.itemsPerPageSelected)
    }
  },
  watch: {
    currentViewMode (next) {
      // console.log('\nC > PagesNavigation > watch > currentViewMode > next :', next)
      this.holdOn = true
      switch (next) {
        case 'table':
          this.currentPage = this.currentPageTable
          this.itemsPerPageSelected = this.itemsPerPageForTable
          break
        case 'cards':
          this.currentPage = this.currentPageCards
          this.itemsPerPageSelected = this.itemsPerPageForCards
      }
      this.ChangePage()
      this.holdOn = false
    },
    currentPage (next, prev) {
      // console.log('\nC > PagesNavigation > watch > currentPage > next :', next)
      if (!this.holdOn && next !== prev) this.ChangePage()
    },
    itemsPerPageSelected (next, prev) {
      // console.log('\nC > PagesNavigation > watch > itemsPerPageSelected > next :', next)
      if (!this.holdOn && next !== prev) {
        switch (this.currentViewMode) {
          case 'table':
            this.itemsPerPageForTable = next
            break
          case 'cards':
            this.itemsPerPageForCards = next
            break
        }
        this.ChangePage()
      }
    },
    fileSignals (next) {
      // console.log('\nC > PagesNavigation > watch > fileSignals > next : ', next)
      // console.log('C > PagesNavigation > watch > fileSignals > this.totalPages : ', this.totalPages)
      if (next && next.length) {
        next.forEach(signal => {
          switch (signal.action) {
            case 'goToLastPage':
              // console.log('\nC > PagesNavigation > watch > fileSignals > goToLastPage > signal : ', signal)
              this.currentPage = this.totalPages
              this.removeFileSignal(signal.signalId)
              break
          }
        })
      }
    }
  },
  beforeMount () {
    this.itemsPerPageForTable = this.itemsPerPageTable
    this.itemsPerPageForCards = this.itemsPerPageCards
    switch (this.currentViewMode) {
      case 'table':
        this.itemsPerPageSelected = this.itemsPerPageTable
        break
      case 'cards':
        this.itemsPerPageSelected = this.itemsPerPageCards
    }
  },
  methods: {
    ChangePage () {
      // console.log('\nC > PagesNavigation > ChangePage ... ')
      // console.log('C > PagesNavigation > ChangePage > this.currentPage : ', this.currentPage)
      switch (this.currentViewMode) {
        case 'table':
          this.currentPageTable = this.currentPage
          break
        case 'cards':
          this.currentPageCards = this.currentPage
          break
      }
      // console.log('C > PagesNavigation > ChangePage > this.currentPageTable : ', this.currentPageTable)
      // console.log('C > PagesNavigation > ChangePage > this.currentPageCards : ', this.currentPageCards)

      // console.log('C > PagesNavigation > ChangePage > this.itemsPerPage : ', this.itemsPerPage)
      // console.log('C > PagesNavigation > ChangePage > this.itemsPerPageSelected : ', this.itemsPerPageSelected)
      // console.log('C > PagesNavigation > ChangePage > this.itemsPerPageForTable : ', this.itemsPerPageForTable)
      // console.log('C > PagesNavigation > ChangePage > this.itemsPerPageForCards : ', this.itemsPerPageForCards)
      const pagination = {
        currentPage: this.currentPage,
        itemsPerPage: this.itemsPerPageSelected,
        itemsPerPageTable: this.itemsPerPageForTable,
        itemsPerPageCards: this.itemsPerPageForCards
      }
      const payload = {
        action: 'changePage',
        value: pagination
      }
      // this.$emit('action', payload)
      this.addFileSignal('changePage', payload)

      // track with matomo
      this.trackEvent('click')
    }
  }
}
</script>
