<template>
  <div :class="`DatamiDatavizGrid datami-component ${ userFullscreen ? 'dataviz-scroll' : ''}`">
    <!-- DISPLAY CHARTS GRID -->
    <div
      class="columns is-multiline is-centered">
      <div
        v-for="(chart, idx) in datavizSettings.charts.filter(chart => !chart.hide)"
        :key="`${fileId}-chart-${idx}`"
        :class="`column mt-3 mb-6 is-${chart.cols || 6}`">
        <p
          :class=" `subtitle has-text-centered has-text-weight-bold ${isDarkMode ? 'has-text-white' : ''}` ">
          {{ chart.title[locale] }}
        </p>

        <div
          :style="`height: ${ chart.chartOptions.chart.height + 10}px`">
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

// import DatamiDataviz from '@/components/previews/dataviz/DatamiDataviz'

export default {
  name: 'DatamiDatavizGrid',
  components: {
    // DatamiDataviz
    DatamiDataviz: () => import(/* webpackChunkName: "DatamiDataviz" */ '@/components/previews/dataviz/DatamiDataviz.vue')
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
  // data () {
  //   return {
  //     cssFiles: [
  //       'styles/components/previews/dataviz/datami-dataviz.css'
  //     ]
  //   }
  // },
  // beforeMount () {
  //   console.log('\nC > DatamiDatavizGrid > beforeMount > this.datavizSettings : ', this.datavizSettings)
  //   console.log('C > DatamiDatavizGrid > beforeMount > this.fields : ', this.fields)
  //   console.log('C > DatamiDatavizGrid > beforeMount > this.fileOptions : ', this.fileOptions)
  // },
  methods: {
    computeSerie (chart) {
      // console.log('\nC > DatamiDatavizGrid > computeSerie > chart : ', chart)
      // console.log('C > DatamiDatavizGrid > beforeMount > this.fields : ', this.fields)
      const chartOptions = { ...chart.chartOptions }
      const chartType = chartOptions.chart.type
      let series = []
      // const labels = []

      const categoriesBy = chart.categoriesbyfield
      const categoriesField = this.fields.find(f => f.name === categoriesBy)
      const categoriesFieldIdx = categoriesField && categoriesField.field
      // console.log('C > DatamiDatavizGrid > computeSerie > categoriesBy : ', categoriesBy)
      // console.log('C > DatamiDatavizGrid > computeSerie > categoriesField : ', categoriesField)
      // console.log('C > DatamiDatavizGrid > computeSerie > categoriesFieldIdx : ', categoriesFieldIdx)

      const aggregateBy = chart.aggregatebyfield
      const aggregationField = this.fields.find(f => f.name === aggregateBy)
      // const aggregationFieldIdx = aggregationField && aggregationField.field
      // console.log('C > DatamiDatavizGrid > computeSerie > aggregateBy : ', aggregateBy)
      // console.log('C > DatamiDatavizGrid > computeSerie ( grouped or not ) > aggregationField : ', aggregationField)
      // console.log('C > DatamiDatavizGrid > computeSerie > aggregationFieldIdx : ', aggregationFieldIdx)

      chartOptions.labels = aggregationField && aggregationField.enumArr
      // console.log('C > DatamiDatavizGrid > beforeMount > chartOptions : ', chartOptions)

      if (categoriesFieldIdx) {
        const grouped = this.groupByField(this.items, categoriesFieldIdx)
        // console.log('\nC > DatamiDatavizGrid > computeSerie > grouped : ', grouped)
        // const labelsSet = new Set()
        series = grouped.map(g => {
          let serie = this.aggregateByField(g.items, aggregationField, chart.aggregationtype)
          // console.log('\nC > DatamiDatavizGrid > computeSerie (grouped) > g.name : ', g.name)
          // console.log('C > DatamiDatavizGrid > computeSerie (grouped) > serie : ', serie)
          serie = {
            name: g.name,
            data: aggregationField && aggregationField.enumArr.map(k => {
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
            const seriesCopy = serie && serie.sort((a, b) => {
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
        const dataset = this.aggregateByField(this.items, aggregationField, chart.aggregationtype)
        // console.log('\nC > DatamiDatavizGrid > computeSerie (not grouped) > series : ', series)
        series = aggregationField && aggregationField.enumArr.map(k => {
          let data
          const obj = dataset.find(i => i.name === k) || { data: 0 }
          switch (chartType) {
            case 'treemap':
              data = {
                x: k,
                y: obj.data
              }
              break
            case 'bar':
              data = {
                name: k,
                data: [obj.data]
              }
              break
            default:
              data = obj.data
              break
          }
          return data
        })
        // treemap specific
        if (chartType === 'treemap') {
          const seriesCopy = series && series.sort((a, b) => {
            return b.y - a.y
          })
          series = [{ data: seriesCopy }]
        }
        // bar specific
        // if (chartType === 'bar') {
        // }
      }

      // console.log('C > DatamiDatavizGrid > computeSerie > series : ', series)
      return {
        chartOptions: chartOptions,
        series: series
      }
    }
  }
}

</script>
