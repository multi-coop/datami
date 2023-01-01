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
          tagsEnum : <code>{{ tagsEnum }}</code><br>
        </span>
        <span v-if="isTag">
          field.enumArr: <br><pre><code>{{ field.enumArr }}</code></pre><br>
        </span>
        field: <br><pre><code>{{ field }}</code></pre>
        <!-- fileOptions: <br><pre><code>{{ fileOptions }}</code></pre> -->
      </template>
    </b-tooltip>

    <div v-if="debug && !isHeader && isTag && !isCategory">
      tagsValue : <code>{{ tagsValue }}</code><br>
      tagsEnum : <code>{{ tagsEnum }}</code><br>
      tagsEnumEnriched : <code>{{ tagsEnumEnriched }}</code><br>
    </div>

    <div v-if="debug && !isHeader && isBoolean">
      input : <code>{{ input }}</code><br>
    </div>

    <!-- USER BUTTONS FOR DATAMI FIELDS (CONSOLIDATION...) -->
    <div
      v-if="field && isOpenCardField"
      class="has-text-centered">
      <ButtonOpenCard
        :row-id="rowId"
        :locale="locale"
        @action="SendActionToParent"/>
    </div>
    <div v-if="field && isConsolidation">
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
      :class="`has-text-${isBoolean ? 'left ml-5' : 'centered'}`">
      <!--BOOLEAN -->
      <b-checkbox
        v-if="!isHeader && isBoolean"
        :custom-class="`g-cell py-0`"
        :indeterminate="inputData === ''"
        :value="inputBool"
        :disabled="isConsolidating"
        size="is-small"
        :type="inputData === '' ? 'is-warning' : isDarkMode ? 'is-light' : 'is-dark'"
        @input="emitChange">
        <span v-if="inputData === ''">
          {{ t('global.noValue', locale) }}
        </span>
        <span v-else>
          {{ input }}
        </span>
      </b-checkbox>

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
        :def-label="getValueDefinitionLabel(input)"
        :field="field"
        :tags-enum="tagsEnum"
        :tags-enum-enriched="tagsEnumEnriched"
        :disabled="isConsolidating"
        :locale="locale"
        @addTagToEnum="emitAddToEnum"
        @updateInput="emitChange"/>

      <!-- TAGS -->
      <b-taginput
        v-else-if="!isHeader && isTag && !isCategory"
        v-model="tagsValue"
        :data="tagsEnum"
        :class="`g-cell py-0`"
        :disabled="isConsolidating"
        :read-only="field.locked"
        :allow-new="field.allowNew"
        size="is-small"
        open-on-focus
        ellipsis
        autocomplete
        expanded
        append-to-body
        attached
        type="is-dark"
        @input="emitChange">
        <template slot-scope="props">
          <span :class="`${tagsValue.includes(props.option) ? 'has-text-weight-bold' : ''}`">
            {{ props.option }}
            <span v-if="getValueDefinitionLabel(props.option)">
              : {{ getValueDefinitionLabel(props.option) }}
            </span>
          </span>
        </template>
        <template #tag="tag">
          <div>
            {{ tag.tag }}
            <span v-if="getValueDefinitionLabel(tag.tag)">
              : {{ getValueDefinitionLabel(tag.tag) }}
            </span>
          </div>
        </template>
        <!-- <template #empty>
          {{ t('global.noValue', locale) }}
        </template> -->
      </b-taginput>

      <!-- ANY STRING -->
      <b-input
        v-else
        :custom-class="`${isDarkMode ? 'g-cell-darkmode has-background-white' : 'g-cell'} py-0 ${isHeader ? 'g-header' : ''}`"
        :value="input"
        :disabled="isConsolidating"
        :type="!isHeader && (isLongText || isTimelineText) ? 'textarea' : 'text'"
        :rows="!isHeader && (isLongText || isTimelineText) ? 3 : false"
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

import { debounce } from '@/utils/globalUtils'

// import ButtonConsolidation from '@/components/edition/ButtonConsolidation.vue'
// import EditTagValue from '@/components/edition/EditTagValue.vue'

export default {
  name: 'EditCell',
  components: {
    // ButtonConsolidation,
    // EditTagValue
    ButtonOpenCard: () => import(/* webpackChunkName: "ButtonOpenCard" */ '@/components/previews/ButtonOpenCard.vue'),
    ButtonConsolidation: () => import(/* webpackChunkName: "ButtonConsolidation" */ '@/components/edition/ButtonConsolidation.vue'),
    EditTagValue: () => import(/* webpackChunkName: "EditTagValue" */ '@/components/edition/EditTagValue.vue')
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
    fromDialog: {
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
      inputBool: false,
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
      let newInput, newInputAsBool
      if (this.isHeader) {
        newInput = value
      } else {
        switch (this.fieldType) {
          case 'boolean':
            // console.log('\nC > EditCell > adaptInput > value : ', value)
            // console.log('C > EditCell > adaptInput > this.field.name : ', this.field.name)
            newInputAsBool = value === '' ? undefined : this.booleanFromValue(value, this.field)
            // console.log('C > EditCell > adaptInput > newInputAsBool : ', newInputAsBool)
            newInput = value
            this.inputBool = newInputAsBool
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
          // console.log('C > EditCell > adaptInput > this.field : ', this.field)
          // console.log('C > EditCell > adaptInput > this.tagsEnum : ', this.tagsEnum)
          // console.log('C > EditCell > adaptInput > this.tagsValue : ', this.tagsValue)

          // retrieve definition from field if any
          // const definition = this.getValueDefinitionLabel(value, this.field)
          // console.log('C > EditCell > adaptInput > definition : ', definition)

          // console.log('C > EditCell > adaptInput > this.tagsEnumEnriched : ', this.tagsEnumEnriched)

          // update newInput
          const valStr = value && value.toString()
          newInput = valStr && [valStr]

          // update tagsValue
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
      // this.$emit('action', payload)
      this.addFileSignal('addTagToEnum', payload)
    },
    emitChange: debounce(function (event) {
      console.log('\nC > EditCell > emitChange > event : ', event)
      console.log('C > EditCell > emitChange > event > debounce : ', event)
      this.emitChangeDebounced(event)
    }, 750),
    emitChangeDebounced (event) {
      console.log('\nC > EditCell > emitChangeDebounced > event : ', event)
      console.log('C > EditCell > emitChangeDebounced > this.tagsEnumEnriched : ', this.tagsEnumEnriched)
      console.log('C > EditCell > emitChangeDebounced > this.field : ', this.field)
      let value
      if (this.isTag && !this.isCategory) {
        value = event.filter(v => v !== '')
        value = value.map(v => {
          let val
          if (typeof v === 'object') {
            val = v.value
          } else {
            val = v
          }
          return val
        })
        value = event.length ? value.join(this.tagSeparator) : ''
      } else if (this.isBoolean) {
        this.inputBool = event
        value = event ? this.booleanOptions.true.value : this.booleanOptions.false.value
      } else {
        this.input = event
        value = this.isNumber ? event.toString() : event
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
      console.log('C > EditCell > emitChangeDebounced > payload : ', payload)

      // Update cell value using store git-data
      // this.$emit('updateCellValue', payload)
      if (this.fromDialog) {
        this.$emit('updateTempValue', payload)
      } else {
        this.addFileSignal('updateCellValue', payload)
      }

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
