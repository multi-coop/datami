<template>
  <div
    :class="`PreviewCell gitribute-${nowrap && !isLongText && !isDiffView && !isCardView ? 'nowrap' : 'wrap'}`"
    @mouseover="showExpand = true"
    @mouseleave="showExpand = false">
    <!-- {{ value }} <br> {{ field }} -->

    <!-- SIMPLE STRING -->
    <div
      v-if="isString && !field.subtype"
      :class="`is-flex is-flex-direction-row ${isCategory ? 'has-text-centered' : ''} ${ isEditView ? 'has-text-grey-light is-size-7 pt-1' : ''}`">
      <ButtonWrapCell
        v-if="!isCardView"
        v-model="nowrap"
        :show-expand="showExpand"
        :locale="locale"/>
      <div
        class="has-wrap-btn"
        @click="nowrap = !nowrap">
        <!-- <b-tooltip
          :active="showExpand && field.foreignKey"
          multilined
          append-to-body
          type="is-dark">
          <template #content>
            <div>
              {{ field.foreignKey }}
            </div>
          </template> -->
        {{ trimmedText }}
        <!-- </b-tooltip> -->
      </div>
    </div>

    <!-- LONG TEXT STRING -->
    <div
      v-if="isString && isLongText"
      :class="`is-flex is-flex-direction-row ${ isEditView ? 'has-text-grey-light is-size-7 pt-1' : ''}`">
      <ButtonWrapCell
        v-if="!isCardView"
        v-model="nowrap"
        :show-expand="showExpand"
        :locale="locale"/>
      <div
        class="has-wrap-btn"
        @click="nowrap = !nowrap">
        {{ trimmedText }}
      </div>
    </div>

    <!-- BOOLEAN -->
    <div
      v-if="isBoolean"
      :class="`has-text-centered`">
      <!-- {{ value }} -->
      <b-icon
        :icon="`checkbox-${booleanFromValue(value) ? 'marked' : 'blank-outline'}`"/>
    </div>

    <!-- TAG / TAGS -->
    <div
      v-if="value && isTag"
      :class="`is-flex is-flex-direction-row`">
      <!-- value : <code>{{ value }}</code><br> -->
      <ButtonWrapCell
        v-if="!isCardView"
        v-model="nowrap"
        :show-expand="showExpand"
        :locale="locale"/>
      <!-- <pre class="has-text-left"><code>{{ field }}</code></pre> -->
      <div :class="`has-wrap-btn ${isCategory && !isCardView ? 'has-text-centered' : ''}`">
        <PreviewTagValue
          v-for="(val, tagIdx) in tagsArray"
          :key="`tags-${field.field}-${tagIdx}`"
          :file-id="fileId"
          :val="val"
          :tag-style="`color: ${tagColor(val, field.bgColor, isDiffView)}; background-color:  ${tagBackgroundColor(val, field.bgColor, isDiffView)}`"
          :field="field"
          :is-mini="isMini"
          :locale="locale"
          @expand="nowrap = !nowrap"/>
      </div>
    </div>

    <!-- LINK -->
    <div
      v-if="value && isLink"
      :class="``">
      <b-button
        tag="a"
        class="outlink"
        size="is-small"
        icon-left="open-in-new"
        :href="value"
        expanded
        target="_blank"
        @click="trackLink(value)">
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
        class="outlink"
        size="is-small"
        icon-left="email-outline"
        :href="`mailto:${value}`"
        @click="trackLink(`mailto:${value}`)">
        expanded>
        {{ trimmedText }}
      </b-button>
    </div>

    <!-- NUMBER -->
    <div
      v-if="isNumber"
      :class="`has-text-right has-text-weight-bold is-size-6`">
      {{ value }}
      <span
        v-if="isPercent"
        class="ml-2">
        %
      </span>
    </div>
  </div>
</template>

<script>

import { mixinGlobal, mixinValue, mixinForeignKeys } from '@/utils/mixins.js'

import ButtonWrapCell from '@/components/previews/ButtonWrapCell.vue'
import PreviewTagValue from '@/components/previews/PreviewTagValue.vue'

export default {
  name: 'PreviewCell',
  components: {
    ButtonWrapCell,
    PreviewTagValue
  },
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
      defaultMaxTextLength: 30,
      defaultMaxTags: 2,
      showTag: undefined
    }
  },
  computed: {
    trimmedText () {
      // console.log('\nC > PreviewCell > trimmedText > this.value : ', this.value)
      const textToTrim = this.value ?? ''
      const maxTextLength = this.field.maxLength || this.defaultMaxTextLength
      // console.log('C > PreviewCell > trimmedText > maxTextLength : ', maxTextLength)
      const exceed = this.nowrap && (textToTrim.length > maxTextLength)
      // console.log('C > PreviewCell > trimmedText > exceed : ', exceed)
      const trimmed = exceed ? `${textToTrim.slice(0, maxTextLength)} [...]` : textToTrim
      return trimmed || ''
    },
    tagsArray () {
      // console.log('\nC > PreviewCell > tagsArray > this.value : ', this.value)
      // console.log('C > PreviewCell > tagsArray > this.field : ', this.field)
      // console.log('C > PreviewCell > tagsArray > this.tagSeparator : ', this.tagSeparator)
      // const valType = typeof this.value
      // console.log('C > PreviewCell > tagsArray > valType : ', valType)
      let tags
      const tagsStr = (!!this.value && this.value.toString()) || ''
      let allTags = (tagsStr && tagsStr.split(this.tagSeparator)) || [tagsStr]
      allTags = allTags.filter(v => v !== '')
      if (this.nowrap) {
        tags = allTags.slice(0, this.defaultMaxTags)
        tags = allTags.length > this.defaultMaxTags ? [...tags, '...'] : tags
      } else {
        tags = allTags
      }
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
    min-height: 2em;
  }
  .has-wrap-btn {

  }
</style>
