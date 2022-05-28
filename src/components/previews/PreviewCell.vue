<template>
  <div class="PreviewCell">
    <!-- {{ value }} <br> {{ col }} -->

    <!-- STRING -->
    <div
      v-if="col.type === 'string' && !col.subtype"
      :class="`${col.isCategory ? 'has-text-centered' : ''}`">
      {{ value }}
    </div>

    <!-- BOOLEAN -->
    <div
      v-if="col.type === 'boolean'"
      :class="`has-text-centered`">
      <b-icon
        :icon="`checkbox-${booleanFromValue(value) ? 'marked' : 'blank'}-circle-outline`"
        size="is-small"/>
    </div>

    <!-- TAG / TAGS -->
    <div
      v-if="col.type === 'string' && col.subtype === 'tag'"
      :class="`${col.isCategory ? 'has-text-centered' : ''}`">
      <b-tag
        v-for="(val, tagIdx) in value.split(col.tagSeparator)"
        :key="`tags-${col.field}-${tagIdx}`"
        :class="`mr-2 mb-1 has-text-weight-bold`">
        {{ val }}
      </b-tag>
    </div>

    <!-- LINK -->
    <div
      v-if="col.type === 'string' && col.subtype === 'link'"
      :class="``">
      <b-button
        tag="a"
        size="is-small"
        icon-left="open-in-new"
        :href="value"
        expanded
        target="_blank">
        {{ t('global.link', locale) }}
      </b-button>
    </div>

    <!-- NUMBER -->
    <div
      v-if="col.type === 'number' || col.type == 'integer'"
      :class="`has-text-right`">
      {{ value }}
    </div>
  </div>
</template>

<script>

import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'PreviewCell',
  mixins: [mixinGlobal],
  props: {
    value: {
      default: null,
      type: [String, Boolean, Number]
    },
    col: {
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
