import Vue from 'vue'
import VueRouter from 'vue-router'
import Calendar from '../components/Calendar'
import Day from '../components/Day'
import Week from '../components/Week'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		alias: '/month',
		name: 'Calendar',
		component: Calendar
	},
	{
		path: '/day',
		name: 'Day',
		component: Day
	},
	{
		path: '/week',
		name: 'Week',
		component: Week
	}
]

const router = new VueRouter({
	routes
})

export default router
