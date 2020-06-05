import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
	theme: {
		themes: {
			light: {
				primary: '#009688',
				secondary: '#673ab7',
				accent: '#795548',
				error: '#f44336',
				warning: '#ffc107',
				info: '#607d8b',
				success: '#4caf50'
			},
			dark: {
				primary: '#1976D2',
				secondary: '#424242',
				accent: '#82B1FF',
				error: '#FF5252',
				info: '#2196F3',
				success: '#4CAF50',
				warning: '#FFC107',
			}
		}
	}
})
