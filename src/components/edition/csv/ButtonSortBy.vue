<template>
  <div class="ButtonSortBy px-2">
    <b-field>
      <b-tooltip
        :label="t(`editCsv.sortBy`, locale)"
        type="is-dark"
        position="is-top">
        <p class="control mb-0">
          <span class="button is-static is-small">
            <b-icon
              icon="sort"
              size="is-small"/>
          </span>
        </p>
      </b-tooltip>
      <!-- icon="sort" -->
      <!-- SORT SELECTION BY FIELD -->
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
      <!-- ASCENDING / DESCENDING -->
      <b-tooltip
        :label="t(`editCsv.sortAscending`, locale)"
        type="is-dark"
        position="is-top">
        <p class="control mb-0">
          <b-button
            icon-left="arrow-down"
            size="is-small"
            :type="activeHeader && isAscending ? 'is-dark' : ''"
            @click="updateAscending(true)"/>
        </p>
      </b-tooltip>
      <b-tooltip
        :label="t(`editCsv.sortDescending`, locale)"
        type="is-dark"
        position="is-top">
        <p class="control mb-0">
          <b-button
            icon-left="arrow-up"
            size="is-small"
            :type="activeHeader && !isAscending ? 'is-dark' : ''"
            @click="updateAscending(false)"/>
        </p>
      </b-tooltip>
    </b-field>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ButtonSortBy',
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
      isAscending: true
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
    updateAscending (bool) {
      // console.log('\nC > ButtonSortBy > SendActions > event : ', event)
      this.isAscending = bool
      this.SendActionToParent()
    },
    updateActiveHeader (event) {
      // console.log('\nC > ButtonSortBy > SendActions > event : ', event)
      this.activeHeader = event
      this.SendActionToParent()
    },
    SendActionToParent (event) {
      // console.log('\nC > ButtonSortBy > SendActions > event : ', event)
      const sortPayload = {
        header: this.activeHeader,
        ascending: this.isAscending
      }
      const payload = {
        action: 'sortBy',
        value: sortPayload
      }
      this.$emit('action', payload)
    }
  }
}
</script>
