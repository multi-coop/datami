<template>
  <div class="LoaderSortFilters gitribute-component container">
    <div class="columns is-mobile is-multiline mb-3 mt-0">
      <!-- FAKE SORTINGS -->
      <div class="column is-4 is-offset-2 pt-2">
        <b-skeleton
          position="is-centered"
          size="is-large"
          animated
          width="75%"/>
      </div>
      <!-- FAKE FILTERS -->
      <div class="column is-4 pt-2">
        <b-skeleton
          position="is-centered"
          size="is-large"
          animated
          width="75%"/>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'LoaderSortFilters',
  data () {
    return {
      items: 6
    }
  }
}
</script>
