<template>
  <div class="PagesNavigation">
    <div>
      <b-pagination
        v-model="currentPage"
        :total="totalItems"
        :per-page="itemsPerPage"
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
            :page="props.page">
            <b-icon
              :size="size"
              :icon="prevIcon"/>
            {{ t('pagination.prevPage', locale) }}
          </b-pagination-button>
        </template>

        <!-- NEXT PAGE BUTTON -->
        <template #next="props">
          <b-pagination-button
            :page="props.page">
            {{ t('pagination.nextPage', locale) }}
            <b-icon
              :size="size"
              :icon="nextIcon"/>
          </b-pagination-button>
        </template>
      </b-pagination>
    </div>
    <!-- HELPERS PAGINATION -->
    <div class="mt-4 ml-5 columns is-multiline">
      <div class="column is-12 has-text-centered py-0">
        <p class="is-size-7 is-italic mb-0">
          <span class="">
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
          <span class="">
            {{ countElements }}
            {{ t('pagination.items', locale) }}
            {{ t('pagination.itemsTotal', locale) }}
            {{ totalItems }}
            {{ t('pagination.items', locale) }}
          </span>
        </p>
      </div>
      <div class="column is-12 has-text-centered">
        <!-- {{ perPageSelection }} -->
        <b-field class="mb-0 mx-2">
          <b-select
            v-model="itemsPerPageSelected"
            rounded
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
import { mapGetters } from 'vuex'

export default {
  name: 'PagesNavigation',
  props: {
    totalItems: {
      default: 0,
      type: Number
    },
    itemsPerPage: {
      default: 10,
      type: Number
    },
    itemsPerPageChoices: {
      default: null,
      type: Array
    },
    currentPageFromParent: {
      default: 1,
      type: Number
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
      // default settings
      currentPage: 1,
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
      itemsPerPageSelected: undefined
      // itemsPerPageChoices: [3, 5, 10, 15, 20, 25, 50, 100]
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation'
    }),
    countElements () {
      const result = this.totalItems > this.itemsPerPage ? this.itemsPerPage : this.totalItems
      return result
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.itemsPerPage)
    }
  },
  watch: {
    currentPage (next, prev) {
      // console.log('\nC > PagesNavigation > watch > currentPageFromParent > next :', next)
      if (next !== prev) this.SendActionToParent()
    },
    itemsPerPageSelected (next, prev) {
      // console.log('\nC > PagesNavigation > watch > itemsPerPageSelected > next :', next)
      if (next !== prev) {
        this.SendActionToParent()
      }
    },
    currentPageFromParent (next) {
      // console.log('\nC > PagesNavigation > watch > currentPageFromParent > next :', next)
      this.currentPage = next
    }
  },
  beforeMount () {
    this.itemsPerPageSelected = this.itemsPerPage
  },
  methods: {
    SendActionToParent () {
      // console.log('\nC > PagesNavigation > SendActionToParent ... ')
      const pagination = {
        currentPage: this.currentPage,
        itemsPerPage: this.itemsPerPageSelected
      }
      const payload = {
        action: 'changePage',
        value: pagination
      }
      this.$emit('action', payload)
    }
  }
}
</script>

<style>
.pagination-link.is-current {
  background-color: #363636!important;
  border-color: #363636!important;
}
</style>
