<template>
  <b-navbar-dropdown
    hoverable
    arrowless
    right
    tag="div"
    class="CustomFilterDropdown">
    <!-- LABEL SLOT -->
    <template #label>
      <b-tooltip
        :label="`${ t('filters.filterByField', locale) } : ${filter.label}`"
        type="is-dark"
        position="is-left">
        <b-icon
          icon="filter"
          class="mr-2"
          :type="isActiveField ? 'is-dark' : 'is-grey'"
          size="is-small"/>
        <span
          :class="`${isActiveField ? 'has-text-weight-bold' : '' }`">
          {{ filter.label }}
        </span>
      </b-tooltip>
    </template>

    <!-- RESET FIELD FILTERS -->
    <b-navbar-item
      v-if="isActiveField"
      class="pr-2"
      @click.native="removeAllFilters">
      <b-icon
        icon="close-thick"
        class="mr-2"
        size="is-small"/>
      <span class="has-text-weight-bold">
        {{ t('filters.resetFilter', locale) }}
      </span>
    </b-navbar-item>
    <hr
      v-if="isActiveField"
      class="mx-0 mt-2 mb-3">

    <!-- TAG VALUES LOOP -->
    <b-navbar-item
      v-for="filterVal, idx in filter.enumArr"
      :key="`nav-filter-${fileId}-${filter.field}-${idx}-${filterVal}`"
      class="pr-2"
      @click.native="updateActiveTag(filterVal)">
      <b-icon
        v-if="isActive(filterVal)"
        class="mr-2"
        size="is-small"
        icon="close-thick"/>
      <!-- FILTER + FOREIGN KEY || DEFINITIONS -->
      <div v-if="filter.foreignKey || filter.definitions">
        <span>
          <span v-if="filter.foreignKey">
            {{ filter.label }} :
          </span>
          <span class="has-text-weight-bold">
            {{ trimText(filterVal, 50) }}
          </span>
          <b-icon
            icon="information-outline"
            size="is-small"
            class="mx-1"/>
        </span>
        <br>
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
            <br>
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

      <!-- SIMPLE FILTER -->
      <span
        v-else
        :class="`${isActive(filterVal) ? 'has-text-weight-bold' : '' }`">
        {{ trimText(filterVal, 50) }}
      </span>
    </b-navbar-item>
  </b-navbar-dropdown>
</template>

<script>

import {
  mixinGlobal,
  mixinValue,
  mixinForeignKeys
} from '@/utils/mixins.js'

export default {
  name: 'CustomFilterDropdown',
  mixins: [
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
    itemDirect (field, val) {
      return this.getForeignItem(field, val)
    },
    updateActiveTag (filterVal) {
      // console.log('\nC > CustomFilterDropdown > updateActiveTag > filterVal : ', filterVal)
      const remove = this.isActive(filterVal)
      this.SendActionToParent(filterVal, remove)
    },
    removeAllFilters () {
      this.SendActionToParent(null, false, true)
    },
    SendActionToParent (filterVal, remove = false, reset = false) {
      // console.log('\nC > CustomFilterDropdown > SendActionToParent > filterVal : ', filterVal)
      // console.log('C > CustomFilterDropdown > SendActionToParent > remove : ', remove)
      const filterPayload = {
        field: this.filter.field,
        bgColor: this.filter.bgColor,
        value: filterVal,
        reset: reset
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

<style>
.CustomFilterDropdown > .navbar-dropdown {
  max-height: 275px;
  overflow: auto;
  padding-bottom: 1.5em;

  /* shadow while scroll solution : https://stackoverflow.com/questions/44793453/how-do-i-add-a-top-and-bottom-shadow-while-scrolling-but-only-when-needed */
  background:
    /* Shadow covers */
    linear-gradient(white 30%, rgba(0, 0, 0, 0)),
    linear-gradient(rgba(0, 0, 0, 0), white 70%) 0 100%,
    /* Shadows */
    linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .2)),
    linear-gradient(rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;

  background:
    /* Shadow covers */
    linear-gradient(white 30%, rgba(0, 0, 0, 0)),
    linear-gradient(rgba(0, 0, 0, 0), white 70%) 0 100%,
    /* Shadows */
    linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .2)) 0 100%,
    linear-gradient(rgba(0, 0, 0, .2), rgba(0, 0, 0, 0));

  background-repeat: no-repeat;
  background-color: white;
  background-size: 100% 40px, 100% 40px, 100% 30px, 100% 30px;
  /* Opera doesn't support this in the shorthand */
  background-attachment: local, local, scroll, scroll;
}

</style>
