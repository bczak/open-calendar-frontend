<template>
	<v-app>
		<v-app-bar app elevation="0" :dark="dark" clipped-left>
			<v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
			<v-btn icon @click="add(-1)">
				<v-icon>mdi-arrow-left</v-icon>
			</v-btn>
			<v-btn outlined @click="changeView('month')">
				{{$t(`app.months[${Number(now.substr(5,2) -1)}]`)}}
			</v-btn>
			<v-btn icon @click="add(1)">
				<v-icon>mdi-arrow-right</v-icon>
			</v-btn>
			<v-spacer></v-spacer>
			
			<v-btn depressed :dark="dark" icon @click="today">
				<v-icon>mdi-calendar</v-icon>
			</v-btn>
			<v-menu v-model="menu">
				<template v-slot:activator="{ on }">
					<v-btn :dark="dark" v-on="on" depressed icon>
						<v-icon>{{ views[active] }}</v-icon>
					</v-btn>
				</template>
				<v-list>
					<v-list-item @click="changeView('day')">
						<v-list-item-title>{{ $t('app.menu.day') }}</v-list-item-title>
					</v-list-item>
					<v-list-item @click="changeView('week')">
						<v-list-item-title>{{ $t('app.menu.week') }}</v-list-item-title>
					</v-list-item>
					<v-list-item @click="changeView('month')">
						<v-list-item-title>{{ $t('app.menu.month') }}</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-app-bar>
		<v-navigation-drawer app v-model="drawer" clipped :dark="dark">
			<v-list-item>
				<v-list-item-content>
					<v-list-item-title class="title">
						{{calendar.title}}
					</v-list-item-title>
					<v-list-item-subtitle>
						{{user.mail}}
					</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>
			<v-divider></v-divider>
			<v-list dense nav>
				<v-list-item link>
					<v-list-item-icon>
						<v-icon>mdi-bell</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						{{$t('drawer.updates')}}
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-icon>
						<v-icon>mdi-magnify</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						{{$t('drawer.search')}}
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-icon>
						<v-icon>mdi-account-circle</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						{{$t('drawer.account')}}
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-icon>
						<v-icon>mdi-cog</v-icon>
					</v-list-item-icon>
					<v-list-item-content @click="showSettings">
						{{$t('drawer.settings')}}
					</v-list-item-content>
				</v-list-item>
			</v-list>
			<v-divider></v-divider>
			<v-list-item>
				<v-list-item-content>
					{{$t('app.dark')}}
				</v-list-item-content>
				<v-switch v-model="dark" inset color="primary"></v-switch>
			
			</v-list-item>
		</v-navigation-drawer>
		
		<v-content>
			<router-view
				:key="$route.fullPath"
				ref="calendar"
				:date="now"
				:dark="dark"
				:weekdays="weekdays"
				:events="events"
				v-on:changeDate="changeDate($event)"
			/>
			<NewDialog :active="dialog" v-on:close="dialog = false" :user="user"/>
			<Settings :active="settings_link" v-on:close="settings_link = false" :cal="calendar._id" :dark="dark"
			          v-on:update="updateCal()"/>
			<NewEvent v-on:update="updateCal()" v-on:close="new_event = false" :dark="dark" :active="new_event"
			          :cal="calendar._id"/>
			<v-btn fab icon class="help-icon" v-if="help" dark>
				<v-icon>mdi-help</v-icon>
			</v-btn>
			<v-btn fab icon class="plus-icon" dark @click="showNewEvent()">
				<v-icon>mdi-plus</v-icon>
			</v-btn>
		</v-content>
	</v-app>
</template>

<script>


	import router from './router'
	import NewDialog from './components/NewDialog'
	import NewEvent from './components/NewEvent'
	import Settings from './components/Settings'
	import {API} from "./conf";

	window.moment = require('moment-timezone')
	const data = {
		settings_link: false,
		new_event: false,
		user: {
			signed: false,
			mail: 'anonymous'
		},
		help: false,
		title: 'Open Calendar',
		dark: false, // theme
		drawer: false, // drawer
		menu: false, // menu view
		active: window.location.href.split('#/')[1].split('?')[0] || 'month',
		views: {
			month: 'mdi-view-module',
			week: 'mdi-view-carousel',
			day: 'mdi-view-agenda'
		},
		now: moment().format('YYYY-MM-DD'),
		weekdays: [1, 2, 3, 4, 5, 6, 0],
		calendar: {},
		dialog: true,
		events: []
	}

	export default {
		name: 'App',
		components: {NewDialog, NewEvent, Settings},
		data: () => (data),
		async mounted() {
			let user = await (await fetch(API + '/api/user')).json()
			if (user.user.mail !== 'anonymous') data.user = {...user.user, signed: true}
			const app = window.location.pathname.split(':')[1]
			if (app) {
				this.dialog = false;
				this.calendar = {_id: app}
				this.calendar = await (await fetch(API + '/api/calendar/' + app)).json()
				if (this.calendar.error) window.location = API + '/app'
				this.events = []
				for (let event of this.calendar.events) {
					this.events.push({
						name: event.title,
						color: event.color,
						start: this.formatDate(new Date(event.start), true),
						end: this.formatDate(new Date(event.end), true)
					})
				}
			}

			this.now = router.currentRoute.query.date || moment().format('YYYY-MM-DD')
		},
		methods: {
			formatDate(a, withTime) {
				return withTime
					? `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
					: `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`
			},
			showNewEvent: function () {
				this.new_event = true;
			},
			updateCal: async function (date) {
				const app = window.location.pathname.split(':')[1]
				if (app) {
					this.dialog = false;
					this.calendar = {_id: app}
					this.calendar = await (await fetch(API + '/api/calendar/' + app)).json()
					if (this.calendar.error) window.location = API + '/app'
					this.events = []
					for (let event of this.calendar.events) {
						this.events.push({
							name: event.title,
							color: event.color,
							start: this.formatDate(new Date(event.start), true),
							end: this.formatDate(new Date(event.end), true)
						})
					}
				} else {
					window.location = API + '/auth/mail/login'
				}
			},

			changeDate: function (date) {
				this.now = date
				this.changeView('day')
			},
			today: function () {
				this.now = moment().format('YYYY-MM-DD')
				if (router.currentRoute.fullPath !== '/' + this.active + '?date=' + this.now)
					router.push('/' + this.active + '?date=' + this.now)

			},
			add: function (num) {
				this.now = moment(this.now, 'YYYY-MM-DD').add(num, this.active[0] === 'm' ? this.active[0].toUpperCase() : this.active[0]).format('YYYY-MM-DD')
				if (router.currentRoute.fullPath !== '/' + this.active + '?date=' + this.now)
					router.push('/' + this.active + '?date=' + this.now)
			},
			showSettings: function () {
				this.settings_link = true
			},
			changeView: function (view) {
				this.active = view
				if (router.currentRoute.path.split('/')[1] !== view) {
					router.push(view + '?date=' + this.now)
				}
			}
		}
	}
</script>
<style>
	.v-calendar-daily_head-day > .v-calendar-daily_head-day-label > button {
		width: 36px;
		height: 36px;
	}
	
	.help-icon {
		background: #1e1e1e;
		position: fixed;
		top: 74px;
		left: 10px;
	}
	
	.plus-icon {
		position: fixed;
		bottom: 10px;
		right: 10px;
		background: black;
	}
	
	::-webkit-scrollbar {
		width: 0;
	}
	
	.v-toolbar__title {
		padding-right: 10px;
	}

</style>
