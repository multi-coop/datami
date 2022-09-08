import Vue from 'vue'
import vueCustomElement from 'vue-custom-element'
import 'document-register-element/build/document-register-element'
import './registerServiceWorker'
import { store } from './store'

import Buefy from 'buefy'
import 'buefy/dist/buefy.min.css'
import '@mdi/font/css/materialdesignicons.min.css'

import '@creativebulma/bulma-divider/dist/bulma-divider.min.css'

import VueApexCharts from 'vue-apexcharts'

// import { VueShowdown, VueShowdownPlugin } from 'vue-showdown'

import DatamiFile from './components/datami-file.vue'
import DatamiExploWiki from './components/datami-explowiki.vue'
import DatamiMultiFiles from './components/datami-multi-files.vue'

Vue.config.productionTip = false

Vue.use(Buefy, {
  defaultIconPack: 'mdi'
})

Vue.use(VueApexCharts)
Vue.component('ApexChart', VueApexCharts)

DatamiFile.store = store
DatamiExploWiki.store = store
DatamiMultiFiles.store = store

Vue.use(vueCustomElement, {
  shadow: true
})
Vue.customElement('datami-file', DatamiFile)
Vue.customElement('datami-explowiki', DatamiExploWiki)
Vue.customElement('datami-multi-files', DatamiMultiFiles)
