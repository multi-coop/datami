<template>
  <div class="DatamiDataviz datami-component">
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
  // data () {
  //   return {
  //     options: undefined,
  //     series: undefined
  //   }
  // },
  watch: {
    currentViewMode (next) {
      // console.log('\nC-DatamiDataviz > watch > currentViewMode : ', next)
      this.$refs[this.chartId].updateOptions({ ...this.chartData.chartOptions })
      // window.dispatchEvent(new Event('resize'))
    }
  },
  mounted () {
    // console.log('\nC-DatamiDataviz > mounted ...')
    // console.log('\nC-DatamiDataviz > mounted > this.chartData: ', this.chartData)
    // window.dispatchEvent(new Event('resize'))
  }
}

</script>
