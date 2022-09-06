<template>
  <div :class="`GitributeDatavizGrid gitribute-component ${ userFullscreen ? 'dataviz-scroll' : ''}`">
    <!-- DISPLAY CHARTS GRID -->
    <div
      class="columns is-multiline is-centered">
      <div
        v-for="(chart, idx) in datavizSettings.charts"
        :key="`${fileId}-chart-${idx}`"
        :class="`column mt-3 mb-6 is-${chart.cols || 6}`">
        <p class="subtitle has-text-centered has-text-weight-bold">
          {{ chart.title[locale] }}
        </p>

        <div :style="`height: ${ chart.chartOptions.chart.height + 10}px`">
          <GitributeDataviz
            :file-id="fileId"
            :chart-id="`g-dataviz-${fileId}-${idx}`"
            :chart-type="chart.chartOptions.chart.type"
            :chart-data="computeSerie(chart)"
            :locale="locale"/>
        </div>
      </div>
    </div>

    <!-- DEBUG -->
    <div
      v-if="debug"
      class="columns is-multiline">
      <div class="column is-4">
        datavizSettings: <br><pre><code>{{ datavizSettings }}</code></pre>
      </div>
      <div class="column is-4">
        fields: <br><pre><code>{{ fields }}</code></pre>
      </div>
      <div class="column is-4">
        items: <br><pre><code>{{ items }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script>

import { mixinGlobal, mixinDataviz } from '@/utils/mixins.js'

import GitributeDataviz from '@/components/previews/dataviz/GitributeDataviz'

export default {
  name: 'GitributeDatavizGrid',
  components: {
    GitributeDataviz
  },
  mixins: [
    mixinGlobal,
    mixinDataviz
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    datavizSettings: {
      default: undefined,
      type: Object
    },
    items: {
      default: null,
      type: Array
    },
    fields: {
      default: null,
      type: Array
    },
    locale: {
      default: '',
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  // beforeMount () {
  //   console.log('\nC > GitributeDataviz > beforeMount > this.datavizSettings : ', this.datavizSettings)
  //   console.log('C > GitributeDataviz > beforeMount > this.fields : ', this.fields)
  //   console.log('C > GitributeDataviz > beforeMount > this.fileOptions : ', this.fileOptions)
  // },
  methods: {
    computeSerie (chart) {
      const chartOptions = { ...chart.chartOptions }
      const chartType = chartOptions.chart.type
      let series = []
      // const labels = []

      const categoriesBy = chart.categoriesbyfield
      const categoriesField = this.fields.find(f => f.name === categoriesBy)
      const categoriesFieldIdx = categoriesField && categoriesField.field
      // console.log('\nC > GitributeDataviz > computeSerie > categoriesBy : ', categoriesBy)
      // console.log('C > GitributeDataviz > computeSerie > categoriesField : ', categoriesField)
      // console.log('C > GitributeDataviz > computeSerie > categoriesFieldIdx : ', categoriesFieldIdx)

      const aggregateBy = chart.aggregatebyfield
      const aggregationField = this.fields.find(f => f.name === aggregateBy)
      const aggregationFieldIdx = aggregationField && aggregationField.field
      // console.log('C > GitributeDataviz > computeSerie > aggregateBy : ', aggregateBy)
      // console.log('C > GitributeDataviz > computeSerie ( grouped or not ) > aggregationField : ', aggregationField)
      // console.log('C > GitributeDataviz > computeSerie > aggregationFieldIdx : ', aggregationFieldIdx)

      chartOptions.labels = aggregationField.enumArr

      if (categoriesFieldIdx) {
        const grouped = this.groupByField(this.items, categoriesFieldIdx)
        // console.log('\nC > GitributeDataviz > computeSerie > grouped : ', grouped)
        // const labelsSet = new Set()
        series = grouped.map(g => {
          let serie = this.aggregateByField(g.items, aggregationFieldIdx, chart.aggregationtype)
          // console.log('\nC > GitributeDataviz > computeSerie (grouped) > g.name : ', g.name)
          // console.log('C > GitributeDataviz > computeSerie (grouped) > serie : ', serie)
          serie = {
            name: g.name,
            data: aggregationField.enumArr.map(k => {
              const obj = serie.find(i => i.name === k) || { data: 0 }
              if (chartType === 'treemap') {
                return {
                  x: k,
                  y: obj.data
                }
              } else {
                return obj.data
              }
            })
          }
          if (chartType === 'treemap') {
            const seriesCopy = serie.sort((a, b) => {
              return b.y - a.y
            })
            serie = {
              name: g.name,
              data: seriesCopy
            }
          }
          return serie
        })
      } else {
        const dataset = this.aggregateByField(this.items, aggregationFieldIdx, chart.aggregationtype)
        // console.log('\nC > GitributeDataviz > computeSerie (not grouped) > series : ', series)
        series = aggregationField.enumArr.map(k => {
          let data
          const obj = dataset.find(i => i.name === k) || { data: 0 }
          if (chartType === 'treemap') {
            data = {
              x: k,
              y: obj.data
            }
          } else {
            data = obj.data
          }
          return data
        })
        if (chartType === 'treemap') {
          const seriesCopy = series.sort((a, b) => {
            return b.y - a.y
          })
          series = [{ data: seriesCopy }]
        }
      }

      return {
        chartOptions: chartOptions,
        series: series
      }
    }
    // SendActionToParent (event) {
    //   this.$emit('action', event)
    // }
  }
}

</script>

<style scoped>

.dataviz-scroll {
  overflow-y: auto;
  height: 100%;
}

</style>
