<template>
  <div class="EditCell is-flex is-align-items-center">
    <!-- <code>{{ inputData }}</code> -->
    <b-icon
      class="mr-1 ml-0"
      size="is-small"
      icon="pencil-outline"/>
    <b-field>
      <b-input
        :custom-class="`g-cell py-0 ${isHeader ? 'g-header' : ''}`"
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
    isAdded: {
      default: false,
      type: Boolean
    },
    rowId: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      input: undefined
    }
  },
  watch: {
    inputData (next) {
      this.input = this.inputData
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
        added: this.isAdded,
        colField: this.colField
      }
      if (!this.isHeader) {
        payload.id = this.rowId
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
  /* border: none; */
}
.g-header {
  font-size: .85em!important;
  font-weight: 600!important;
}
</style>
