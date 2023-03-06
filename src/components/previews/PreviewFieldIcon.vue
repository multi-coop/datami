<template>
  <!-- FIELD TYPE ICON -->
  <b-icon
    :icon="getIconFieldType(field)"
    :class="`${field.type === 'datami' ? 'ml-0' : 'ml-2 mr-2'}`"
    :type="`is-${ field.primaryKey || field.foreignKey ? 'dark' : 'grey-light'}`"
    size="is-small"
    @mouseover.native="field.type === 'datami' && showGlobalTooltip($event, { position: 'top', type: 'fieldtype', field: field, icon: getIconFieldType(field) })"
    @mouseleave.native="field.type === 'datami' && hideGlobalTooltip"/>
</template>

<script>
import {
  mixinTooltip,
  mixinGlobal,
  mixinIcons
} from '@/utils/mixins.js'

export default {
  name: 'PreviewFieldIcon',
  mixins: [
    mixinTooltip,
    mixinGlobal,
    mixinIcons
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
    locale: {
      default: null,
      type: String
    }
  }
}
</script>
