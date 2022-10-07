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
// import { mapGetters } from 'vuex'
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
  // data () {
  //   return {
  //     options: undefined,
  //     series: undefined
  //   }
  // },
  // computed: {
  //   ...mapGetters({
  //     isDarkMode: 'git-storage/isDarkMode'
  //   })
  // },
  // computed: {
  //   handleTextColorApexCharts (next) {
  //     const apexChartsTexts = Array.from(document.querySelectorAll('.apexcharts-legend-text'))
  //     // apexChartsTexts.classList.add(`${this.isDarkMode ? 'datami-darkmode-white-text' : ''}`)
  //     // console.log('apexChartsTexts', apexChartsTexts)
  //     apexChartsTexts.forEach(text => text.classList.add(`${this.isDarkMode ? 'datami-darkmode-white-text' : 'datami-darkmode-none'}`))
  //     return null
  //   }
  // },
  watch: {
    currentViewMode (next) {
      // console.log('\nC-DatamiDataviz > watch > currentViewMode : ', next)
      this.$refs[this.chartId].updateOptions({ ...this.chartData.chartOptions })
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
    // console.log('\nC-DatamiDataviz > mounted > this.chartData: ', this.chartData)
    // window.dispatchEvent(new Event('resize'))
    const apexChartsTexts = Array.from(document.querySelectorAll('.apexcharts-legend-text'))
    // console.log('apexChartsTexts', apexChartsTexts)
    apexChartsTexts.forEach(text => text.classList.add(`${this.isDarkMode ? 'datami-darkmode-white-text' : 'datami-darkmode-none'}`))
  }
}

</script>

<style>
/* .datami-darkmode-white-text{
  color: white !important;
} */

.apexcharts-legend-text{
  background-color: white !important;
  padding: 1% !important;
}

.datami-dataviz-darkmode .apexcharts-tooltip {
  color: black !important;
}
</style>
