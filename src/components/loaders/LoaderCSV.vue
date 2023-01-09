<template>
  <div class="LoaderCSV datami-component">
    <div class="columns is-mobile is-multiline mx-0 mb-5 pb-4">
      <!-- FAKE TABLE -->
      <div
        class="column is-12 px-0 mt-2"
        style="overflow: hidden;">
        <table :class="`table ${isDarkMode ? 'datami-darkmode-loader-background' : ''}`">
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
import { mapGetters } from 'vuex'

export default {
  name: 'LoaderCSV',
  data () {
    return {
      columns: 6,
      rows: 5,
      cellWidth: '120px'
    }
  },
  computed: {
    ...mapGetters({
      isDarkMode: 'git-storage/isDarkMode'
    })
  }
}
</script>
