<template>
	<v-dialog v-model="active" v-if="active" persistent max-width="500">
		<v-card>
			<v-card-title class="headline">Create New Calendar</v-card-title>
			<v-card-subtitle>Create and share your events or reminders</v-card-subtitle>
			<v-card-text>
				<v-label>Information</v-label>
				<v-row>
					<v-col>
						<v-text-field
							label="Title"
							placeholder="Choose a title for your new calendar"
							outlined
							v-model="calendar_title"
							prepend-icon="mdi-calendar-today"
						/>
						<v-select
							v-model="calendar_tz"
							:items="zones"
							menu-props="auto"
							label="Time Zone"
							outlined
							prepend-icon="mdi-clock-outline"
						/>
						<v-select
							v-model="calendar_type"
							:items="['Public', 'Private']"
							menu-props="auto"
							label="Type"
							outlined
							v-bind:prepend-icon="calendar_type === 'Private' ? 'mdi-lock' : 'mdi-earth'"
						/>
						<v-alert type="error" v-if="calendar_type === 'Private' && !user.signed">
							Only registered users can create private calendars
						</v-alert>
						<v-alert type="error" v-if="error.length > 0">
							{{error}}
						</v-alert>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-btn color="green darken-1" text @click="join" v-if="!user.signed">Sign In</v-btn>
				<v-spacer></v-spacer>
				<v-btn color="green darken-1" text @click="create" :loading="submit"
				       :disabled="calendar_type === 'Private' && !user.signed">Create
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>

</template>

<script>
	import router from '../router'
	import {API} from "../conf";

	export default {
		props: {
			active: Boolean,
			user: Object
		},
		data: () => ({
			error: '',
			valid: false,
			password: '',
			calendar_type: 'Public',
			show: false,
			submit: false,
			calendar_title: 'Open Calendar',
			calendar_tz: '',
			zones: ['UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:30', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:30', 'UTC-04:00', 'UTC-03:30', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+03:30', 'UTC+04:00', 'UTC+04:30', 'UTC+05:00', 'UTC+05:30', 'UTC+05:45', 'UTC+06:00', 'UTC+06:30', 'UTC+07:00', 'UTC+08:00', 'UTC+08:45', 'UTC+09:00', 'UTC+09:30', 'UTC+10:00', 'UTC+10:30', 'UTC+11:00', 'UTC+11:30', 'UTC+12:00', 'UTC+12:45', 'UTC+13:00', 'UTC+14:00']
		}),
		mounted() {
			if (router.currentRoute.path !== '/') router.push('/')
			let str = new Date().toTimeString().split(' ')[1]
			str = str.substr(str.length - 4)
			for (let zone of this.zones) {
				if (zone.substr(zone.length - 5).replace(':', '') === str) this.calendar_tz = zone
			}

		},
		methods: {
			apiCreateCalendar: async function (cal) {
				let request = {
					title: this.calendar_title,
					timezone: this.calendar_tz,
					type: this.calendar_type === 'Public'
				}
				let result;
				result = await fetch(API + '/api/calendar', {
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(request)
					}
				)
				result = await result.json();
				console.log(result)
				if (result.error) {
					this.error = result.error;
					this.submit = false;
				} else {
					window.location = API + '/app:' + result._id
				}
			},
			create: function () {
				this.error = '';
				const calendar = {
					type: this.calendar_type,
					title: this.calendar_title,
					zone: this.calendar_tz
				}
				this.submit = true
				this.apiCreateCalendar(calendar)
			},
			join: function () {
				window.location = API + '/auth/mail/login'
			},
			close: function () {
				this.$emit('close')
			}
		},
		name: 'NewDialog'
	}
</script>

<style scoped>
	.headline {
		text-align: center !important;
	}
</style>
>
