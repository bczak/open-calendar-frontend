import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueI18n from 'vue-i18n'
import * as LangEn from './locales/en'
import * as LangCz from './locales/cz'

Vue.use(require('vue-moment'))
Vue.use(VueI18n)
const messages = {
	en: LangEn,
	cz: LangCz

}


const i18n = new VueI18n({
	locale: 'en',
	messages
})
const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.';
Vue.config.warnHandler = function (msg, vm, trace) {
	// `trace` is the component hierarchy trace
	if (msg === ignoreWarnMessage) {
		msg = null;
		vm = null;
		trace = null;
	}
}
window.App = new Vue({
	i18n,
	router,
	vuetify,
	render: h => h(App)
}).$mount('#app')

