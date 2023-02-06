<template>
  <div
    :class="`content ${showDetail ? 'px-3' : 'mb-2'} ${showDetail && minivizSettings.viztype === 'big-values' ? 'pt-3 pb-0' : 'py-3'}`"
    :style="`height: 100%; background-color: ${showDetail? 'white' : 'white'}`">
    <!-- MINIVIZ TITLE -->
    <hr
      v-if="!showDetail"
      class="mt-0 mb-3">
    <h4
      v-if="minivizSettings.title"
      :class="`mb-2 ${minivizSettings.titleCustomClass} ${!showDetail ? 'has-text-centered' : ''}`">
      {{ minivizSettings.title[locale] }}
    </h4>

    <!-- SWITCH MINIVIZ BY TYPE -->
    <div
      :class="`miniviz-switcher ${vizSpecs.type || minivizSettings.viztype === 'big-values' ? 'is-flex is-align-items-center' : ''} ${minivizSettings.viztype === 'big-values' ? 'is-justify-content-center' : ''}`"
      :style="`${vizSpecs.type || minivizSettings.viztype === 'big-values' ? 'height: 90%;' : ''}`">
      <!-- APEX CHARTS -->
      <div
        v-if="minivizSettings.viztype === 'simple-pie'"
        style="width: 100%;">
        <ApexChart
          ref="simple-pie"
          type="pie"
          :options="options"
          :series="series"/>
      </div>
      <div
        v-if="minivizSettings.viztype === 'simple-donut'"
        style="width: 100%;">
        <ApexChart
          ref="simple-donut"
          type="donut"
          :options="options"
          :series="series"/>
      </div>
      <div
        v-if="minivizSettings.viztype === 'barchart-vertical'"
        style="width: 100%;">
        <ApexChart
          ref="barchart-vertical"
          type="bar"
          :options="options"
          :series="series"/>
      </div>
      <div
        v-if="minivizSettings.viztype === 'barchart-horizontal'"
        style="width: 100%;">
        <ApexChart
          ref="barchart-horizontal"
          type="bar"
          :options="options"
          :series="series"/>
      </div>

      <!-- BIG VALUES -->
      <div
        v-if="minivizSettings.viztype === 'big-values'"
        :class="`${showDetail ? 'pb-1' : 'mb-0'} ${minivizSettings.title ? 'pb-3' : 'pt-3'}`"
        style="width: 100%;">
        <div class="columns mb-0 is-multiline is-centered is-vcentered">
          <div
            v-for="(val, i) in series"
            :key="`${val.field.field}-${i}`"
            :class="`column ${series.length === 1 ? (showDetail ? 'is-6' : 'is-12') : (showDetail ? 'is-12-mobile is-6-tablet is-6-desktop is-4-widescreen' : 'is-6')} py-3 has-text-centered is-align-self-flex-end`">
            <p
              v-if="!val.field.noTitle"
              class="has-text-weight-semibold is-size-7">
              {{ val.field.title || val.field.label || val.field.name }}
            </p>
            <p
              class="notification has-text-weight-bold py-2 px-2"
              :style="`background-color: ${getBgColor(val.field)}; color: ${getColor(val.field)}`">
              {{ val.value || t('global.noValue', locale) }}
              <span
                v-if="val.value && val.field.unit"
                class="is-size-7 ml-3">
                {{ val.field.unit }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- TEMPLATED VALUES -->
      <div
        v-if="minivizSettings.viztype === 'text-templated'"
        class="mb-3">
        <p
          v-for="(paragraph, i) in getTemplatedValues(templating)"
          :key="`card-miniviz-${fileId}-${item.id}-templated-${i}`"
          :class="paragraph.customClass || 'mb-2'">
          {{ paragraph.text }}
        </p>
        <!-- DEBUGGING -->
        <div
          v-if="needsDebug"
          class="columns is-multiline">
          <div class="column is-12">
            getTemplatedValues(templating) : <br><code>{{ getTemplatedValues(templating) }}</code>
          </div>
          <div class="column is-6">
            minivizSettings.templates: <br><pre><code>{{ minivizSettings.templates }}</code></pre>
          </div>
          <div class="column is-6">
            fields: <br><pre><code>{{ fields }}</code></pre>
          </div>
        </div>
      </div>
    </div>

    <!-- DEBUGGING -->
    <div v-if="false && needsDebug">
      <hr>
      vizType: <code>{{ vizType }}</code><br>
      <span v-if="vizSpecs.needSerie">series: <br><code>{{ series }}</code></span><br>
      <!-- <span v-if="vizSpecs.needTemplating">fields: <br><pre><code>{{ fields }}</code></pre></span><br> -->
    </div>
    <div v-if="false && needsDebug">
      <span v-if="vizSpecs.needOptions">options: <br><pre><code>{{ options }}</code></pre></span><br>
      <!-- <span v-if="vizSpecs.needTemplating">minivizSettings.templates: <br><pre><code>{{ minivizSettings.templates }}</code></pre></span><br> -->
      <!-- <span v-if="vizSpecs.needOptions">paragraphs: <br><pre><code>{{ paragraphs }}</code></pre></span><br> -->
      <!-- minivizSettings : <br><code>{{ minivizSettings }}</code> -->
    </div>
  </div>
</template>

<script>

import { getContrastYIQ } from '@/utils/globalUtils.js'

import {
  mixinGlobal,
  mixinValue,
  mixinTexts
} from '@/utils/mixins.js'

export default {
  name: 'DatamiMiniviz',
  mixins: [
    mixinGlobal,
    mixinValue,
    mixinTexts
  ],
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
          needTemplating: true
        }
      },
      series: undefined,
      options: undefined,
      chartOptionsDefault: {
        chart: {
          // type: 'pie',
          // width: 380,
          // height: 400,
          toolbar: {
            show: false
          }
        },
        // labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        legend: {
          position: 'bottom'
        },
        responsive: [{
          breakpoint: 400,
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
        // 'text-templated'
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
    templating () {
      // const settings = this.minivizSettings
      const settingsTemplates = {
        templating: this.minivizSettings.templates
      }
      return settingsTemplates
    },
    fieldsForSeries () {
      const fieldsForSeries = this.minivizSettings.serieFromFields && this.minivizSettings.serieFromFields.map(sf => {
        const field = this.fields.find(f => f.name === sf.field)
        if (field) {
          if (sf.title) { field.title = sf.title[this.locale] || sf.title }
          if (sf.unit) { field.unit = sf.unit[this.locale] || sf.unit }
          if (sf.bgColor) { field.bgColor = sf.bgColor }
          if (sf.serieColor) { field.serieColor = sf.serieColor }
          if (sf.customLabel) { field.customLabel = sf.customLabel }
          if (sf.noTitle) { field.noTitle = sf.noTitle }
        }
        return field
      })
      return fieldsForSeries.filter(f => f && f.field)
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
    getContrastYIQ,
    buildSerie () {
      // this.needsDebug && console.log('\nC-DatamiMiniviz > buildSeries > this.fields : ', this.fields)
      // this.needsDebug && console.log('C-DatamiMiniviz > buildSeries > this.vizType : ', this.vizType)
      // this.needsDebug && console.log('C-DatamiMiniviz > buildSeries > this.fieldsForSeries : ', this.fieldsForSeries)
      // this.needsDebug && console.log('C-DatamiMiniviz > buildSeries > this.item : ', this.item)
      // const series = [44, 55, 13, 43, 22] // example 1
      // const series = { name: 'Serie name', data: [44, 55, 13, 43, 22] } // example 2
      let series = this.fieldsForSeries && this.fieldsForSeries.map(f => {
        let valTemp
        let value = this.item[f.field]
        const round = f.round
        switch (f.type) {
          case 'number':
            valTemp = parseFloat(value)
            value = round ? this.roundOff(valTemp, round.digits) : valTemp
            break
          case 'integer':
            value = parseInt(value)
            break
          case 'float':
            valTemp = parseFloat(value)
            value = round ? this.roundOff(valTemp, round.digits) : valTemp
            break
        }
        if (f.definitions) {
          const def = f.definitions.find(d => d.value === value)
          value = def ? def.label : value
        }
        return value
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
      // this.needsDebug && console.log('C-DatamiMiniviz > buildSeries > series : ', series)
      this.series = series
    },
    buildLabels () {
      // this.needsDebug && console.log('C-DatamiMiniviz > buildLabels > this.fieldsForSeries : ', this.fieldsForSeries)
      // const labels = ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'] // example
      const labels = this.fieldsForSeries && this.fieldsForSeries.map(f => {
        return f.customLabel || f.title || f.label || f.name
      })
      // this.needsDebug && console.log('C-DatamiMiniviz > buildSeries > labels : ', labels)
      return labels
    },
    buildLabelsColors () {
      const colors = this.fieldsForSeries && this.fieldsForSeries.map(f => {
        return f.serieColor
      })
      return colors
    },
    buildCategs () {
      const categs = this.fieldsForSeries.map(f => {
        return f.customLabel || f.title || f.name
      })
      return categs
    },
    buildOptions () {
      const options = { ...this.chartOptionsDefault }
      options.chart.type = this.vizSpecs.type
      // this.needsDebug && console.log('C-DatamiMiniviz > buildOptions > this.minivizSettings : ', this.minivizSettings)

      // default data labels
      options.dataLabels = {
        enabled: true,
        style: {
          colors: ['#111']
        },
        background: {
          enabled: true,
          foreColor: '#fff',
          borderWidth: 0
        }
      }
      // set labels
      if (this.vizSpecs.needLabels) {
        options.labels = this.buildLabels()
        options.colors = this.buildLabelsColors()
      }
      // specific to donut charts
      if (this.vizSpecs.type === 'donut') {
        if (this.minivizSettings.showTotal) {
          options.plotOptions = {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '12px',
                    fontWeight: 400,
                    offsetY: -2
                  },
                  value: {
                    fontSize: '12px',
                    fontWeight: 700,
                    offsetY: 2
                  },
                  total: {
                    show: true,
                    showAlways: true,
                    label: 'Total',
                    fontSize: '12px',
                    fontWeight: 400
                  }
                },
                size: '60%'
              }
            }
          }
        }
      }
      // specific to barcharts
      if (this.vizSpecs.type === 'bar') {
        options.chart.height = 400
        options.plotOptions = {
          bar: { horizontal: this.vizSpecs.horiz }
        }
        if (this.minivizSettings.serieColor) {
          options.colors = [this.minivizSettings.serieColor]
        }
        if (this.minivizSettings.distributed) {
          options.colors = this.buildLabelsColors()
          options.plotOptions.bar.distributed = true
        }
        if (this.minivizSettings.serieUnit) {
          options.dataLabels.formatter = (val) => {
            return `${val} ${this.minivizSettings.serieUnit}`
          }
          if (this.minivizSettings.viztype === 'barchart-horizontal') {
            options.dataLabels.offsetX = this.minivizSettings.offsetX || 15
          }
        }
      }
      if (this.vizSpecs.needCategs) {
        options.xaxis = {
          categories: this.buildCategs(),
          tooltip: { enabled: false }
        }
      }
      // this.needsDebug && console.log('C-DatamiMiniviz > buildOptions > options : ', options)
      this.options = options
    },
    getBgColor (field) {
      return field.bgColor || '#343434'
    },
    getColor (field) {
      const bgColor = this.getBgColor(field)
      return this.getContrastYIQ(bgColor)
    }
    // updateRender () {
    //   // console.log('\nC-DatamiMiniviz > updateRender > this.options : ', this.options)
    //   this.$refs[this.vizType].updateOptions({ ...this.options })
    // }
  }
}
</script>
