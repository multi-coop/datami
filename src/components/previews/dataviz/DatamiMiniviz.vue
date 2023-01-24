<template>
  <div
    :class="`content ${showDetail ? 'px-3 py-3' : ''}`"
    :style="`background-color: ${showDetail? 'white' : 'white'}`">
    <!-- MINIVIZ TITLE -->
    <h4>
      {{ minivizSettings.title[locale] }}
    </h4>

    <!-- SWITCH VIZ BY TYPE -->
    <div v-if="minivizSettings.viztype === 'simple-pie'">
      <ApexChart
        ref="simple-pie"
        type="pie"
        :options="options"
        :series="series"/>
    </div>
    <div v-if="minivizSettings.viztype === 'simple-donut'">
      <ApexChart
        ref="simple-donut"
        type="donut"
        :options="options"
        :series="series"/>
    </div>
    <div v-if="minivizSettings.viztype === 'barchart-vertical'">
      <ApexChart
        ref="barchart-vertical"
        type="bar"
        :options="options"
        :series="series"/>
    </div>
    <div v-if="minivizSettings.viztype === 'barchart-horizontal'">
      <ApexChart
        ref="barchart-horizontal"
        type="bar"
        :options="options"
        :series="series"/>
    </div>
    <div v-if="minivizSettings.viztype === 'big-values'">
      <span
        v-for="(val, i) in series"
        :key="`${val.field.field}-${i}`"
        class="mx-3">
        {{ val.field.name }}
        <span class="tag is-info is-large">
          {{ val.value }}
        </span>
      </span>
    </div>

    <!-- DEBUGGING -->
    <div v-if="true">
      <hr>
      vizType: <code>{{ vizType }}</code><br>
      <span v-if="vizSpecs.needSerie">series: <br><code>{{ series }}</code></span><br>
    </div>
    <div v-if="needsDebug">
      <span v-if="vizSpecs.needOptions">options: <br><pre><code>{{ options }}</code></pre></span><br>
      fieldsForSeries: <br><pre><code>{{ fieldsForSeries }}</code></pre><br>
      <!-- minivizSettings : <br><code>{{ minivizSettings }}</code> -->
    </div>
  </div>
</template>

<script>

export default {
  name: 'DatamiMiniviz',
  props: {
    fileId: {
      default: null,
      type: String
    },
    minivizSettings: {
      default: null,
      type: Object
    },
    item: {
      default: null,
      type: Object
    },
    fields: {
      default: null,
      type: Array
    },
    showDetail: {
      default: false,
      type: Boolean
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
  data () {
    return {
      // reRender: 1,
      availableVizTypes: {
        'simple-pie': {
          type: 'pie',
          needSerie: true,
          needOptions: true,
          needLabels: true
        },
        'simple-donut': {
          type: 'donut',
          needSerie: true,
          needOptions: true,
          needLabels: true
        },
        'barchart-vertical': {
          type: 'bar',
          needSerie: true,
          needOptions: true,
          needSerieData: true,
          needCategs: true,
          horiz: false
        },
        'barchart-horizontal': {
          type: 'bar',
          needSerie: true,
          needOptions: true,
          needSerieData: true,
          needCategs: true,
          horiz: true
        },
        'big-values': {
          needSerie: true,
          needFieldName: true
        },
        'text-templated': {
        }
      },
      series: undefined,
      options: undefined,
      chartOptionsDefault: {
        chart: {
          // type: 'pie',
          // width: 380
          toolbar: {
            show: false
          }
        },
        // labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        legend: {
          position: 'bottom'
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
      // Only for debugging
      vizTypeNeedsDebug: [
        // 'simple-pie',
        // 'simple-donut',
        // 'barchart-vertical',
        // 'barchart-horizontal',
        'big-values'
      ]
    }
  },
  computed: {
    vizType () {
      return this.minivizSettings.viztype
    },
    // only for debugging
    needsDebug () {
      return this.vizTypeNeedsDebug.includes(this.vizType)
    },
    vizSpecs () {
      return this.availableVizTypes[this.vizType]
    },
    fieldsForSeries () {
      // const fieldsForSeries = this.minivizSettings.seriesFromFields && this.minivizSettings.seriesFromFields.map(s => {
      //   const serieFields = {
      //     name: s.serieName[this.locale] || s.serieName.fr,
      //     fields: s.fields.map(sf => {
      //       return this.fields.find(f => f.name === sf.field)
      //     })
      //   }
      //   return serieFields
      // })
      // return fieldsForSeries
      const fieldsForSeries = this.minivizSettings.serieFromFields && this.minivizSettings.serieFromFields.map(sf => {
        return this.fields.find(f => f.name === sf.field)
      })
      return fieldsForSeries
    }
  },
  watch: {
    reRender () {
      this.updateRender()
    }
  },
  beforeMount () {
    if (this.vizSpecs.needSerie) {
      this.buildSerie()
    }
    if (this.vizSpecs.needOptions) {
      this.buildOptions()
    }
  },
  // mounted () {
  //   // this.reRender *= -1
  // },
  methods: {
    buildSerie () {
      this.needsDebug && console.log('\nC-DatamiMiniviz > buildSeries > this.fieldsForSeries : ', this.fieldsForSeries)
      this.needsDebug && console.log('C-DatamiMiniviz > buildSeries > this.vizType : ', this.vizType)
      // console.log('C-DatamiMiniviz > buildSeries > this.item : ', this.item)
      // const series = [44, 55, 13, 43, 22] // example 1
      // const series = { name: 'Serie name', data: [44, 55, 13, 43, 22] } // example 2
      let series = this.fieldsForSeries && this.fieldsForSeries.map(f => {
        return parseInt(this.item[f.field])
      })
      if (this.vizSpecs.needSerieData) {
        series = [{
          name: this.minivizSettings.serieName || '',
          data: series
        }]
      }
      if (this.vizSpecs.needFieldName) {
        series = this.fieldsForSeries.map((f, i) => {
          return {
            field: f,
            value: series[i]
          }
        })
      }
      this.needsDebug && console.log('C-DatamiMiniviz > buildSeries > series : ', series)
      this.series = series
    },
    buildLabels () {
      this.needsDebug && console.log('C-DatamiMiniviz > buildLabels > this.fieldsForSeries : ', this.fieldsForSeries)
      // const labels = ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'] // example
      const labels = this.fieldsForSeries && this.fieldsForSeries.map(f => {
        return f.name
      })
      this.needsDebug && console.log('C-DatamiMiniviz > buildSeries > labels : ', labels)
      return labels
    },
    buildCategs () {
      const categs = this.fieldsForSeries.map(s => {
        return s.name
      })
      return categs
    },
    buildOptions () {
      const options = { ...this.chartOptionsDefault }
      options.chart.type = this.vizSpecs.type
      if (this.vizSpecs.needLabels) {
        options.labels = this.buildLabels()
      }
      if (this.vizSpecs.type === 'bar') {
        options.plotOptions = {
          bar: { horizontal: this.vizSpecs.horiz }
        }
      }
      if (this.vizSpecs.needCategs) {
        options.xaxis = {
          categories: this.buildCategs(),
          tooltip: { enabled: false }
        }
      }
      this.needsDebug && console.log('C-DatamiMiniviz > buildOptions > options : ', options)
      this.options = options
    }
    // updateRender () {
    //   // console.log('\nC-DatamiMiniviz > updateRender > this.options : ', this.options)
    //   this.$refs[this.vizType].updateOptions({ ...this.options })
    // }
  }
}
</script>
