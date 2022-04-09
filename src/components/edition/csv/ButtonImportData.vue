<template>
  <div class="ButtonImportData">
    <b-tooltip
      :label="t(`editCsv.importData`, locale)"
      type="is-dark"
      position="is-right">
      <b-button
        size="is-small"
        class="ml-1"
        :icon-left="'upload'"
        @click="SendActionToParent"/>
    </b-tooltip>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ButtonImportData',
  mixins: [],
  props: {
    headers: {
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
    ...mapGetters({
      t: 'git-translations/getTranslation'
    })
  },
  methods: {
    SendActionToParent () {
      // console.log('\nC > ButtonImportData > SendActions > this.headers : ', this.headers)
      const payload = {
        action: 'importData'
      }
      this.$emit('action', payload)
    }
  }
}
</script>
