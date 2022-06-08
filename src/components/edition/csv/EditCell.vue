<template>
  <div
    :class="`EditCell gitribute-component gitribute-cell is-flex is-align-items-center
      ${field && ['boolean', 'gitribute'].includes(field.type) ? 'is-justify-content-center' : ''}
      ${field && field.type === 'tag' ? 'is-justify-content-center' : ''}
    `">
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
    <div v-if="field && isGitributeField">
      <ButtonConsolidation
        v-if="isConsolidation"
        :field="field"
        :row-id="rowId"
        :is-consolidating="isConsolidating"
        :locale="locale"
        @action="SendActionToParent"/>
    </div>

    <!-- VALUE INPUT -->
    <b-field v-if="field && !isGitributeField">
      <!--BOOLEAN -->
      <!-- <b-switch
        v-if="!isHeader && field.type === 'boolean'"
        :custom-class="`g-cell g-cell-boolean${ isCardView ? '-card' :'' } py-0`"
        :value="input"
        :disabled="isConsolidating"
        size="is-small"
        type="is-dark"
        @input="emitChange"/> -->
      <b-checkbox
        v-if="!isHeader && isBoolean"
        :custom-class="`g-cell g-cell-boolean${ isCardView ? '-card' :'' } py-0`"
        :value="input"
        :disabled="isConsolidating"
        size="is-small"
        type="is-dark"
        @input="emitChange"/>

      <!-- NUMBERS -->
      <b-numberinput
        v-else-if="!isHeader && isNumber"
        :custom-class="`g-cell g-cell-${isInteger ? 'integer' : 'number'}${ isCardView ? '-card' :'' } py-0`"
        :value="input"
        :step="isInteger ? 1 : 0.01"
        :disabled="isConsolidating"
        controls-position="compact"
        controls-rounded
        size="is-small"
        type="is-light"
        @input="emitChange"/>

      <!-- CATEGORY SELECT -->
      <b-select
        v-else-if="!isHeader && isCategory"
        v-model="input"
        :class="`g-cell g-cell-tag${ isCardView ? '-card' :'' } py-0`"
        :disabled="isConsolidating"
        size="is-small"
        expanded
        @input="emitChange">
        <option
          v-for="(val, i) in tagsEnum"
          :key="`${field.field}-${i}-${val}`"
          :value="val">
          {{ val }}
        </option>
      </b-select>

      <!-- TAGS -->
      <b-taginput
        v-else-if="!isHeader && isTag && !isCategory"
        v-model="tagsValue"
        :class="`g-cell g-cell-tags${ isCardView ? '-card' :'' } py-0`"
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
        type="is-grey"
        @input="emitChange"/>

      <!-- ANY STRING -->
      <b-input
        v-else
        :custom-class="`g-cell g-cell-string${ isLongText ? '-longtext' : '' }${ isCardView ? '-card' : '' } py-0 ${isHeader ? 'g-header' : ''}`"
        :value="input"
        :disabled="isConsolidating"
        :type="isLongText ? 'textarea' : 'text'"
        :rows="isLongText ? 3 : false"
        size="is-small"
        expanded
        @input="emitChange"/>
    </b-field>
  </div>
</template>

<script>

import { mixinGlobal, mixinValue } from '@/utils/mixins.js'

import ButtonConsolidation from '@/components/edition/ButtonConsolidation.vue'

export default {
  name: 'EditCell',
  components: {
    ButtonConsolidation
  },
  mixins: [
    mixinGlobal,
    mixinValue
  ],
  props: {
    isHeader: {
      default: false,
      type: Boolean
    },
    field: {
      default: null,
      type: Object
    },
    inputData: {
      default: null,
      type: [String, Number]
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
      switch (this.fieldType) {
        case 'boolean':
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
        newInput = [value]
        this.tagsValue = value.split(this.tagSeparator).filter(v => v !== '') || []
      }
      return newInput
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
    },
    SendActionToParent (event) {
      this.$emit('action', event)
    }
  }
}

</script>

<style>

.gitribute-cell {
  /* border: none; */
}
.g-cell {
  background-color: transparent;
  /* border: none; */
}
.g-cell-string {
  min-width: 150px;
}
.g-cell-string-longtext {
  min-width: 250px;
}
.g-cell-number {
  min-width: 85px;
}
.g-cell-integer {
  min-width: 40px;
}
.g-cell-boolean {
  min-width: 30px;
}
.g-cell-tag {
  min-width: 150px;
}
.g-cell-tags {
  min-width: 275px;
}
.g-header {
  font-size: .85em!important;
  font-weight: 600!important;
}
</style>
