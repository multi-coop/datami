<template>
  <div class="EditCell is-flex is-align-items-center">
    <b-icon
      class="mr-1"
      size="is-small"
      icon="pencil-outline"/>
    <b-field>
      <b-input
        :custom-class="`g-cell ${isHeader ? 'g-header' : ''}`"
        :value="input"
        size="is-small"
        expanded
        @input="emitChange"/>
    </b-field>
  </div>
</template>

<script>

export default {
  name: 'EditCell',
  props: {
    isHeader: {
      default: false,
      type: Boolean
    },
    colField: {
      default: null,
      type: String
    },
    inputData: {
      default: null,
      type: [String, Number]
    },
    rowIndex: {
      default: null,
      type: Number
    }
  },
  data () {
    return {
      input: undefined
    }
  },
  beforeMount () {
    this.input = this.inputData
  },
  methods: {
    emitChange (event) {
      // console.log('C > EditCell > emitChange > event : ', event)
      this.input = event
      const payload = {
        val: this.input,
        colField: this.colField
      }
      if (!this.isHeader) {
        payload.rowIndex = this.rowIndex
      } else {
        payload.isHeader = this.isHeader
      }
      // console.log('C > EditCell > emitChange > payload : ', payload)
      this.$emit('updateCellValue', payload)
    }
  }
}

</script>

<style>

.g-cell {
  background-color: transparent;
  border: none;
}
.g-header {
  font-size: .85em!important;
  font-weight: 600!important;
}
</style>
