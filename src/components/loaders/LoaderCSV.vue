<template>
  <div class="SkeletonCSV container">
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
  name: 'SkeletonCSV',
  data () {
    return {
      columns: 5,
      rows: 3,
      cellWidth: '120px'
    }
  }
}
</script>
