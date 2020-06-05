<template>
	<v-calendar type="week" :weekdays="weekdays" :start="date" :dark="dark" @click:date="toDate" :events="events" :event-color="getColor"/>
</template>

<script>
	window.moment = require('moment')
	export default {
		name: 'Week',
		props: {
			date: String,
			dark: Boolean,
			weekdays: Array,
			events: Array,
		},
		data: () => ({
		}),
		methods: {
			getColor(event) {
				return event.color
			},
			toDate: function (date) {
				this.$emit('changeDate', date.date)
			}
		}
	}
</script>

<style scoped>

</style>
