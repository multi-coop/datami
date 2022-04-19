<template>
  <div
    v-if="!onlyPreview"
    class="LoaderEditNavbar container">
    <!-- FAKE EDIT NAVBAR -->
    <div class="columns is-mobile mb-5 pb-4">
      <div class="column is-1">
        <b-skeleton
          position="is-centered"
          size="is-large"
          animated
          width="100%"/>
      </div>
      <div class="column is-2 is-offset-4">
        <b-skeleton
          position="is-centered"
          size="is-large"
          animated
          width="75%"/>
      </div>
      <div class="column is-3 is-offset-2">
        <b-skeleton
          size="is-large"
          animated
          width="100%"/>
      </div>
    </div>
    <hr class="mt-5 mb-6">
  </div>
</template>

<script>

export default {
  name: 'LoaderEditNavbar',
  props: {
    onlyPreview: {
      default: false,
      type: Boolean
    }
  }
}
</script>
