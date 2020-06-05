<template>
	<v-calendar type="day" :start="date" :dark="dark" :events="events" :event-color="getColor"/>
</template>

<script>
	import router from '../router'
	
	window.moment = require('moment')

	export default {
		name: 'Day',
		methods: {
			getColor(event) {
				return event.color
			}
		},
		props: {
			events: Array,
			date: String,
			dark: Boolean,
			weekdays: Array
		},
		data: () => ({
		
		}),

	}
</script>

<style scoped>
</style>
