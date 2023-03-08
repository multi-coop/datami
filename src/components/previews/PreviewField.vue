<template>
  <div
    class="PreviewField"
    style="line-height: .9em;">
    <!-- FIELD LABEL + INFOS -->
    <!-- :auto-close="isForeignKey ? ['outside', 'escape'] : true" -->
    <!-- :auto-close="isForeignKey ? ['inside', 'outside', 'escape'] : true" -->
    <!-- :triggers="isForeignKey ? ['contextmenu', 'hover'] : ['hover']" -->
    <!-- :triggers="isForeignKey ? ['click', 'hover'] : ['hover']" -->
    <!-- :auto-close="isForeignKey ? ['inside', 'outside', 'escape'] : true" -->
    <span style="cursor: pointer;">
      <!-- FIELD LABEL FOR isDatamiField -->
      <span
        :class="`is-size-7 ${isDarkMode ? 'has-text-white' : ''}`"
        @mouseover="showGlobalTooltip($event, { position: 'top', type: 'field', field: field, icon: getIconFieldType(field) })"
        @mouseleave="hideGlobalTooltip">
        <!-- <span
          v-if="isDatamiField"
          class="mr-2"> -->
        <!-- {{ t(field.label, locale) }} -->
        <!-- </span> -->

        <!-- FIELD LABEL -->
        <span
          :class="`mr-2`">
          {{ trimText(field.title || field.label, textLength) }}
          <!-- {{ field.label }} -->
        </span>
      </span>

      <!-- PRIMARY KEY -->
      <b-icon
        v-if="isPrimaryKey"
        icon="key"
        :class="`ml-0 mr-3`"
        type="is-dark"
        size="is-small"/>

      <!-- FOREIGN KEY -->
      <b-icon
        v-if="isForeignKey"
        icon="link"
        :class="`ml-0 mr-3`"
        type="is-dark"
        size="is-small"/>
    </span>

    <!-- LOCKED OR NOT -->
    <b-icon
      v-if="lockHeaders && currentEditViewMode !== 'preview' && !isDatamiField"
      class="mr-3"
      size="is-small"
      type="is-grey-light"
      icon="lock"
      @mouseover.native="showGlobalTooltip($event, { position: 'top', type: 'info', label: t('edit.headerLocked', locale) })"
      @mouseleave.native="hideGlobalTooltip"/>
  </div>
</template>

<script>
import {
  trimText
} from '@/utils/globalUtils.js'

import {
  mixinTooltip,
  mixinGlobal,
  mixinIcons,
  mixinValue,
  mixinForeignKeys
} from '@/utils/mixins.js'

export default {
  name: 'PreviewField',
  mixins: [
    mixinTooltip,
    mixinGlobal,
    mixinIcons,
    mixinValue,
    mixinForeignKeys
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    field: {
      default: null,
      type: Object
    },
    lockHeaders: {
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
  computed: {
    textLength () {
      let length
      const fieldType = this.field.type
      const fieldSubtype = this.field.subtype
      const textLengths = {
        longtext: 50,
        tag: 30,
        tags: 40,
        timelinetext: 40,
        image: 10,
        link: 25,
        email: 25
      }
      switch (fieldType) {
        case 'string':
          length = fieldSubtype ? (textLengths[fieldSubtype] || 50) : 35
          break
        case 'number':
          length = 30
          break
        case 'integer':
          length = 30
          break
        case 'boolean':
          length = 25
          break
        default:
          length = 20
      }
      return length
    }
  },
  methods: {
    trimText
  }
}
</script>
