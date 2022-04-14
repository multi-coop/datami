<template>
  <div class="ButtonDeleteRows">
    <b-tooltip
      :label="t(`editCsv.${getTootlipLabel}`, locale)"
      type="is-dark"
      position="is-left">
      <b-button
        size="is-small"
        class="ml-1"
        :disabled="!checkedRows.length"
        :icon-left="'trash-can'"
        @click="SendActionToParent"/>
    </b-tooltip>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonDeleteRows',
  mixins: [mixinGlobal],
  props: {
    checkedRows: {
      default: null,
      type: Array
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {}
  },
  computed: {
    getTootlipLabel () {
      let str
      const checkedRowsLength = this.checkedRows.length
      if (!checkedRowsLength) str = 'deleteARow'
      if (checkedRowsLength === 1) str = 'deleteRow'
      if (checkedRowsLength > 1) str = 'deleteRows'
      return str
    }
  },
  methods: {
    SendActionToParent () {
      const payload = {
        action: 'openDeleteRowsDialog',
        rows: this.checkedRows
      }
      this.$emit('action', payload)
    }
  }
}
</script>
