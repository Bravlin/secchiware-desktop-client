import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import './plugins/Signatures'
import App from './App.vue'
import Signatures from './plugins/Signatures'

Vue.config.productionTip = false

Vue.use(Signatures)

new Vue({
    render: h => h(App),
}).$mount('#app')
