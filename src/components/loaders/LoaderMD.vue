<template>
  <div class="LoaderMD datami-component container">
    <!-- FAKE TITLE -->
    <h1 class="mb-4">
      <b-skeleton
        size="is-medium"
        animated
        width="40%"/>
    </h1>
    <p>
      <b-skeleton
        size="is-small"
        animated
        width="80%"/>
      <b-skeleton
        size="is-small"
        animated
        width="60%"/>
      <b-skeleton
        size="is-small"
        animated
        width="70%"/>
    </p>
    <p>
      <b-skeleton
        size="is-small"
        animated
        width="80%"/>
      <b-skeleton
        size="is-small"
        animated
        width="60%"/>
      <b-skeleton
        size="is-small"
        animated
        width="70%"/>
    </p>
    <p>
      <b-skeleton
        size="is-small"
        animated
        width="50%"/>
      <b-skeleton
        size="is-small"
        animated
        width="30%"/>
    </p>
  </div>
</template>

<script>

export default {
  name: 'LoaderMD'
}
</script>
