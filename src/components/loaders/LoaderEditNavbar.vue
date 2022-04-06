<template>
  <div class="LoaderEditNavbar container">
    <!-- FAKE EDIT NAVBAR -->
    <div class="columns is-mobile mb-5 pb-4">
      <div class="column is-6">
        <b-skeleton
          size="is-large"
          animated
          width="70%"/>
      </div>
      <div class="column is-3">
        <b-skeleton
          size="is-large"
          animated
          width="40%"/>
      </div>
      <div class="column is-3">
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
  name: 'LoaderEditNavbar'
}
</script>
