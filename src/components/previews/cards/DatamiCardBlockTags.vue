<template>
  <div class="DatamiCardBlockTags datami-component mb-3">
    <p
      v-if="currentEditViewMode !== 'preview'"
      class="is-size-6 has-text-weight-bold mb-2 is-uppercase">
      <!-- FIELD TYPE ICON -->
      <b-icon
        :icon="getIconFieldType(field)"
        :class="`${isDatamiField ? '' : 'ml-2 mr-2'}`"
        :type="`is-${ isPrimaryKey || isForeignKey ? 'dark' : 'grey-light'}`"
        size="is-small"/>
      {{ fieldLabel }}
    </p>
    <p
      v-if="field.block_title"
      class="is-size-7 mb-1">
      <span
        class="has-text-weight-bold is-uppercase">
        {{ field.block_title }}
      </span>
    </p>
    <div v-if="currentEditViewMode === 'preview'">
      <PreviewCell
        v-if="itemValue"
        :file-id="fileId"
        :value="itemValue"
        :field="field"
        :is-card-view="true"
        :is-mini="isMini"
        :locale="locale"/>
      <span v-else>
        {{ t('global.noValue', locale) }}
      </span>
    </div>
    <div v-if="currentEditViewMode === 'diff'">
      <div v-if="isInChanges(false, itemAdded, field.field, itemId)">
        <span v-html="getDiffHtmlChars(false, itemAdded, f.field, itemValue, itemId)"/>
      </div>
      <PreviewCell
        v-else
        :file-id="fileId"
        :value="itemValue"
        :is-diff-view="true"
        :is-card-view="true"
        :is-mini="isMini"
        :field="field"
        :locale="locale"/>
    </div>
    <div
      v-if="currentEditViewMode === 'edit'"
      class="mr-2">
      <!-- {{ field }} -->
      <EditCell
        :file-id="fileId"
        :field="field"
        :row-id="itemId"
        :is-added="itemAdded"
        :input-data="itemValue || ''"
        :locale="locale"
        :is-card-view="true"
        @action="SendActionToParent"
        @updateCellValue="emitUpdate"/>
    </div>
  </div>
</template>

<script>
import { mixinGlobal, mixinValue, mixinDiff, mixinIcons } from '@/utils/mixins.js'

import PreviewCell from '@/components/previews/PreviewCell'
import EditCell from '@/components/edition/csv/EditCell'

export default {
  name: 'DatamiCardBlockTags',
  components: {
    PreviewCell,
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
    }
  },
  // beforeMount () {
  //   console.log('\nC > DatamiCardBlockTags > beforeMount > this.itemId :', this.itemId)
  //   console.log('C > DatamiCardBlockTags > beforeMount > this.position :', this.position)
  //   console.log('C > DatamiCardBlockTags > beforeMount > this.fieldLabel :', this.fieldLabel)
  //   console.log('C > DatamiCardBlockTags > beforeMount > this.field :', this.field)
  //   console.log('C > DatamiCardBlockTags > beforeMount > this.itemValue :', this.itemValue)
  // },
  methods: {
    emitUpdate (event) {
      this.$emit('updateCellValue', event)
    },
    SendActionToParent (event) {
      this.$emit('action', event)
    }
  }
}
</script>
