<template>
  <div
    :class="`DatamiCardBlockContent-${position} datami-component ${classes[position] ? classes[position].content : ''}`">
    <!-- LABEL IF EDIT MODE -->
    <p
      v-if="currentEditViewMode === 'edit'"
      :class="classes[position].label">
      <!-- FIELD TYPE ICON -->
      <b-icon
        :icon="getIconFieldType(field)"
        :class="`${isDatamiField ? '' : 'ml-2 mr-2'}`"
        :type="`is-${ isPrimaryKey || isForeignKey ? 'dark' : 'grey-light'}`"
        size="is-small"/>
      {{ fieldLabel }}
      <!-- <br>field : <code>{{ field }}</code> -->
    </p>

    <!-- BLOCK TITLE IF ANY -->
    <p
      v-show="currentEditViewMode !== 'edit' && field.block_title"
      class="is-size-7 mb-1"
      @click="showCollapse = !showCollapse">
      <b-icon
        v-if="field.titleIcon"
        :icon="field.titleIcon"
        class="mr-2"
        size="is-small"/>
      <span
        class="has-text-weight-bold is-uppercase">
        {{ field.block_title }}
      </span>
      <b-icon
        v-if="field.longtextOptions && field.longtextOptions.canCollapse"
        :icon="`chevron-${showCollapse ? 'down' : 'up'}`"
        class="ml-4"
        size="is-small"/>
    </p>

    <!-- ITEM VALUE IF PREVIEW MODE -->
    <p
      v-if="currentEditViewMode === 'preview' && !field.templating"
      class="is-flex is-flex-direction-row is-align-items-center">
      <slot name="logo"/>
      <b-icon
        v-if="position === 'adress'"
        icon="map-marker-outline"
        class="mr-2"
        size="is-small"/>
      <b-icon
        v-if="field.prefixIcon"
        :icon="field.prefixIcon"
        class="mr-2"
        size="is-small"/>
      <span
        v-if="field.prefix"
        class="mr-1 has-text-weight-bold">
        {{ field.prefix }}
      </span>
      <span v-if="field.subtype === 'longtext' && field.longtextOptions">
        <!-- DEBUGGING -->
        <!-- <div v-if="field.subtype === 'longtext'">
              field : <code>{{ field }}</code>
            </div> -->
        <span v-show="showCollapse">
          <PreviewLongText
            :raw-text="itemValue"
            :file-id="fileId"
            :field-id="field.field"
            :field="field"
            :longtext-options="field.longtextOptions"
            :nowrap="isMini"
            :max-text-length="field.maxLength"
            :locale="locale"/>
        </span>
      </span>
      <span v-else-if="isMini && position !== 'subtitle'">
        {{ trimText(itemValue || t('global.noValue', locale), 150) }}
      </span>
      <PreviewTimelineText
        v-else-if="position === 'timeline'"
        :raw-text="itemValue"
        :file-id="fileId"
        :field-id="field.field"
        :field="field"
        :step-options="field.stepOptions"
        :locale="locale"/>

      <!-- NUMBERS -->
      <span v-else-if="field.type === 'number'">
        {{ getNumber(itemValue) || t('global.noValue', locale) }}
        <!-- {{ field }} -->
        <span v-if="field.subtype === 'percent'">
          &nbsp;%
        </span>
      </span>

      <!-- SIMPLE TEXT VALUE -->
      <span v-else>
        {{ itemValue || t('global.noValue', locale) }}
      </span>

      <!-- SUFFIX -->
      <span
        v-if="field.suffix"
        class="mr-1">
        {{ field.suffix }}
      </span>
    </p>

    <!-- APPLY TEMPLATE IF ANY -->
    <div v-if="currentEditViewMode === 'preview' && field.templating">
      <!-- <code>{{ templatedValues }}</code> -->
      <p
        v-for="(paragraph, idx) in templatedValues"
        :key="`template-paragraph-${itemId}-${position}-${field.id}-${idx}`"
        :class="paragraph.customClass">
        <span
          v-if="isMini && !idx && !paragraph.ignoreTrimming"
          v-html="trimText(paragraph.text || t('global.noValue', locale), 150)"/>
        <span
          v-if="!isMini || paragraph.ignoreTrimming"
          v-html="paragraph.text"/>
      </p>
    </div>

    <!-- ITEM VALUE IF DIFF MODE -->
    <div v-if="currentEditViewMode === 'diff'">
      <div v-if="isInChanges(false, itemAdded, field.field, itemId)">
        <span v-html="getDiffHtmlChars(false, itemAdded, field.field, itemValue, itemId)"/>
      </div>
      <span v-else>
        {{ itemValue || '' }}
      </span>
    </div>

    <!-- ITEM VALUE IF EDIT MODE -->
    <div
      v-if="currentEditViewMode === 'edit'"
      class="mr-2">
      <EditCell
        :file-id="fileId"
        :field="field"
        :col-field="field.field"
        :row-id="itemId"
        :is-added="itemAdded"
        :input-data="itemValue"
        :locale="locale"
        :is-card-view="true"/>
        <!-- @updateCellValue="emitUpdate"/> -->
    </div>
  </div>
</template>

<script>
import { mixinGlobal, mixinValue, mixinDiff, mixinIcons } from '@/utils/mixins.js'

export default {
  name: 'DatamiCardBlockContent',
  components: {
    PreviewLongText: () => import(/* webpackChunkName: "PreviewLongText" */ '@/components/previews/PreviewLongText.vue'),
    PreviewTimelineText: () => import(/* webpackChunkName: "PreviewTimelineText" */ '@/components/previews/PreviewTimelineText.vue'),
    EditCell: () => import(/* webpackChunkName: "EditCell" */ '@/components/edition/csv/EditCell.vue')
  },
  mixins: [
    mixinGlobal,
    mixinValue,
    mixinDiff,
    mixinIcons
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    position: {
      default: null,
      type: String
    },
    field: {
      default: undefined,
      type: Object
    },
    fieldLabel: {
      default: undefined,
      type: String
    },
    itemId: {
      default: undefined,
      type: [String, Number]
    },
    templatedValues: {
      default: undefined,
      type: Array
    },
    itemAdded: {
      default: false,
      type: Boolean
    },
    itemValue: {
      default: null,
      type: [String, Number, Object, Array]
    },
    isMini: {
      default: false,
      type: Boolean
    },
    locale: {
      default: '',
      type: String
    },
    // onlyPreview: {
    //   default: false,
    //   type: Boolean
    // },
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      showCollapse: true,
      classes: {
        title: {
          content: 'is-size-4 mb-0 has-text-weight-bold title-line-height',
          label: 'is-size-7 has-text-weight-bold mb-2 is-uppercase'
        },
        subtitle: {
          content: 'has-text-weight-medium mt-1',
          label: 'is-size-7 has-text-weight-bold mb-2 is-uppercase'
        },
        adress: {
          content: 'mt-3',
          label: 'is-size-7 has-text-weight-bold mb-2'
        },
        resume: {
          content: 'has-text-weight-medium mb-4',
          label: 'is-size-7 has-text-weight-bold mb-2 is-uppercase'
        },
        description: {
          content: 'mb-4',
          label: 'is-size-7 has-text-weight-bold mb-2 is-uppercase'
        },
        infos: {
          content: 'mb-3',
          label: 'is-size-7 has-text-weight-bold mb-2 is-uppercase'
        },
        timeline: {
          content: 'mb-3',
          label: 'is-size-7 has-text-weight-bold mb-2 is-uppercase'
        }
      }
    }
  },
  beforeMount () {
    if (this.field.subtype === 'longtext' && this.field.longtextOptions && this.field.longtextOptions.canCollapse) {
      this.showCollapse = this.field.longtextOptions.isOpen
    }
  //   console.log('\nC > DatamiCardBlockContent > beforeMount > this.itemId :', this.itemId)
  //   console.log('C > DatamiCardBlockContent > beforeMount > this.position :', this.position)
  //   console.log('C > DatamiCardBlockContent > beforeMount > this.fieldLabel :', this.fieldLabel)
  //   console.log('C > DatamiCardBlockContent > beforeMount > this.field :', this.field)
  //   console.log('C > DatamiCardBlockContent > beforeMount > this.itemValue :', this.itemValue)
  },
  methods: {
    getNumber (value) {
      return this.getNumberByField(value, this.field)
    }
  }
}
</script>
