<template>
  <div
    class="PreviewField">
    <!-- FIELD LABEL + INFOS -->
    <!-- :auto-close="isForeignKey ? ['outside', 'escape'] : true" -->
    <!-- :auto-close="isForeignKey ? ['inside', 'outside', 'escape'] : true" -->
    <!-- :triggers="isForeignKey ? ['contextmenu', 'hover'] : ['hover']" -->
    <!-- :triggers="isForeignKey ? ['click', 'hover'] : ['hover']" -->
    <!-- :auto-close="isForeignKey ? ['inside', 'outside', 'escape'] : true" -->
    <span style="cursor: pointer;">

      <!-- FIELD TYPE ICON -->
      <b-icon
        :icon="getIconFieldType(field)"
        :class="`${isDatamiField ? '' : 'ml-2 mr-2'}`"
        :type="`is-${ isPrimaryKey || isForeignKey ? 'dark' : 'grey-light'}`"
        size="is-small"
        @mouseover.native="showGlobalTooltip($event, { position: 'top', type: 'fieldtype', field: field, icon: getIconFieldType(field) })"
        @mouseleave.native="hideGlobalTooltip"/>

      <!-- FIELD LABEL FOR isDatamiField -->
      <span
        @mouseover="showGlobalTooltip($event, { position: 'top', type: 'field', field: field, icon: getIconFieldType(field) })"
        @mouseleave="hideGlobalTooltip">
        <span
          v-if="isDatamiField"
          class="mr-2">
        <!-- {{ t(field.label, locale) }} -->
        </span>

        <!-- FIELD LABEL -->
        <span
          v-else
          :class="`mr-2`">
          {{ field.label }}
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
    <!-- <b-tooltip
      v-if="lockHeaders && currentEditViewMode !== 'preview' && !isDatamiField"
      :label="t('edit.headerLocked', locale)"
      position="is-top"
      multilined
      append-to-body
      type="is-dark">
      <b-icon
        class="mr-3"
        size="is-small"
        type="is-grey-light"
        icon="lock"
        @mouseover.native="showGlobalTooltip($event, { position: 'top', type: 'info', label: t('edit.headerLocked', locale) })"
        @mouseleave.native="hideGlobalTooltip"/>
    </b-tooltip> -->
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
  }
}
</script>
