<template>
  <div :class="`DatamiDataviz datami-component ${isDarkMode ? 'datami-dataviz-darkmode' : ''}`">
    <!-- DISPLAY CHART -->
    <ApexChart
      :ref="chartId"
      :type="chartType"
      :options="chartData.chartOptions"
      :series="chartData.series"/>

    <!-- DEBUG -->
    <div
      v-if="debug"
      class="columns is-multiline">
      <div class="column is-12">
        chartType: <br><pre><code>{{ chartType }}</code></pre>
      </div>
      <div class="column is-6">
        chartData.chartOptions: <br><pre><code>{{ chartData.chartOptions }}</code></pre>
      </div>
      <div class="column is-6">
        chartData.series: <br><pre><code>{{ chartData.series }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'DatamiDataviz',
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: null,
      type: String
    },
    chartId: {
      default: null,
      type: String
    },
    chartType: {
      default: null,
      type: String
    },
    chartData: {
      default: null,
      type: Object
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
      reRender: 1
    }
  },
  watch: {
    // chartData (next) {
    //   console.log('\nC-DatamiDataviz > watch > chartData : ', next)
    // },
    reRender () {
      this.updateRender()
    },
    currentViewMode (next) {
      this.reRender *= -1
      // console.log('\nC-DatamiDataviz > watch > currentViewMode : ', next)
      // this.$refs[this.chartId].updateOptions({ ...this.chartData.chartOptions })
      // window.dispatchEvent(new Event('resize'))
    },
    handleTextColorApexCharts (next) {
      const apexChartsTexts = Array.from(document.querySelectorAll('.apexcharts-legend-text'))
      // console.log('apexChartsTexts', apexChartsTexts)
      apexChartsTexts.forEach(text => text.classList.add(`${this.isDarkMode ? 'datami-darkmode-white-text' : 'datami-darkmode-none'}`))
    }
  },
  mounted () {
    // console.log('\nC-DatamiDataviz > mounted ...')
    // console.log('C-DatamiDataviz > mounted > this.chartId: ', this.chartId)
    // console.log('C-DatamiDataviz > mounted > this.chartData: ', this.chartData)
    // window.dispatchEvent(new Event('resize'))
    const apexChartsTexts = Array.from(document.querySelectorAll('.apexcharts-legend-text'))
    // console.log('apexChartsTexts', apexChartsTexts)
    apexChartsTexts.forEach(text => text.classList.add(`${this.isDarkMode ? 'datami-darkmode-white-text' : 'datami-darkmode-none'}`))
    // this.$refs[this.chartId].render()
    this.reRender *= -1
  },
  methods: {
    updateRender () {
      // window.dispatchEvent(new Event('resize'))
      this.$refs[this.chartId].updateOptions({ ...this.chartData.chartOptions })
    }
  }
}

</script>
