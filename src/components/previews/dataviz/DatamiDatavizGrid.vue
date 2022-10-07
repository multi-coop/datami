<template>
  <div :class="`DatamiDatavizGrid datami-component ${ userFullscreen ? 'dataviz-scroll' : ''}`">
    <!-- DISPLAY CHARTS GRID -->
    <div
      class="columns is-multiline is-centered">
      <div
        v-for="(chart, idx) in datavizSettings.charts"
        :key="`${fileId}-chart-${idx}`"
        :class="`column mt-3 mb-6 is-${chart.cols || 6}`">
        <p :class=" `subtitle has-text-centered has-text-weight-bold ${isDarkMode ? 'has-text-white' : ''}` ">
          {{ chart.title[locale] }}
        </p>

        <div :style="`height: ${ chart.chartOptions.chart.height + 10}px`">
          <DatamiDataviz
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

import DatamiDataviz from '@/components/previews/dataviz/DatamiDataviz'

export default {
  name: 'DatamiDatavizGrid',
  components: {
    DatamiDataviz
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
  //   console.log('\nC > DatamiDataviz > beforeMount > this.datavizSettings : ', this.datavizSettings)
  //   console.log('C > DatamiDataviz > beforeMount > this.fields : ', this.fields)
  //   console.log('C > DatamiDataviz > beforeMount > this.fileOptions : ', this.fileOptions)
  // },
  methods: {
    computeSerie (chart) {
      // console.log('\nC > DatamiDataviz > computeSerie > chart : ', chart)
      // console.log('C > DatamiDataviz > beforeMount > this.fields : ', this.fields)
      const chartOptions = { ...chart.chartOptions }
      const chartType = chartOptions.chart.type
      let series = []
      // const labels = []

      const categoriesBy = chart.categoriesbyfield
      const categoriesField = this.fields.find(f => f.name === categoriesBy)
      const categoriesFieldIdx = categoriesField && categoriesField.field
      // console.log('C > DatamiDataviz > computeSerie > categoriesBy : ', categoriesBy)
      // console.log('C > DatamiDataviz > computeSerie > categoriesField : ', categoriesField)
      // console.log('C > DatamiDataviz > computeSerie > categoriesFieldIdx : ', categoriesFieldIdx)

      const aggregateBy = chart.aggregatebyfield
      const aggregationField = this.fields.find(f => f.name === aggregateBy)
      const aggregationFieldIdx = aggregationField && aggregationField.field
      // console.log('C > DatamiDataviz > computeSerie > aggregateBy : ', aggregateBy)
      // console.log('C > DatamiDataviz > computeSerie ( grouped or not ) > aggregationField : ', aggregationField)
      // console.log('C > DatamiDataviz > computeSerie > aggregationFieldIdx : ', aggregationFieldIdx)

      chartOptions.labels = aggregationField.enumArr
      // console.log('C > DatamiDataviz > beforeMount > this.chartOptions : ', this.chartOptions)

      // if (this.isDarkmode) {
      //   const tooltipConfig = { ...chartOptions.tooltip } || {}
      //   tooltipConfig.theme = 'dark'
      //   chartOptions.tooltip = tooltipConfig
      // }

      if (categoriesFieldIdx) {
        const grouped = this.groupByField(this.items, categoriesFieldIdx)
        // console.log('\nC > DatamiDataviz > computeSerie > grouped : ', grouped)
        // const labelsSet = new Set()
        series = grouped.map(g => {
          let serie = this.aggregateByField(g.items, aggregationFieldIdx, chart.aggregationtype)
          // console.log('\nC > DatamiDataviz > computeSerie (grouped) > g.name : ', g.name)
          // console.log('C > DatamiDataviz > computeSerie (grouped) > serie : ', serie)
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
        // console.log('\nC > DatamiDataviz > computeSerie (not grouped) > series : ', series)
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
