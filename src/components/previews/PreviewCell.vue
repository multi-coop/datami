<template>
  <div
    :class="`PreviewCell gitribute-${nowrap ? 'nowrap' : 'wrap'}`"
    @mouseover="showExpand = true"
    @mouseleave="showExpand = false">
    <!-- {{ value }} <br> {{ field }} -->

    <!-- STRING -->
    <div
      v-if="isString && !field.subtype"
      :class="`${isCategory ? 'has-text-centered' : ''} ${ isEditView ? 'has-text-grey-light is-size-7 pt-1' : ''}`">
      <b-tooltip
        v-if="showExpand"
        :label="t(`actions.${ nowrap ? 'expandCell' : 'reduceCell'}`, locale)"
        append-to-body
        type="is-dark">
        <b-icon
          :icon="`arrow-${nowrap ? 'expand' : 'collapse'}`"
          class="mr-1"
          :type="nowrap ? 'is-grey-light' : 'is-dark'"
          size="is-small"
          @click.native="nowrap = !nowrap"/>
      </b-tooltip>
      <span>
        {{ value }}
      </span>
    </div>

    <!-- BOOLEAN -->
    <div
      v-if="isBoolean"
      :class="`has-text-centered`">
      <b-icon
        :icon="`checkbox-${booleanFromValue(value) ? 'marked' : 'blank'}-circle-outline`"
        size="is-small"/>
    </div>

    <!-- TAG / TAGS -->
    <div
      v-if="value && isTag"
      :class="`${isCategory ? 'has-text-centered' : ''}`">
      <!-- value : <code>{{ value }}</code><br> -->
      <b-tag
        v-for="(val, tagIdx) in value.split(tagSeparator).filter(v => v !== '')"
        :key="`tags-${field.field}-${tagIdx}`"
        :class="`mr-2 has-text-weight-bold`">
        {{ val }}
      </b-tag>
    </div>

    <!-- LINK -->
    <div
      v-if="value && isString && field.subtype === 'link'"
      :class="``">
      <b-button
        tag="a"
        class="mx-3"
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
      v-if="isNumber"
      :class="`has-text-right`">
      {{ value }}
    </div>
  </div>
</template>

<script>

import { mixinGlobal, mixinValue } from '@/utils/mixins.js'

export default {
  name: 'PreviewCell',
  mixins: [
    mixinGlobal,
    mixinValue
  ],
  props: {
    value: {
      default: null,
      type: [String, Boolean, Number]
    },
    field: {
      default: null,
      type: Object
    },
    isEditView: {
      default: false,
      type: Boolean
    },
    locale: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      showExpand: false,
      nowrap: true
    }
  }
  // beforeMount () {
  //   console.log('\nC > PreviewCell > beforeMount > this.value : ', this.value)
  //   console.log('C > PreviewCell > beforeMount > this.field.label : ', this.field.label)
  //   console.log('C > PreviewCell > beforeMount > this.field : ', this.field)
  //   console.log('C > PreviewCell > beforeMount > this.tagSeparator : ', this.tagSeparator)
  // }
}
</script>

<style scoped>
  .gitribute-nowrap {
    white-space: nowrap;
  }
  .gitribute-wrap {
    min-height: 3em;
  }
</style>
