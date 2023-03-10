<template>
  <div
    :class="`PreviewCell datami-${nowrap && !isLongText && !isDiffView && !isCardView ? 'nowrap' : 'wrap'}`"
    @mouseover="showExpand = true"
    @mouseleave="showExpand = false">
    <!-- {{ value }} <br> {{ field }} -->

    <!-- BTN OPEN CARD -->
    <div
      v-if="isOpenCardField"
      class="has-text-centered">
      <ButtonOpenCard
        :row-id="rowId"
        :locale="locale"
        @action="SendActionToParent"/>
    </div>

    <!-- SIMPLE STRING -->
    <div
      v-if="isString && !field.subtype"
      :class="`is-flex is-flex-direction-row ${isCategory ? 'has-text-centered' : ''} ${ isEditView ? 'has-text-grey-light is-size-7 pt-1' : 'is-size-7'}`">
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

    <!-- LONG TEXT STRING -->
    <div
      v-if="isString && isLongText"
      :class="`is-flex is-flex-direction-row ${ isEditView ? 'has-text-grey-light is-size-7 pt-1' : 'is-size-7'}`">
      <ButtonWrapCell
        v-if="!isCardView"
        v-model="nowrap"
        :show-expand="showExpand"
        :locale="locale"/>
      <div
        class="has-wrap-btn"
        @click="nowrap = !nowrap">
        <!-- <pre><code>{{ field }}</code></pre> -->
        <div v-if="field.longtextOptions">
          <PreviewLongText
            :raw-text="value"
            :from-table="true"
            :file-id="fileId"
            :field="field"
            :field-id="field.field"
            :longtext-options="field.longtextOptions"
            :max-text-length="maxTextLength"
            :nowrap="nowrap"
            :locale="locale"/>
        </div>
        <span v-else>
          {{ trimmedText }}
        </span>
      </div>
    </div>

    <!-- TIMELINE TEXT STRING -->
    <div
      v-if="isString && isTimelineText"
      :class="`is-flex is-flex-direction-row ${ isEditView ? 'has-text-grey-light is-size-7 pt-1' : 'is-size-7'}`">
      <ButtonWrapCell
        v-if="!isCardView"
        v-model="nowrap"
        :show-expand="showExpand"
        :locale="locale"/>
      <div
        class="has-wrap-btn"
        @click="nowrap = !nowrap">
        <!-- {{ value }} -->
        <PreviewTimelineText
          :raw-text="value"
          :from-table="true"
          :file-id="fileId"
          :field="field"
          :field-id="field.field"
          :step-options="field.stepOptions"
          :nowrap="nowrap"
          :locale="locale"/>
      </div>
    </div>

    <!-- BOOLEAN -->
    <div
      v-if="isBoolean"
      :class="`has-text-left is-flex is-align-items-center ml-4`">
      <b-icon
        :icon="`checkbox-${booleanFromValue(value, field) ? 'marked' : 'blank-outline'}`"/>
      <span class="ml-2 is-size-7">
        <span v-if="value === ''">
          {{ t('global.noValue', locale) }}
        </span>
        <span v-else-if="booleanFromValue(value, field)">
          {{ t('global.yes', locale) }}
        </span>
        <span v-else>
          {{ t('global.no', locale) }}
        </span>
        <!-- DEBUGGING -->
        <!-- <code>{{ value }}</code> -->
      </span>
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
          :tag-style="`color: ${tagColor(val, field, isDiffView)}; background-color:  ${tagBackgroundColor(val, field, isDiffView)}`"
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
        expanded
        @click="trackLink(`mailto:${value}`)">
        {{ trimmedText }}
      </b-button>
    </div>

    <!-- NUMBER -->
    <div
      v-if="isNumber"
      :class="`has-text-right has-text-weight-bold is-size-7`">
      {{ getNumber(value) }}
      <span
        v-if="value && isPercent"
        class="ml-2">
        %
      </span>
      <span
        v-else-if="value && field.unit"
        class="ml-2">
        {{ field.unit }}
      </span>
    </div>

    <!-- IMAGE -->
    <div
      v-if="isImage"
      :class="`has-text-right has-text-weight-bold is-size-7`">
      <!-- {{ value }} -->
      <!-- FIGURE IF ANY -->
      <figure
        v-if="value && value !== ''"
        :class="`image mx-0 image-wrapper${currentViewMode === 'table' ? '-table' : ''}`">
        <img
          :src="value"
          :class="`image-constrained ${currentViewMode === 'table' ? 'image-table' : ''}`"
          style="max-height: 40px; width: auto;"
          :alt="`${value}`">
      </figure>
      <!-- NO IMAGE FOUND -->
      <article
        v-else
        :class="`notification is-light image-wrapper${currentViewMode === 'table' ? '-table' : ''} is-flex is-align-items-center is-justify-content-center`">
        <p class="subtitle py-1 has-text-centered">
          <b-icon
            icon="image-off-outline"
            size="is-small"/>
          <br>
          <span
            v-if="currentViewMode !== 'table'"
            class="is-size-7">
            {{ t('preview.noIllustration', locale) }}
          </span>
        </p>
      </article>
    </div>
  </div>
</template>

<script>

import { mixinTooltip, mixinGlobal, mixinValue, mixinForeignKeys } from '@/utils/mixins.js'

// import ButtonWrapCell from '@/components/previews/ButtonWrapCell.vue'
// import PreviewTagValue from '@/components/previews/PreviewTagValue.vue'

export default {
  name: 'PreviewCell',
  components: {
    // ButtonWrapCell,
    // PreviewTagValue
    ButtonOpenCard: () => import(/* webpackChunkName: "ButtonOpenCard" */ '@/components/previews/ButtonOpenCard.vue'),
    ButtonWrapCell: () => import(/* webpackChunkName: "ButtonWrapCell" */ '@/components/previews/ButtonWrapCell.vue'),
    PreviewTagValue: () => import(/* webpackChunkName: "PreviewTagValue" */ '@/components/previews/PreviewTagValue.vue'),
    PreviewLongText: () => import(/* webpackChunkName: "PreviewLongText" */ '@/components/previews/PreviewLongText.vue'),
    PreviewTimelineText: () => import(/* webpackChunkName: "PreviewTimelineText" */ '@/components/previews/PreviewTimelineText.vue')
  },
  mixins: [
    mixinTooltip,
    mixinGlobal,
    mixinValue,
    mixinForeignKeys
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    rowId: {
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
    maxTextLength () {
      return this.field.maxLength || this.defaultMaxTextLength
    },
    trimmedText () {
      // console.log('\nC > PreviewCell > trimmedText > this.value : ', this.value)
      const textToTrim = this.value || ''
      const exceed = this.nowrap && (textToTrim.length > this.maxTextLength)
      // console.log('C > PreviewCell > trimmedText > exceed : ', exceed)
      const trimmed = exceed ? `${textToTrim.slice(0, this.maxTextLength)} [...]` : textToTrim
      return trimmed || ''
    },
    trimmedLongText () {
      return true
    },
    tagsArray () {
      // console.log('\nC > PreviewCell > tagsArray > this.value : ', this.value)
      // console.log('C > PreviewCell > tagsArray > this.field : ', this.field)
      // console.log('C > PreviewCell > tagsArray > this.tagSeparator : ', this.tagSeparator)
      // const valType = typeof this.value
      // console.log('C > PreviewCell > tagsArray > valType : ', valType)
      let tags
      const tagsStr = (!!this.value && this.value.toString()) || ''
      let allTags = (tagsStr && this.fieldSubtype === 'tags' && tagsStr.split(this.tagSeparator)) || [tagsStr]
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
    getNumber (value) {
      const val = this.getNumberByField(value, this.field)
      return val ? this.localeValue(val, this.locale, this.field.round) : this.t('global.noValue', this.locale)
    },
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
    },
    SendActionToParent (event) {
      this.$emit('action', event)
    }
  }
}
</script>
