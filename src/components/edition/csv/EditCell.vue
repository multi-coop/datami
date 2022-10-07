<template>
  <div
    :class="`EditCell datami-component datami-cell is-flex is-align-items-center ${field && ['boolean', 'datami'].includes(field.type) ? 'is-justify-content-center' : ''} ${field && field.type === 'tag' ? 'is-justify-content-center' : ''}`">
    <!-- DEBUGGING -->
    <b-tooltip
      v-if="debug"
      multilined
      append-to-body
      type="is-warning">
      <b-icon
        icon="information"
        type="is-warning"
        size="is-small"/>
      <template #content>
        isCardView: <code>{{ isCardView }}</code><br>
        fieldType: <code>{{ fieldType }}</code><br>
        fieldSubtype: <code>{{ fieldSubtype }}</code><br>
        hasConsolidation: <code>{{ hasConsolidation }}</code><br>
        inputData: <code>{{ inputData }}</code><br>
        isCategory: <code>{{ isCategory }}</code><br>
        <span v-if="!isTag && isCategory">
          input : <code>{{ input }}</code><br>
        </span>
        <span v-if="isTag && isCategory">
          tagsValue : <code>{{ tagsValue }}</code><br>
        </span>
        <span v-if="isTag">
          field.enumArr: <br><pre><code>{{ field.enumArr }}</code></pre><br>
        </span>
        field: <br><pre><code>{{ field }}</code></pre>
        <!-- fileOptions: <br><pre><code>{{ fileOptions }}</code></pre> -->
      </template>
    </b-tooltip>

    <!-- USER BUTTONS FOR GITRIBUTE FIELDS (CONSOLIDATION...) -->
    <div v-if="field && isDatamiField">
      <ButtonConsolidation
        v-if="isConsolidation"
        :field="field"
        :row-id="rowId"
        :is-consolidating="isConsolidating"
        :locale="locale"
        @action="SendActionToParent"/>
    </div>

    <!-- VALUE INPUT -->
    <b-field
      v-if="field && !isDatamiField"
      class="has-text-centered">
      <!--BOOLEAN -->
      <b-checkbox
        v-if="!isHeader && isBoolean"
        :custom-class="`g-cell py-0`"
        :value="input"
        :disabled="isConsolidating"
        size="is-small"
        :type="isDarkMode ? 'is-light' : 'is-dark'"
        @input="emitChange"/>

      <!-- NUMBERS -->
      <b-numberinput
        v-else-if="!isHeader && isNumber"
        :custom-class="`g-cell py-0 ${isDarkMode ? 'g-cell-number-darkmode' :''}`"
        :value="input"
        :step="isInteger ? 1 : 0.01"
        :disabled="isConsolidating"
        controls-position="compact"
        controls-rounded
        size="is-small"
        :type="isDarkMode ? 'is-dark' : 'is-light'"
        @input="emitChange"/>

      <!-- TAG / CATEGORY (SELECT) -->
      <EditTagValue
        v-else-if="!isHeader && isCategory"
        :input="input"
        :field="field"
        :tags-enum="tagsEnum"
        :disabled="isConsolidating"
        :locale="locale"
        @addTagToEnum="emitAddToEnum"
        @updateInput="emitChange"/>

      <!-- TAGS -->
      <b-taginput
        v-else-if="!isHeader && isTag && !isCategory"
        v-model="tagsValue"
        :class="`g-cell py-0`"
        :data="tagsEnum"
        :disabled="isConsolidating"
        size="is-small"
        open-on-focus
        ellipsis
        autocomplete
        allow-new
        expanded
        append-to-body
        attached
        type="is-dark"
        @input="emitChange">
        <template #tag="tag">
          <div class="test">
            {{ tag.tag }}
          </div>
        </template>
      </b-taginput>

      <!-- ANY STRING -->
      <b-input
        v-else
        :custom-class="`${isDarkMode ? 'g-cell-darkmode' : 'g-cell'} py-0 ${isHeader ? 'g-header' : ''} ${isDarkMode ? 'has-background-white' : ''}`"
        :value="input"
        :disabled="isConsolidating"
        :type="!isHeader && isLongText ? 'textarea' : 'text'"
        :rows="!isHeader && isLongText ? 3 : false"
        size="is-small"
        expanded
        @input="emitChange"/>
    </b-field>

    <!-- DEBUGGING -->
    <!-- <code>{{ input }}</code> -->
  </div>
</template>

<script>

import { mixinGlobal, mixinValue } from '@/utils/mixins.js'

import ButtonConsolidation from '@/components/edition/ButtonConsolidation.vue'
import EditTagValue from '@/components/edition/EditTagValue.vue'

export default {
  name: 'EditCell',
  components: {
    ButtonConsolidation,
    EditTagValue
  },
  mixins: [
    mixinGlobal,
    mixinValue
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    isHeader: {
      default: false,
      type: Boolean
    },
    field: {
      default: null,
      type: Object
    },
    inputData: {
      default: '',
      type: [String, Number, Boolean]
    },
    isAdded: {
      default: false,
      type: Boolean
    },
    rowId: {
      default: null,
      type: String
    },
    isConsolidating: {
      default: false,
      type: Boolean
    },
    locale: {
      default: null,
      type: String
    },
    isCardView: {
      default: false,
      type: Boolean
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      input: undefined,
      tagsValue: []
    }
  },
  watch: {
    inputData (next) {
      this.input = this.adaptInput(this.inputData)
    }
  },
  beforeMount () {
    this.input = this.adaptInput(this.inputData)
  },
  methods: {
    adaptInput (value) {
      let newInput
      if (this.isHeader) {
        newInput = value
      } else {
        switch (this.fieldType) {
          case 'boolean':
            // console.log('C > EditCell > adaptInput > value : ', value)
            newInput = this.booleanFromValue(value)
            break
          case 'number':
            newInput = parseFloat(value)
            break
          case 'integer':
            newInput = parseInt(value)
            break
          default:
            newInput = value
        }
        if (this.isTag && !this.isCategory) {
          // console.log('\nC > EditCell > adaptInput > value : ', value)
          const valStr = value && value.toString()
          newInput = valStr && [valStr]
          this.tagsValue = (valStr && valStr.split(this.tagSeparator).filter(v => v !== '')) || []
        }
      }
      return newInput
    },
    emitAddToEnum (event) {
      const updatedField = { ...this.field }
      updatedField.enumArr.push(event)
      updatedField.enumArr = updatedField.enumArr.sort((a, b) => a.localeCompare(b))
      // console.log('C > EditCell > emitChange > updatedField : ', updatedField)
      const payload = {
        action: 'addTagToEnum',
        value: {
          field: updatedField
        }
      }
      this.$emit('action', payload)
    },
    emitChange (event) {
      // console.log('C > EditCell > emitChange > event : ', event)
      let value
      if (this.isTag && !this.isCategory) {
        value = event.filter(v => v !== '')
        value = event.length ? value.join(this.tagSeparator) : ''
      } else {
        this.input = event
        value = (this.isNumber || this.isBoolean) ? event.toString() : event
      }
      const payload = {
        val: value,
        added: this.isAdded,
        colField: this.field.field
      }
      if (!this.isHeader) {
        payload.id = this.rowId
      } else {
        payload.isHeader = true
      }
      // console.log('C > EditCell > emitChange > payload : ', payload)
      this.$emit('updateCellValue', payload)

      // track with matomo
      this.trackEvent('updateCellValue')
    },
    SendActionToParent (event) {
      this.$emit('action', event)
    }
  }
}

</script>

<style>

.datami-cell > .field {
  /* border: none; */
  width: 100%;
}
.g-cell {
  background-color: transparent;
}
.g-cell-darkmode {
  background-color: white;
}
.g-cell-number-darkmode {
  background-color: white !important;
}
.g-header {
  font-size: .85em!important;
  font-weight: 600!important;
}
</style>
