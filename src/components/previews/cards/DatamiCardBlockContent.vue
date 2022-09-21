<template>
  <div
    :class="`DatamiCardBlockContent-${position} datami-component ${classes[position].content}`">
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
      v-if="field.block_title"
      class="is-size-7 mb-1">
      <span
        class="has-text-weight-bold is-uppercase">
        {{ field.block_title }}
      </span>
    </p>

    <!-- ITEM VALUE IF PREVIEW MODE -->
    <p
      v-if="currentEditViewMode === 'preview' && !field.templating"
      class="is-flex is-flex-direction-row is-align-items-center">
      <slot name="logo"></slot>
      <b-icon
        v-if="position === 'adress'"
        icon="map-marker-outline"
        size="is-small"/>
      <span
        v-if="field.prefix"
        class="mr-1 has-text-weight-bold">
        {{ field.prefix }}
      </span>
      <span v-if="isMini && position !== 'subtitle'">
        {{ trimText(itemValue || t('global.noValue', locale), 150) }}
      </span>
      <span v-else>
        {{ itemValue || t('global.noValue', locale) }}
      </span>
      <span
        v-if="field.suffix"
        class="mr-1">
        {{ field.suffix }}
      </span>
    </p>

    <!-- APPLY TEMPLATE IF ANY -->
    <div v-if="currentEditViewMode === 'preview' && field.templating">
      <p
        v-for="(paragraph, idx) in templatedValues"
        :key="`template-paragraph-${itemId}-${position}-${field.id}-${idx}`">
        <span
          v-if="isMini && !idx"
          v-html="trimText(paragraph || t('global.noValue', locale), 150)"/>
        <span
          v-if="!isMini"
          v-html="paragraph"/>
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
        :is-card-view="true"
        @updateCellValue="emitUpdate"/>
    </div>
  </div>
</template>

<script>
import { mixinGlobal, mixinValue, mixinDiff, mixinIcons } from '@/utils/mixins.js'

// import PreviewCell from '@/components/previews/PreviewCell'
import EditCell from '@/components/edition/csv/EditCell'

export default {
  name: 'DatamiCardBlockContent',
  components: {
    // PreviewCell,
    EditCell
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
          content: 'mb-3',
          label: 'is-size-7 has-text-weight-bold mb-2 is-uppercase'
        },
        infos: {
          content: 'mb-3',
          label: 'is-size-7 has-text-weight-bold mb-2 is-uppercase'
        }
      }
    }
  },
  // beforeMount () {
  //   console.log('\nC > DatamiCardBlockContent > beforeMount > this.itemId :', this.itemId)
  //   console.log('C > DatamiCardBlockContent > beforeMount > this.position :', this.position)
  //   console.log('C > DatamiCardBlockContent > beforeMount > this.fieldLabel :', this.fieldLabel)
  //   console.log('C > DatamiCardBlockContent > beforeMount > this.field :', this.field)
  //   console.log('C > DatamiCardBlockContent > beforeMount > this.itemValue :', this.itemValue)
  // },
  methods: {
    // applyTemplate (text) {
    //   // prepare regex
    //   const fieldStart = '{{'
    //   const fieldEnd = '}}'
    //   const quotesRegex = new RegExp(`(${fieldStart}.*?${fieldEnd})`)
    //   let textArr = text.split(quotesRegex)
    //   console.log('\nC > DatamiCardBlockContent > applyTemplate > textArr :', textArr)
    //   textArr = textArr.map(str => {
    //     let strClean
    //     if (str.startsWith(fieldStart)) {
    //       const fieldName = str.replace(fieldStart, '').replace(fieldEnd, '').trim()
    //       console.log('C > DatamiCardBlockContent > applyTemplate > fieldName :', fieldName)
    //       strClean = str
    //     } else {
    //       strClean = str
    //     }
    //     return strClean
    //   })
    //   const textClean = textArr.join('')
    //   return textClean
    // },
    emitUpdate (event) {
      this.$emit('updateCellValue', event)
    }
    // toggleDetail () {
    //   console.log('C > DatamiCardBlockContent > toggleDetail > this.position :', this.position)
    //   this.$emit('toggleDetail', this.position)
    // }
  }
}
</script>

<style scoped>
  .title-line-height {
    line-height: 1.2em;
  }
</style>
