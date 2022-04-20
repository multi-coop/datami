<template>
  <div class="LoaderEditNavbar container">
    <!-- FAKE EDIT NAVBAR -->
    <!-- {{ fileOptions }} -->
    <!-- hasCardsView : <code>{{ hasCardsView }}</code><br> -->
    <!-- hasCardsDetail : <code>{{ hasCardsDetail }}</code><br> -->
    <div class="columns is-mobile mb-5 pb-4">
      <div
        v-if="!onlyPreview"
        class="column is-1 fake-import">
        <b-skeleton
          position="is-centered"
          size="is-large"
          animated
          width="100%"/>
      </div>
      <div
        :class="`column is-4 is-offset-${onlyPreview ? '4' : '3'}`">
        <div class="columns is-centered">
          <div
            v-if="!onlyPreview"
            :class="`column is-${hasCardsView ? '7' : '8'} fake-edit`">
            <b-skeleton
              class="my-0"
              :position="hasCardsView ? 'is-right' : 'is-centered'"
              size="is-large"
              animated
              width="75%"/>
          </div>
          <div
            v-if="hasCardsView"
            :class="`column is-${onlyPreview ? '6' : '5'} fake-views`">
            <b-skeleton
              :position="onlyPreview ? 'is-centered' : ''"
              size="is-large"
              animated
              :width="`50%`"/>
          </div>
        </div>
      </div>
      <div
        v-if="!onlyPreview"
        class="column is-3 is-offset-1 fake-save">
        <b-skeleton
          size="is-large"
          animated
          width="100%"/>
      </div>
    </div>
    <hr
      v-if="!onlyPreview"
      class="mt-5 mb-6">
  </div>
</template>

<script>

import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'LoaderEditNavbar',
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: null,
      type: String
    },
    onlyPreview: {
      default: false,
      type: Boolean
    }
  }
}
</script>
