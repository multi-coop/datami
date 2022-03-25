import Vue from 'vue'
import vueCustomElement from 'vue-custom-element'
import './registerServiceWorker'
import store from './store'

import GitributeFile from './components/edition/gitribute-file.vue'

Vue.config.productionTip = false

GitributeFile.store = store

Vue.use(vueCustomElement, {
  shadow: true
})
Vue.customElement('multi-gitribute-file', GitributeFile)
