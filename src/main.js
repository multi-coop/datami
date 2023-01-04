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
import { storage } from '@/store/storage.js'
import { dialogs } from '@/store/dialogs.js'
import { signals } from '@/store/signals.js'

// import buefy from '@/plugins/buefy.js'
import Buefy from 'buefy'
// import 'buefy/dist/buefy.min.css'
// import '@mdi/font/css/materialdesignicons.min.css'

// import 'bulma-timeline/dist/css/bulma-timeline.min.css'
// import '@creativebulma/bulma-divider/dist/bulma-divider.min.css'

import VueApexCharts from 'vue-apexcharts'

// import { VueShowdown, VueShowdownPlugin } from 'vue-showdown'

import DatamiFile from './components/datami-file.vue'
import DatamiExploWiki from './components/datami-explowiki.vue'
import DatamiMultiFiles from './components/datami-multi-files.vue'

Vue.config.productionTip = false

// install CSS framework - Buefy
// console.log('MAIN > config Vue + Buefy > Buefy : ', Buefy)
Vue.use(Buefy, {
  defaultIconPack: 'mdi'
})
// console.log('MAIN > config Vue + Buefy > Vue : ', Vue)

// install ApexCharts
Vue.use(VueApexCharts)
Vue.component('ApexChart', VueApexCharts)

// install Vuex (store)
Vue.use(Vuex)

const store = new Vuex.Store({
  ...defaultStore,
  modules: {
    'git-translations': translations,
    'git-user': user,
    'git-filters': filters,
    'git-sortings': sortings,
    'git-data': data,
    'git-storage': storage,
    'git-dialogs': dialogs,
    'git-signals': signals
  }
})
DatamiFile.store = store
DatamiExploWiki.store = store
DatamiMultiFiles.store = store

// install web component
Vue.use(vueCustomElement)

// const options = { }
const options = {
  // shadow: true,
  // beforeCreateVueInstance (root) {
  //   const rootNode = root.el.getRootNode()
  //   if (rootNode instanceof ShadowRoot) {
  //     root.shadowRoot = rootNode
  //   } else {
  //     root.shadowRoot = document.head
  //   }
  //   return root
  // }
}
// DatamiFile.buefy = buefy
// DatamiExploWiki.buefy = buefy
// DatamiMultiFiles.buefy = buefy

Vue.customElement('datami-file', DatamiFile, options)
Vue.customElement('datami-explowiki', DatamiExploWiki, options)
Vue.customElement('datami-multi-files', DatamiMultiFiles, options)

Vue.customElement('gitribute-file', DatamiFile, options)
Vue.customElement('gitribute-explowiki', DatamiExploWiki, options)
Vue.customElement('gitribute-multi-files', DatamiMultiFiles, options)

Vue.customElement('multi-gitribute-file', DatamiFile, options)
Vue.customElement('multi-gitribute-explowiki', DatamiExploWiki, options)
Vue.customElement('multi-gitribute-multi-files', DatamiMultiFiles, options)
