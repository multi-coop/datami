<template>
  <div
    type="is-dark">
    <b-field
      expanded
      type="is-dark">
      <b-input
        v-model="searchValue"
        :placeholder="`${t('actions.search', locale)}...`"
        icon="magnify"
        :class="`${isDarkMode ? 'has-text-white white' : ''}`"
        :icon-right="`${searchValue ? 'close-thick' : ''}`"
        icon-right-clickable
        @icon-right-click="clearInput"
        @input="emitChange"/>
    </b-field>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

import { debounce } from '@/utils/globalUtils'

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
      searchValue: ''
    }
  },
  methods: {
    clearInput () {
      this.searchValue = ''
      this.SendActionToParent()
    },
    emitChange: debounce(function (event) {
      // console.log('\nC > SearchFullText > emitChange > event : ', event)
      // console.log('C > SearchFullText > emitChange > event > debounce : ', event)
      this.SendActionToParent(event)
    }, 750),
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

      // track with matomo
      this.trackEvent(this.searchValue)
    }
  }
}
</script>

<style>
  /* .gitribute-darkmode-grey-background{
    background-color: rgb(151, 151, 150) !important;
  }
  .white{
    color: white !important;
  } */
</style>
