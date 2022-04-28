<template>
  <div class="LoaderWIKI container mb-6">
    <div class="columns is-centered is-mobile">
      <div class="column is-10">
        <p class="has-text-centered has-text-grey mb-4">
          <b-icon
            icon="autorenew"
            class="mr-3"
            size="is-small"
            style="animation: spinAround .5s infinite linear;"
            custom-class="fa-spin"/>
          {{ t('editWiki.loadingPages', locale) }}
          <br>
          <code>
            {{ gitObj.filefullname }}
          </code>
        </p>
        <b-progress
          :value="itemsProgress"
          size="is-medium"
          show-value>
          {{ itemsLoaded }} / {{ itemsTotal }}
          {{ t('editWiki.pages', locale) }}
        </b-progress>
      </div>
    </div>
  </div>
</template>

<script>

import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'LoaderWIKI',
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: null,
      type: String
    },
    itemsLoaded: {
      default: 0,
      type: Number
    },
    itemsTotal: {
      default: 0,
      type: Number
    },
    locale: {
      default: '',
      type: String
    }
  },
  computed: {
    itemsProgress () {
      return Math.round(100 * this.itemsLoaded / this.itemsTotal)
    }
  }
}
</script>
