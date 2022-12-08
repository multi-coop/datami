<template>
  <div>
    <div
      v-if="getPosition('main_title')"
      :class="`${getFieldClass('main_title')} has-text-dark has-text-centered`"
      style="padding-bottom:.5em;"
      v-html="getFieldValue('main_title')"/>

    <h3
      v-if="getPosition('title') || getPosition('title_post')"
      :class="`has-text-dark has-text-centered`">
      <span
        v-if="getPosition('title')"
        :class="`${getFieldClass('title')}`"
        v-html="getFieldValue('title')"/>
      <span
        v-if="getPosition('title_post')"
        :class="`${getFieldClass('title_post')}`"
        v-html="getFieldValue('title_post')"/>
    </h3>

    <p
      v-if="getPosition('value')"
      :class="`${getFieldClass('value')}`"
      v-html="getFieldValue('value')"/>

    <p
      v-if="getPosition('info')"
      :class="`${getFieldClass('info')}`"
      v-html="getFieldValue('info')"/>
  </div>
</template>

<script>
import Vue from 'vue'

import { mixinGlobal } from '@/utils/mixins.js'

export default Vue.extend({
  name: 'DatamiMapPopup',
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: null,
      type: String
    },
    mapId: {
      default: null,
      type: String
    },
    feature: {
      required: true,
      type: Object
    },
    item: {
      required: true,
      type: Object
    },
    config: {
      required: true,
      type: Array
    },
    locale: {
      default: '',
      type: String
    }
  },

  methods: {
    getPosition (position) {
      const posConfig = this.config.find(i => i.position === position)
      return posConfig
    },
    getFieldClass (position) {
      const posConfig = this.getPosition(position)
      return posConfig.class
    },
    getFieldValue (position) {
      // console.log('\nC-DatamiMapPopup > getFieldValue > this.config : ', this.config)
      // console.log('C-DatamiMapPopup > getFieldValue > this.item : ', this.item)
      // console.log('C-DatamiMapPopup > getFieldValue > position : ', position)

      const posConfig = this.getPosition(position)
      // console.log('C-DatamiMapPopup > getFieldValue > posConfig : ', posConfig)

      let prop = posConfig && this.item[posConfig.field]

      if (typeof prop === 'undefined') { prop = '' }

      if (posConfig && posConfig.prefix) {
        prop = posConfig.prefix + prop
      }

      if (posConfig && posConfig.suffix) {
        prop = prop + posConfig.suffix
      }
      return prop
    }
    // popupClicked() {
    //   alert('Learn more clicked')
    // },
  }
})
</script>
