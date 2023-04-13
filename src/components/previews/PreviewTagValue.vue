<template>
  <b-tag
    :class="`PreviewTagValue mb-1 ${isFilterTag ? '' : 'mr-1'}`"
    :style="tagStyle">
    <!-- <code>{{ sharedDataIsLoaded }}</code> -->
    <!-- field: <pre><code>{{ field }}</code></pre> -->
    <!-- val: <code>{{ val }}</code><hr class="my-1"> -->
    <!-- field.foreignKey : <pre><code>{{ field.foreignKey }}</code></pre><br> -->
    <!-- item : <pre><code>{{ item }}</code></pre><hr> -->

    <!-- TOOLTIP CONTENT (TAGS) -->
    <span
      v-if="val === '...' || (field.foreignKey || field.definitions) || isMini"
      :class="`mr-2 mb-2 has-text-weight-bold tag-pointer`"
      @mouseover="showGlobalTooltip($event, tagTooltipData(val))"
      @mouseleave="hideGlobalTooltip"
      @click="$emit('expand')">
      <span v-if="!getValueDefinitionLabel(val)">
        {{ isMini ? trimText(val) : val }}
      </span>
      <span v-else>
        {{ trimText(getValueDefinitionLabel(val), isMini ? 10 : 25) }}
      </span>
      <b-icon
        v-if="val !== '...' && (field.foreignKey || field.definitions)"
        icon="information-outline"
        size="is-small"
        class="ml-1"/>
    </span>

    <span
      v-else-if="field.type === 'boolean'"
      :class="`mr-2 mb-2 has-text-weight-bold tag-pointer`"
      @click="$emit('expand')">
      {{ t(`global.${val ? 'yes' : 'no'}`, locale) }}
    </span>

    <!-- USUAL TAGS (NO TOOLTIP) -->
    <!-- @mouseover="showGlobalTooltip($event, tagTooltipData(val))"
    @mouseleave="hideGlobalTooltip" -->
    <span
      v-else
      :class="`mr-2 mb-2 has-text-weight-bold tag-pointer`"
      @click="$emit('expand')">
      {{ val }}
    </span>
  </b-tag>
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
  name: 'PreviewTagValue',
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
    val: {
      default: false,
      type: [String, Boolean, Number]
    },
    tagStyle: {
      default: '',
      type: String
    },
    field: {
      default: null,
      type: Object
    },
    isFilterTag: {
      default: false,
      type: Boolean
    },
    isMini: {
      default: false,
      type: Boolean
    },
    locale: {
      default: null,
      type: String
    }
  },
  // data () {
  //   return {
  //     showTag: false
  //   }
  // },
  computed: {
    itemDirect () {
      return this.getForeignItem(this.field, this.val)
    }
  },
  methods: {
    tagTooltipData (val) {
      const data = {
        position: 'top',
        type: 'tag',
        field: this.field,
        value: val,
        icon: this.getIconFieldType(this.field),
        valDefLabel: this.getValueDefinitionLabel(val),
        valDefDescription: this.getValueDefinitionDescription(val),
        ressourceInfos: this.ressourceInfos
      }
      return data
    }
  }
}
</script>
