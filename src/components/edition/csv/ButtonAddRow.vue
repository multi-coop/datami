<template>
  <div class="ButtonAddRow">
    <b-tooltip
      :label="t(`editCsv.addRow`, locale)"
      type="is-dark"
      position="is-right">
      <b-button
        size="is-small"
        class="ml-1"
        :icon-left="'plus'"
        @click="SendActionToParent"/>
    </b-tooltip>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ButtonAddRow',
  mixins: [],
  props: {
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation'
    })
  },
  methods: {
    SendActionToParent () {
      // console.log('\nC > ButtonAddRow > SendActions > this.headers : ', this.headers)
      const payload = {
        action: 'openAddRowDialog'
      }
      this.$emit('action', payload)
    }
  }
}
</script>
