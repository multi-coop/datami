<template>
  <div class="LoaderCSV container">
    <div class="columns is-mobile is-multiline mb-5 pb-4">
      <!-- FAKE EDIT NAVBAR -->
      <!-- FAKE SORTINGS -->
      <div class="column is-4 is-offset-1 pt-0">
        <b-skeleton
          position="is-centered"
          size="is-large"
          animated
          width="80%"/>
      </div>
      <!-- FAKE FILTERS -->
      <div class="column is-6 pt-0">
        <b-skeleton
          position="is-centered"
          size="is-large"
          animated
          width="75%"/>
      </div>
      <!-- FAKE TABLE -->
      <div class="column is-12 mt-4">
        <table class="table">
          <thead>
            <th
              v-for="col in columns"
              :key="`th-col-${col}`">
              <b-skeleton
                size="is-medium"
                :width="cellWidth"
                animated/>
            </th>
          </thead>
          <tbody>
            <tr
              v-for="row in rows"
              :key="`tr-row-${row}`">
              <td
                v-for="col in columns"
                :key="`tr-row-${row}-col-${col}`">
                <b-skeleton
                  size="is-small"
                  :width="cellWidth"
                  animated/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'LoaderCSV',
  data () {
    return {
      columns: 8,
      rows: 5,
      cellWidth: '120px'
    }
  }
}
</script>
