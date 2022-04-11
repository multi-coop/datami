import Vue from 'vue'
import vueCustomElement from 'vue-custom-element'
import 'document-register-element/build/document-register-element'
import './registerServiceWorker'
import { store } from './store'

import Buefy from 'buefy'
import 'buefy/dist/buefy.min.css'
import '@mdi/font/css/materialdesignicons.min.css'

import '@creativebulma/bulma-divider/dist/bulma-divider.min.css'

// import { VueShowdown, VueShowdownPlugin } from 'vue-showdown'

import GitributeFile from './components/gitribute-file.vue'
import GitributeExploWiki from './components/gitribute-explowiki.vue'

Vue.config.productionTip = false

Vue.use(Buefy, {
  defaultIconPack: 'mdi'
})

GitributeFile.store = store
GitributeExploWiki.store = store

Vue.use(vueCustomElement, {
  shadow: true
})
Vue.customElement('multi-gitribute-file', GitributeFile)
Vue.customElement('multi-gitribute-explowiki', GitributeExploWiki)
