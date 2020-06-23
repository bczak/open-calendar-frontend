<template>
	<v-dialog v-model="active" v-if="active" persistent max-width="500" @click:outside="close">
		<v-card>
			<v-card-title class="headline">Invite people to calendar</v-card-title>
			<v-card-subtitle>Type e-mail to invite people. This action does not send e-mail, but just adds mail to list of
				members.
			</v-card-subtitle>
			<v-card-text>
				<v-alert type="error" v-if="error.length > 0">
					{{error}}
				</v-alert>
				<v-text-field
					v-model="mail"
					menu-props="auto"
					label="E-mail"
					placeholder="E-mail"
					outlined
					prepend-icon="mdi-email"
				/>
				<v-btn color="green darken-1" text @click="invite">Invite</v-btn>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
	import {API} from "../conf";

	export default {
		name: "Invite",
		props: {
			active: Boolean,
			app: String,
		},
		data: () => ({
			mail: '',
			error: ''
		}),
		methods: {
			invite: function () {
				fetch(API + '/api/invite/' + this.app + '/' + this.mail,
					{method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
					.then(response => {
						if (!response.ok) {
							return response.json()
						}
						return response.json()
					}).then(e => {
					console.log(e);
					this.error = e.error || ''
				})

			},
			close: function () {
				this.$emit('close')
			},
		}
	}
</script>

<style scoped>

</style>