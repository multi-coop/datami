import Vue from 'vue'
import Vuex from 'vuex'
import vueCustomElement from 'vue-custom-element'
import 'document-register-element/build/document-register-element'
import './registerServiceWorker'

// import { store } from './store'
import { defaultStore } from './store'
import { user } from '@/store/user.js'
import { data } from '@/store/data.js'
import { filters } from '@/store/filters.js'
import { sortings } from '@/store/sortings.js'
import { translations } from '@/store/translations.js'

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

Vue.use(Vuex)

const store = new Vuex.Store({
  ...defaultStore,
  modules: {
    'git-translations': translations,
    'git-user': user,
    'git-filters': filters,
    'git-sortings': sortings,
    'git-data': data
  }
})
DatamiFile.store = store
DatamiExploWiki.store = store
DatamiMultiFiles.store = store

Vue.use(vueCustomElement, {
  shadow: true
})
Vue.customElement('datami-file', DatamiFile)
Vue.customElement('datami-explowiki', DatamiExploWiki)
Vue.customElement('datami-multi-files', DatamiMultiFiles)

Vue.customElement('gitribute-file', DatamiFile)
Vue.customElement('gitribute-explowiki', DatamiExploWiki)
Vue.customElement('gitribute-multi-files', DatamiMultiFiles)

Vue.customElement('multi-gitribute-file', DatamiFile)
Vue.customElement('multi-gitribute-explowiki', DatamiExploWiki)
Vue.customElement('multi-gitribute-multi-files', DatamiMultiFiles)
