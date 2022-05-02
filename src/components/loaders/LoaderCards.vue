<template>
  <div class="LoaderCards gitribute-component container">
    <div class="columns is-centered mb-5 pb-4">
      <div class="column is-10">
        <div class="columns is-multiline">
          <!-- FAKE CARDS GRID -->
          <div
            v-for="item in items"
            :key="`card-loader-${item}`"
            class="column is-4">
            <div class="card">
              <!-- FAKE HEADER -->
              <header class="card-header">
                <p class="card-header-title">
                  <b-skeleton
                    size="is-large"
                    animated
                    width="75%"/>
                </p>
              </header>
              <!-- FAKE CONTENT -->
              <div class="card-content">
                <div class="content">
                  <b-skeleton
                    v-for="line in contentLines"
                    :key="`card-loader-${item}-line-${line}`"
                    animated
                    :width="`${100 - (line*10)}%`"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'LoaderCards',
  data () {
    return {
      items: 6,
      contentLines: 5
    }
  }
}
</script>
