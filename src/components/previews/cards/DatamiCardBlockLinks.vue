<template>
  <div class="DatamiCardBlockLinks datami-component mb-4">
    <p
      v-if="currentEditViewMode !== 'preview'"
      class="is-size-7 has-text-weight-bold mb-2 is-uppercase">
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
      <b-button
        v-if="itemValue"
        tag="a"
        size="is-small"
        icon-left="open-in-new"
        :href="itemValue"
        target="_blank"
        class="outlink"
        @click="trackLink(itemValue)">
        {{ t('global.link', locale) }}
      </b-button>
      <span v-else>
        <b-icon
          icon="link-variant-off"
          size="is-small"
          type="is-dark"
          class="mr-1"/>
        {{ t('global.noLinkValue', locale) }}
      </span>
    </div>
    <div v-if="currentEditViewMode === 'diff'">
      <div v-if="isInChanges(false, itemAdded, field.field, itemId)">
        <span v-html="getDiffHtmlChars(false, itemAdded, field.field, itemValue, itemId)"/>
      </div>
      <b-button
        v-else
        tag="a"
        size="is-small"
        icon-left="open-in-new"
        :href="itemValue"
        target="_blank"
        class="outlink"
        @click="trackLink(itemValue)">
        {{ t('global.link', locale) }}
      </b-button>
    </div>
    <div
      v-if="currentEditViewMode === 'edit'"
      class="mr-2">
      <EditCell
        :file-id="fileId"
        :field="field"
        :row-id="itemId"
        :is-added="itemAdded"
        :input-data="itemValue || ''"
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
  name: 'DatamiCardBlockLinks',
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
  //   console.log('\nC > DatamiCardBlockLinks > beforeMount > this.itemId :', this.itemId)
  //   console.log('C > DatamiCardBlockLinks > beforeMount > this.position :', this.position)
  //   console.log('C > DatamiCardBlockLinks > beforeMount > this.fieldLabel :', this.fieldLabel)
  //   console.log('C > DatamiCardBlockLinks > beforeMount > this.field :', this.field)
  //   console.log('C > DatamiCardBlockLinks > beforeMount > this.itemValue :', this.itemValue)
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
