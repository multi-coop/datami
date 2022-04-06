<template>
  <div class="LoaderCSV container">
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
