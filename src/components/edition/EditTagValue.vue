<template>
  <div
    class="EditTagValue g-cell py-0">
    <!-- TAGS SELECTION DROPDOWN -->
    <!-- BUTTON + TAG VALUE -->
    <!-- ADD INPUT -->
    <!-- TAGS ENUM -->
    <!-- CLEAR SELECTION -->

    <!--
      append-to-body
      :triggers="['click']"
    -->
    <!-- <b-dropdown
      :disabled="disabled"
      :scrollable="true"
      :max-height="dropdwonHeight"
      :class="`dropdown-tags ${ showMenu ? 'is-active mb-3' : ''}`"
      aria-role="list"
      @mouseover="showMenu = true"
      @mouseleave="showMenu = false">
      <template #trigger>
        <b-button
          type="is-dark"
          outlined
          expanded
          size="is-small"
          :icon-right="showMenu ? 'menu-up' : 'menu-down'"
          @click="showMenu = !showMenu">
          <span :class="`${input ? 'has-text-weight-bold' : ''}`">
            {{ input || t('global.noValue', locale) }}
          </span>
        </b-button>
      </template>

      <b-dropdown-item
        aria-role="listitem"
        class="py-0"
        custom>
        <b-field
          :message="addedInput ? t('actions.addTagHelp', locale) : undefined"
          class="mb-4 mt-3 mx-2">
          <b-input
            v-model="addedInput"
            :placeholder="t('actions.addTag', locale)"
            expanded
            :icon-right="addedInput ? 'close' : ''"
            icon-right-clickable
            size="is-small"
            @icon-right-click="clearAddedInput"/>
          <p class="control">
            <b-button
              :disabled="!addedInput"
              type="is-dark"
              size="is-small"
              icon-left="plus-thick"
              @click="addInputTag"/>
          </p>
        </b-field>
      </b-dropdown-item>

      <b-dropdown-item
        v-for="(val, i) in tagsEnum"
        :key="`${field.field}-${i}-${val}`"
        :class="`is-size-7 ${val === input ? 'is-tag-active has-text-weight-bold' : ''}`"
        aria-role="listitem"
        focusable
        @click="changeValue(val)">
        {{ val }}
      </b-dropdown-item>

      <b-dropdown-item
        aria-role="listitem"
        custom>
        <b-button
          class="mt-3 has-text-weight-bold"
          icon-left="close-thick"
          size="is-small"
          expanded
          type="is-light"
          @click="removeInput">
          {{ t('actions.clearTag', locale) }}
        </b-button>
      </b-dropdown-item>
    </b-dropdown> -->

    <div
      :class="`dropdown dropdown-tag-wrapper ${ showMenu ? 'is-active' : '' }`">
      <div class="dropdown-trigger">
        <b-button
          size="is-small"
          expanded
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          :type="`${isDarkMode ? 'is-white' : 'is-dark'}`"
          :outlined="!showMenu"
          @click="showMenu = !showMenu">
          <span class="has-text-weight-bold">
            {{ input || t('global.noValue', locale) }}
            <span v-if="defLabel">
              : {{ defLabel }}
            </span>
          </span>
          <b-icon
            size="is-small"
            :icon="`chevron-${ showMenu ? 'up' : 'down'}`"
            type="is-dark"/>
        </b-button>
      </div>
      <div
        id="dropdown-menu"
        :class="`dropdown-menu dropdown-tags-menu mb-3`"
        role="menu">
        <div class="dropdown-content">
          <b-field
            :message="addedInput ? t('actions.addTagHelp', locale) : undefined"
            class="mb-4 mt-1 mx-2 px-2">
            <b-input
              v-model="addedInput"
              :placeholder="t('actions.addTag', locale)"
              expanded
              :icon-right="addedInput ? 'close' : ''"
              icon-right-clickable
              size="is-small"
              @icon-right-click="clearAddedInput"/>
            <p class="control">
              <b-button
                :disabled="!addedInput"
                :class="`add-input-btn${!addedInput ? '-disabled' : '' }`"
                type="is-dark"
                size="is-small"
                icon-left="plus-thick"
                @click="addInputTag"/>
            </p>
          </b-field>
          <a
            v-for="(val, i) in tagsEnumEnriched"
            :key="`${field.field}-${i}-${val.value}`"
            :class="`dropdown-item py-1 is-size-7 ${val.value === input ? 'is-active is-tag-active' : ''}`"
            @click="changeValue(val.value)">
            <div
              v-if="field.foreignKey"
              class="has-text-left mb-2">
              <p class="mb-0 has-text-weight-bold">
                {{ t('global.value', locale) }} :
                {{ val.value }}
                <b-icon
                  icon="information-outline"
                  size="is-small"
                  class="mx-1"/>
              </p>
              <span
                v-for="entry in Object.entries(itemDirect(field, val.value))"
                :key="`${entry[0]}`"
                class="pl-2">
                <span>
                  {{ entry[0] }} :
                </span>
                <span class="has-text-weight-bold">
                  {{ entry[1] }}
                </span>
                <br>
              </span>
            </div>
            <span v-else>
              {{ val.value }}
              <span v-if="val.definition">
                : {{ val.definition.label }}
              </span>
            </span>
          </a>
          <div class="mt-3 px-4 pb-3">
            <b-button
              class="has-text-weight-bold"
              icon-left="close-thick"
              size="is-small"
              expanded
              type="is-dark"
              outlined
              @click="removeInput">
              {{ t('actions.clearTag', locale) }}
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinGlobal, mixinForeignKeys } from '@/utils/mixins.js'

export default {
  name: 'EditTagValue',
  mixins: [
    mixinGlobal,
    mixinForeignKeys
  ],
  props: {
    fileId: {
      default: undefined,
      type: String
    },
    input: {
      default: undefined,
      type: [String, Number]
    },
    defLabel: {
      default: undefined,
      type: String
    },
    field: {
      default: undefined,
      type: Object
    },
    tagsEnum: {
      default: null,
      type: Array
    },
    tagsEnumEnriched: {
      default: null,
      type: Array
    },
    disabled: {
      default: false,
      type: Boolean
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
      //   'styles/components/edition/datami-edit-tag-value.css'
      // ],
      showMenu: false,
      addedInput: undefined,
      dropdwonHeight: 225
    }
  },
  methods: {
    addInputTag () {
      this.changeValue(this.addedInput)
      if (!this.tagsEnum.includes(this.addedInput)) {
        this.$emit('addTagToEnum', this.addedInput)
      }
      this.clearAddedInput()
    },
    removeInput () {
      this.changeValue(undefined)
    },
    clearAddedInput () {
      this.addedInput = undefined
    },
    changeValue (value) {
      this.showMenu = false
      this.$emit('updateInput', value)
    },
    itemDirect (field, val) {
      return this.getForeignItem(field, val)
    }
  }
}
</script>

<style>
/* .dropdown-tag-wrapper {
  display: block;
  flex-direction: column;
}
.dropdown-tag-menu, .dropdown-tags-menu {
  position: relative;
  z-index: 1;
}
.dropdown-tags {
  display: block;
}
.dropdown-tags > .dropdown-menu {
  z-index: 1 !important;
  position: relative;
}
.dropdown-item > .field > .help, .dropdown-content > .field > .help  {
  text-align: left;
  font-size: .6em;
  font-style: italic;
  color: #b5b5b5;
  margin-bottom: .3em;
}
.is-tag-active {
  background-color: #2f2f2f !important;
  color: white !important;
}

.dropdown-tags-menu > .dropdown-content {
  max-height: 275px;
  overflow: auto;

  background:
    linear-gradient(white 30%, rgba(0, 0, 0, 0)),
    linear-gradient(rgba(0, 0, 0, 0), white 70%) 0 100%,
    linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .2)),
    linear-gradient(rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;

  background:
    linear-gradient(white 30%, rgba(0, 0, 0, 0)),
    linear-gradient(rgba(0, 0, 0, 0), white 70%) 0 100%,
    linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .2)) 0 100%,
    linear-gradient(rgba(0, 0, 0, .2), rgba(0, 0, 0, 0));

  background-repeat: no-repeat;
  background-color: white;
  background-size: 100% 40px, 100% 40px, 100% 30px, 100% 30px;
  background-attachment: local, local, scroll, scroll;
}

.add-input-btn-disabled {
  border-color: #dbdbdb !important;
} */

</style>
