<template>
  <div class="ButtonFilterBy px-2">
    <b-field>
      <b-tooltip
        :label="t(`editCsv.filterBy`, locale)"
        type="is-dark"
        position="is-top">
        <p class="control mb-0">
          <span class="button is-static is-small">
            <b-icon
              icon="filter"
              size="is-small"/>
          </span>
        </p>
      </b-tooltip>
      <b-select
        size="is-small"
        :placeholder="getActiveHeader"
        @input="updateActiveHeader">
        <option
          v-for="h in headers"
          :key="h.field"
          :value="h">
          {{ h.label }}
        </option>
        <option
          :value="undefined">
          {{ t('editCsv.noSelect', locale) }}
        </option>
      </b-select>
      <b-input
        v-model="searchValue"
        size="is-small"
        icon="magnify"
        type="search"
        :placeholder="`${t('actions.search', locale)}...`"
        @input="updateSearch"/>
    </b-field>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ButtonFilterBy',
  mixins: [],
  props: {
    headers: {
      default: null,
      type: Array
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {
      activeHeader: undefined,
      searchValue: undefined
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation'
    }),
    getActiveHeader () {
      const activeHeaderLabel = this.activeHeader && this.activeHeader.label
      return activeHeaderLabel || this.t('editCsv.noSelect', this.locale)
    }
  },
  methods: {
    updateActiveHeader (event) {
      // console.log('\nC > ButtonFilterBy > updateActiveHeader > event : ', event)
      this.activeHeader = event
      this.SendActionToParent()
    },
    updateSearch () {
      // console.log('\nC > ButtonFilterBy > updateSearch > event : ', event)
      this.SendActionToParent()
    },
    SendActionToParent () {
      // console.log('\nC > ButtonFilterBy > SendActions > event : ', event)
      const filterPayload = {
        header: this.activeHeader,
        searchValue: this.searchValue
      }
      const payload = {
        action: 'filterBy',
        value: filterPayload
      }
      this.$emit('action', payload)
    }
  }
}
</script>
