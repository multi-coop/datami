<template>
  <div
    :class="`EditCell gitribute-component gitribute-cell is-flex is-align-items-center
      ${field && field.type === 'boolean' ? 'is-justify-content-center' : ''}
      ${field && field.type === 'tag' ? 'is-justify-content-center' : ''}
    `">
    <!-- DEBUGGING -->
    <b-tooltip
      v-if="false"
      multilined
      append-to-body
      type="is-warning">
      <b-icon
        icon="information"
        type="is-warning"
        size="is-small"/>
      <template #content>
        fieldType: <code>{{ fieldType }}</code><br>
        inputData: <code>{{ inputData }}</code><br>
        <!-- isCategory: <code>{{ isCategory }}</code> -->
        <span v-if="!isTag && isCategory">
          input : <code>{{ input }}</code><br>
        </span>
        <span v-if="isTag && isCategory">
          tagsValue : <code>{{ tagsValue }}</code><br>
        </span>
        <span v-if="isTag">
          field.enumArr: <br><pre><code>{{ field.enumArr }}</code></pre>
        </span>
      </template>
    </b-tooltip>

    <!-- VALUE INPUT -->
    <b-field v-if="field">
      <!--BOOLEAN -->
      <b-switch
        v-if="!isHeader && field.type === 'boolean'"
        :custom-class="`g-cell g-cell-boolean py-0`"
        :value="input"
        size="is-small"
        type="is-dark"
        @input="emitChange"/>

      <!-- CATEGORY SELECT -->
      <!-- <b-numberinput
        v-else-if="!isHeader && field.type === 'integer'"
        :custom-class="`g-cell g-cell-integer py-0`"
        :value="input"
        controls-position="compact"
        controls-rounded
        size="is-small"
        type="is-light"
        @input="emitChange"/> -->

      <!-- NUMBERS -->
      <b-numberinput
        v-else-if="!isHeader && isNumber"
        :custom-class="`g-cell g-cell-${isInteger ? 'integer' : 'number'} py-0`"
        :value="input"
        :step="isInteger ? 1 : 0.01"
        controls-position="compact"
        controls-rounded
        size="is-small"
        type="is-light"
        @input="emitChange"/>

      <!-- CATEGORY SELECT -->
      <b-select
        v-else-if="!isHeader && isCategory"
        v-model="input"
        :class="`g-cell g-cell-tag py-0`"
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
        :class="`g-cell g-cell-tags py-0`"
        :data="tagsEnum"
        size="is-small"
        open-on-focus
        ellipsis
        autocomplete
        allow-new
        expanded
        append-to-body
        attached
        type="is-dark"
        @input="emitChange"/>

      <!-- ANY STRING -->
      <b-input
        v-else
        :custom-class="`g-cell g-cell-string py-0 ${isHeader ? 'g-header' : ''}`"
        :value="input"
        size="is-small"
        expanded
        @input="emitChange"/>
    </b-field>
  </div>
</template>

<script>

import { mixinGlobal, mixinValue } from '@/utils/mixins.js'

export default {
  name: 'EditCell',
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
        this.tagsValue = value.split(this.tagSeparator).filter(v => v !== '')
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
  min-width: 300px;
}
.g-header {
  font-size: .85em!important;
  font-weight: 600!important;
}
</style>
