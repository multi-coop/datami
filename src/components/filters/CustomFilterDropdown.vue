<template>
  <div
    :class="`CustomFilterDropdown dropdown is-hoverable ${isDarkMode ? 'dark-background' : 'clear-background'}`"
    @mouseover="showGlobalTooltip($event, { position: 'top', type: 'info', label: `${ t('filters.filterByField', locale) } : ${filter.label}` })"
    @mouseleave="hideGlobalTooltip">
    <!-- @click="showFilterDropdown = !showFilterDropdown"> -->
    <!-- FILTER DROPDOWN TRIGGER -->
    <b-button
      class="dropdown-trigger"
      :type="isDarkMode ? 'is-white' : isActiveField ? 'is-dark' : 'is-grey'"
      icon-left="filter"
      size="is-small"
      aria-haspopup="true"
      expanded
      :aria-controls="`${fileId}-filter-dropdown-${filter.field}`">
      <!-- VISIBLE ABOVE TABLET -->
      <span class="is-hidden-touch">
        {{ trimText(filter.title || filter.label, 17) }}
      </span>
      <!-- VISIBLE ON TABLET ONLY -->
      <span class="is-hidden-desktop is-hidden-mobile">
        {{ trimText(filter.title || filter.label, 25) }}
      </span>
      <!-- VISIBLE ON MOBILE ONLY -->
      <span class="is-hidden-tablet">
        {{ trimText(filter.title || filter.label, 45) }}
      </span>
    </b-button>

    <!-- FILTER DROPDOWN CONTENT -->
    <div
      :id="`${fileId}-filter-dropdown-${filter.field}`"
      class="dropdown-menu"
      role="menu">
      <div
        class="dropdown-content">
        <!-- RESET FIELD FILTERS -->
        <b-button
          v-if="isActiveField"
          icon-left="close-thick"
          type="is-text"
          class="dropdown-item mr-2"
          style="text-decoration: none;"
          @click="removeAllFilters">
          <span class="has-text-weight-bold">
            {{ t('filters.resetFilter', locale) }}
          </span>
        </b-button>

        <hr
          v-if="isActiveField"
          class="mx-0 my-0">

        <!-- TAG VALUES LOOP -->
        <div
          v-for="filterVal, idx in filter.enumArr"
          :key="`nav-filter-${fileId}-${filter.field}-${idx}-${filterVal}`"
          type="is-text"
          class="dropdown-item has-text-left px-1"
          @click="updateActiveTag(filterVal)">
          <div class="columns is-flex mx-0 my-0">
            <div class="column is-1 is-1-mobile px-0 py-0 has-text-centered">
              <b-icon
                :icon="getFilterIcon(filterVal)"
                size="is-small"
                class=""/>
            </div>
            <div class="column is-11 is-11-mobile px-1 py-0">
              <!-- FILTER + FOREIGN KEY || DEFINITIONS -->
              <div v-if="filter.foreignKey || filter.definitions">
                <span v-show="currentEditViewMode !== 'preview'">
                  <span v-if="filter.foreignKey">
                    {{ filter.title || filter.label }} :
                  </span>
                  <span class="has-text-weight-bold">
                    {{ trimText(filterVal, 50) }}
                  </span>
                  <b-icon
                    icon="information-outline"
                    size="is-small"
                    class="mx-1"/>
                </span>
                <br v-show="currentEditViewMode !== 'preview'">
                <!-- HELPERS FOREIGN KEY -->
                <span v-if="filter.foreignKey">
                  <span
                    v-for="entry in Object.entries(itemDirect(filter, filterVal))"
                    :key="`${entry[0]}`">
                    <span>
                      {{ entry[0] }} :
                    </span>
                    <span class="has-text-weight-bold">
                      {{ entry[1] }}
                    </span>
                  </span>
                </span>
                <!-- HELPERS DEFINITION -->
                <span v-if="filter.definitions">
                  <span class="pt-1">
                    {{ trimText(getValueDefinitionLabel(filterVal, filter), 35) }}
                  </span>
                  <br>
                </span>
              </div>

              <!-- BOOLEAN FILTER -->
              <span
                v-else-if="filter.type === 'boolean'"
                :class="`${isActive(filterVal) ? 'has-text-weight-bold' : '' }`">
                {{ t(`global.${filterVal ? 'yes' : 'no'}`, locale) }}
              </span>

              <!-- SIMPLE FILTER -->
              <span
                v-else
                :class="`${isActive(filterVal) ? 'has-text-weight-bold' : '' }`">
                {{ trimText(filterVal, 50) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {
  mixinTooltip,
  mixinGlobal,
  mixinValue,
  mixinForeignKeys
} from '@/utils/mixins.js'

export default {
  name: 'CustomFilterDropdown',
  mixins: [
    mixinTooltip,
    mixinGlobal,
    mixinValue,
    mixinForeignKeys
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    filter: {
      default: null,
      type: Object
    },
    fieldActiveTags: {
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
  // data () {
  //   return {
  //     showFilterDropdown: false
  //   }
  // },
  computed: {
    isActiveField () {
      return this.fieldActiveTags.length
    }
  },
  methods: {
    isActive (filterVal) {
      const activeTags = this.fieldActiveTags.map(t => t.value)
      return activeTags.includes(filterVal)
    },
    getFilterIcon (filterVal) {
      let icon
      const isActive = this.isActive(filterVal)
      const isAnd = this.filter.filtering === 'AND'
      const isRadio = this.filter.filtering === 'RADIO'
      if (isActive && isAnd) {
        icon = 'close-thick'
      }
      if (!isAnd && !isRadio) {
        icon = isActive ? 'checkbox-marked' : 'checkbox-blank-outline'
      }
      if (isRadio) {
        icon = isActive ? 'radiobox-marked' : 'radiobox-blank'
      }
      return icon
    },
    itemDirect (field, val) {
      return this.getForeignItem(field, val)
    },
    updateActiveTag (filterVal) {
      // console.log('\nC > CustomFilterDropdown > updateActiveTag > filterVal : ', filterVal)
      this.showFilterDropdown = false
      const remove = this.isActive(filterVal)
      this.SendActionToParent(filterVal, remove)

      // track with matomo
      this.trackEvent(this.filter.label)
    },
    removeAllFilters () {
      this.SendActionToParent(null, false, true)
    },
    SendActionToParent (filterVal, remove = false, reset = false) {
      // console.log('\nC > CustomFilterDropdown > SendActionToParent > filterVal : ', filterVal)
      // console.log('C > CustomFilterDropdown > SendActionToParent > this.filter : ', this.filter)
      // console.log('C > CustomFilterDropdown > SendActionToParent > remove : ', remove)
      const filterPayload = {
        field: this.filter.field,
        type: this.filter.type,
        subtype: this.filter.subtype,
        bgColor: this.filter.bgColor,
        value: filterVal,
        reset: reset
      }
      if (filterPayload.subtype === 'tags') {
        filterPayload.tagSeparator = this.filter.tagSeparator
      }
      const payload = {
        action: remove ? 'removeTag' : 'filterBy',
        value: filterPayload
      }
      this.$emit('action', payload)
    }
  }
}
</script>
