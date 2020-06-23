<template>
	<v-calendar type="month" :start="date" :dark="dark" :weekdays="weekdays" @click:date="toDate" @click:event="openEvent" :events="events" :event-color="getColor"/>
</template>

<script>

	export default {
		name: 'Calendar',
		props: {
			events: Array,
			date: String,
			dark: Boolean,
			weekdays: Array
		},
		methods: {
			getColor(event) {
				return event.color
			},
			openEvent(e) {
				this.$emit('openEvent', e.event.key)
			},
			
			toDate: function (date) {
				this.$emit('changeDate', date.date)
			}
		},
		data: () => ({})
	}
</script>

<style scoped>
</style>
