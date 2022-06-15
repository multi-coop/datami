<template>
  <div class="SearchFullText">
    <b-field
      type="is-dark">
      <b-input
        v-model="searchValue"
        :placeholder="`${t('actions.search', locale)}...`"
        type="search"
        icon="magnify"
        expanded
        @input="SendActionToParent"/>
    </b-field>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

// import { debounce } from '@/utils/globalUtils'

export default {
  name: 'SearchFullText',
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: undefined,
      type: String
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {
      searchValue: undefined
    }
  },
  methods: {
    SendActionToParent () {
      // console.log('\nC > SearchFullText > SendActionToParent > ... : ')
      const filterPayload = {
        value: this.searchValue,
        reset: this.searchValue === ''
      }
      const payload = {
        action: 'searchText',
        value: filterPayload
      }
      this.$emit('action', payload)
    }
  }
}
</script>
