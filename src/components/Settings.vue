<template>
	<v-dialog v-model="active" max-width="500" persistent @click:outside="close()">
		<v-card :dark="dark">
			<v-card-title class="headline">Edit Calendar</v-card-title>
			<v-card-text>
				<v-label>Information</v-label>
				<v-row>
					<v-col>
						<v-text-field
							label="Title"
							placeholder="Choose a title for your new calendar"
							outlined
							v-model="calendar.title"
							prepend-icon="mdi-calendar-today"
						/>
						<v-select
							v-model="calendar.timezone"
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
							v-bind:prepend-icon="!calendar.type? 'mdi-lock' : 'mdi-earth'"
						/>
						<v-alert type="error" v-if="error.length > 0">
							{{error}}
						</v-alert>
						<v-alert type="success" v-if="success">
							{{$t('app.saved')}}
						</v-alert>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-btn color="green darken-1" text @click="$emit('close')">Close</v-btn>
				<v-spacer></v-spacer>
				<v-btn color="green darken-1" text @click="deleteCal" :loading="deleting">Delete Calendar</v-btn>
					<v-spacer></v-spacer>
				<v-btn color="green darken-1" text @click="save">Save
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	import {API} from "../conf";

	export default {
		name: "Settings",
		props: {
			active: Boolean,
			cal: String,
			dark: Boolean
		},
		async mounted() {
			const app = window.location.pathname.split(':')[1]
			this.calendar = await (await fetch(API + '/api/calendar/' + app)).json()
			this.calendar_type = this.calendar.type ? 'Public': 'Private'
		},
		data: () => ({
			deleting: false,
			error: '',
			success: false,
			calendar: {},
			calendar_type: 'Private',
			zones: ['UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:30', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:30', 'UTC-04:00', 'UTC-03:30', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+03:30', 'UTC+04:00', 'UTC+04:30', 'UTC+05:00', 'UTC+05:30', 'UTC+05:45', 'UTC+06:00', 'UTC+06:30', 'UTC+07:00', 'UTC+08:00', 'UTC+08:45', 'UTC+09:00', 'UTC+09:30', 'UTC+10:00', 'UTC+10:30', 'UTC+11:00', 'UTC+11:30', 'UTC+12:00', 'UTC+12:45', 'UTC+13:00', 'UTC+14:00']
		}),
		methods: {
			deleteCal: async function() {
				this.deleting = true
				this.success = false
				this.error = ''
				let result;
				result = await fetch(API + '/api/calendar/' + this.calendar._id, {
						method: 'DELETE',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}
					}
				)
				result = await result.json();
				console.log(result)
				if (result.error) {
					this.error = result.error;
					this.submit = false;
				} else {
					window.location = API + '/app'
				}
			},
			close: function () {
				this.$emit('close')
			},
			save: async function () {
				this.success = false
				this.error = ''
				let result;
				this.calendar.type = this.calendar_type === 'Public'
				result = await fetch(API + '/api/calendar/' + this.calendar._id, {
						method: 'PUT',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
					body: JSON.stringify(this.calendar)
					}
				)
				console.log(1)

				result = await result.json();
				if(result.error) {
					this.error = result.error;
				} else {
					this.calendar = result
					this.$emit('update')
					this.success = true;
				}
			}
		}
	}
</script>

<style scoped>

</style>