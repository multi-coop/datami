import Vue from 'vue'
import vueCustomElement from 'vue-custom-element'
import 'document-register-element/build/document-register-element'
import './registerServiceWorker'
import { store } from './store'

import Buefy from 'buefy'
import 'buefy/dist/buefy.min.css'
import '@mdi/font/css/materialdesignicons.min.css'

// import { VueShowdown, VueShowdownPlugin } from 'vue-showdown'

import GitributeFile from './components/gitribute-file.vue'

Vue.config.productionTip = false

Vue.use(Buefy, {
  defaultIconPack: 'mdi'
})

GitributeFile.store = store

Vue.use(vueCustomElement, {
  shadow: true
})
Vue.customElement('multi-gitribute-file', GitributeFile)
