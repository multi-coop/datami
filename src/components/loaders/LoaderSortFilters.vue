<template>
  <div class="LoaderSortFilters datami-component container">
    <div class="columns is-mobile is-multiline mx-0 mb-3 mt-0">
      <!-- FAKE SORTINGS -->
      <div class="column px-0 is-3 pt-2">
        <b-skeleton
          position="is-left"
          size="is-large"
          animated
          width="75%"/>
      </div>
      <!-- FAKE FILTERS -->
      <div class="column px-0 is-3 is-offset-6 pt-2">
        <b-skeleton
          position="is-right"
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
