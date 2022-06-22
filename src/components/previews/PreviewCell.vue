<template>
  <div
    :class="`PreviewCell gitribute-${nowrap && !isLongText && !isDiffView && !isCardView ? 'nowrap' : 'wrap'}`"
    @mouseover="showExpand = true"
    @mouseleave="showExpand = false">
    <!-- {{ value }} <br> {{ field }} -->

    <!-- WRAP CELL SWITCH -->
    <div
      v-if="isString && !field.subtype && !isDiffView"
      :class="`${isCategory ? 'has-text-centered' : ''} ${ isEditView ? 'has-text-grey-light is-size-7 pt-1' : ''}`">
      <ButtonWrapCell
        v-model="nowrap"
        :show-expand="showExpand"
        :locale="locale"/>
      <span>
        {{ value }}
      </span>
    </div>

    <!-- STRING -->
    <div
      v-if="isString && isLongText"
      :class="`${ isEditView ? 'has-text-grey-light is-size-7 pt-1' : ''}`">
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
        {{ trimmedText }}
      </span>
    </div>

    <!-- BOOLEAN -->
    <div
      v-if="isBoolean"
      :class="`has-text-centered`">
      <!-- {{ value }} -->
      <b-icon
        :icon="`checkbox-${booleanFromValue(value) ? 'marked' : 'blank-outline'}`"
        size="is-small"/>
    </div>

    <!-- TAG / TAGS -->
    <div
      v-if="value && isTag"
      :class="`${isCategory && !isCardView ? 'has-text-centered' : ''}`">
      <!-- value : <code>{{ value }}</code><br> -->
      <ButtonWrapCell
        v-if="!isCardView"
        v-model="nowrap"
        :show-expand="showExpand"
        :locale="locale"/>
      {{ currentEditViewMode }}
      <b-tag
        v-for="(val, tagIdx) in tagsArray"
        :key="`tags-${field.field}-${tagIdx}`"
        :class="`mr-2 mb-2 has-text-weight-bold`"
        :style="`color: ${tagColour(val, isDiffView)}; background-color:  ${tagBackgroundColour(val, field, isDiffView)}`">
        <span v-if="isMini">
          <b-tooltip
            :label="val"
            multilined
            type="is-dark"
            position="is-top">
            {{ trimText(val) }}
          </b-tooltip>
        </span>
        <span v-else>
          {{ val }}
        </span>
      </b-tag>
    </div>

    <!-- LINK -->
    <div
      v-if="value && isLink"
      :class="``">
      <b-button
        tag="a"
        class=""
        size="is-small"
        icon-left="open-in-new"
        :href="value"
        expanded
        target="_blank">
        <!-- {{ t('global.link', locale) }} -->
        {{ linkDomain(value) }}
      </b-button>
    </div>

    <!-- EMAIL -->
    <div
      v-if="value && isEmail"
      :class="``">
      <b-button
        tag="a"
        class=""
        size="is-small"
        icon-left="email-outline"
        :href="`mailto:${value}`"
        expanded>
        {{ value }}
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

import ButtonWrapCell from '@/components/previews/ButtonWrapCell.vue'

export default {
  name: 'PreviewCell',
  components: {
    ButtonWrapCell
  },
  mixins: [
    mixinGlobal,
    mixinValue
  ],
  props: {
    value: {
      default: false,
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
    isDiffView: {
      default: false,
      type: Boolean
    },
    isCardView: {
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
  data () {
    return {
      showExpand: false,
      nowrap: true,
      defaultMaxTextLength: 30
    }
  },
  computed: {
    trimmedText () {
      // console.log('\nC > PreviewCell > trimmedText > this.value : ', this.value)
      const maxTextLength = this.field.maxLength || this.defaultMaxTextLength
      // console.log('C > PreviewCell > trimmedText > maxTextLength : ', maxTextLength)
      const exceed = this.nowrap && (this.value.length > maxTextLength)
      // console.log('C > PreviewCell > trimmedText > exceed : ', exceed)
      const trimmed = exceed ? `${this.value.slice(0, maxTextLength)} (...)` : this.value
      return trimmed || ''
    },
    tagsArray () {
      // console.log('\nC > PreviewCell > tagsArray > this.value : ', this.value)
      // console.log('C > PreviewCell > tagsArray > this.field : ', this.field)
      // console.log('C > PreviewCell > tagsArray > this.tagSeparator : ', this.tagSeparator)
      // const valType = typeof this.value
      // console.log('C > PreviewCell > tagsArray > valType : ', valType)
      const tagsStr = (!!this.value && this.value.toString()) || ''
      let tags = (tagsStr && tagsStr.split(this.tagSeparator)) || [tagsStr]
      tags = tags.filter(v => v !== '')
      return tags
    }
  },
  methods: {
    linkDomain (value) {
      // console.log('\nC > PreviewCell > linkDomain > value : ', value)
      let urlObj
      try {
        urlObj = new URL(value)
      } catch {
        urlObj = {}
      }
      // console.log('C > PreviewCell > linkDomain > urlObj : ', urlObj)
      return urlObj.hostname || this.t('global.link', this.locale)
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
