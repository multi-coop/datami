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

    <!-- DEBUGGING -->
    <div v-if="true">
      vizType: <code>{{ vizType }}</code><br>
      fieldsForSerie: <br><pre><code>{{ fieldsForSerie }}</code></pre><br>
      series: <br><code>{{ series }}</code><br>
      options: <br><pre><code>{{ options }}</code></pre><br>
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
          type: 'pie'
        },
        'simple-donut': {
          type: 'donut'
        },
        'big-value': {
          type: 'value'
        },
        'text-templated': {
          type: 'value'
        },
        'barchart-vertical': {
          type: 'bar'
        },
        'barchart-horizontal': {
          type: 'bar'
        }
      },
      // series: [44, 55, 13, 43, 22],
      series: undefined,
      options: undefined,
      chartOptionsDefault: {
        chart: {
          // type: 'pie',
          // width: 380
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
      }
    }
  },
  computed: {
    vizType () {
      return this.minivizSettings.viztype
    },
    fieldsForSerie () {
      const fieldsForSerie = this.minivizSettings.serieFromField && this.minivizSettings.serieFromField.map(ffs => {
        const field = this.fields.find(f => f.name === ffs.field)
        return field
      })
      return fieldsForSerie
    }
  },
  watch: {
    reRender () {
      this.updateRender()
    }
  },
  beforeMount () {
    this.buildSeries()
    this.buildOptions()
  },
  // mounted () {
  //   // this.reRender *= -1
  // },
  methods: {
    buildSeries () {
      // console.log('\nC-DatamiMiniviz > buildSeries > this.fieldsForSerie : ', this.fieldsForSerie)
      // console.log('C-DatamiMiniviz > buildSeries > this.item : ', this.item)
      // console.log('C-DatamiMiniviz > buildSeries > this.fieldsForSerie : ', this.fieldsForSerie)
      // const series = [44, 55, 13, 43, 22]
      const series = this.fieldsForSerie.map(f => parseInt(this.item[f.field]))
      this.series = series
    },
    buildLabels () {
      // const labels = ['Team A', 'Team B', 'Team C', 'Team D', 'Team E']
      const labels = this.fieldsForSerie.map(f => f.name)
      return labels
    },
    buildOptions () {
      const viztype = this.availableVizTypes[this.vizType]
      // console.log('\nC-DatamiMiniviz > buildOptions > viztype : ', viztype)
      const options = { ...this.chartOptionsDefault }
      options.chart.type = viztype.type
      options.labels = this.buildLabels()
      // console.log('C-DatamiMiniviz > buildOptions > options : ', options)
      this.options = options
    }
    // updateRender () {
    //   // console.log('\nC-DatamiMiniviz > updateRender > this.options : ', this.options)
    //   this.$refs[this.vizType].updateOptions({ ...this.options })
    // }
  }
}
</script>
