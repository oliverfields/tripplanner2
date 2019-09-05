<template>
	<form>
		<div v-for="(day, day_index) in this.$store.state.active_trip.itinerary">
			<div class="day" v-show="show_day_index == day_index">
				<h2>{{ day.date_pretty }}, day {{ day.day_number }}</h2>
				<div class="row">
					<div class="col-md-12">
						<div class="form-group">
							<label for="trip_notes">Notes</label>
							<textarea
								:class="notes_class"
								v-model="notes"
							/>
							<div class="invalid-feedback"><font-awesome-icon icon="exclamation-triangle" /> Notes can only use letters and numbers</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-12">
						<div v-if="day.activities">
							<h3>Activities</h3>
							<ul>
								<li class="activity" v-for="(activity, activity_index) in day.activities"">
									<a href="#" @click="show_activity(day_index, activity_index)">
										<span v-if="activity.description">{{ activity.description }}</span>
										<span v-else><em>empty</em></span>
									</a>
									<a href="#" @click="delete_activity({day_index: day_index, activity_index: activity_index})"><font-awesome-icon icon="trash-alt" /></a>
								</li>
							</ul>
						</div>
					</div>
					<div class="col-md-6">
						<a class="btn btn-primary slim-button" href="#" @click="add_activity_and_show(day_index, day)"><font-awesome-icon icon="plus" /> Add activity</a>
					</div>
				</div>
			</div>
		</div>
	</form>
</template>

<script>
	export default {
		name: 'ItineraryTabDayVeiw',
		methods: {
			show_activity(day_index, activity_index) {
				this.$store.dispatch('show_activity', {day_index: day_index, activity_index: activity_index})
			},
			add_activity_and_show(day_index, day) {
				this.$store.dispatch('add_activity_and_show', {day_index: day_index, day: day})
			},
			delete_activity(payload) {
				this.$store.commit('delete_activity', payload)
			},
			validate_day_notes() {
				console.log('validating')
				console.log(this.notes)
				let action = 'remove'
				let is_valid = true

				if(this.notes == '') {
					is_valid = true
				}
				else {
					let re = this.$XRegExp("^[\\p{L}\\d\ \\_\\-]+$")
					is_valid = re.test(this.notes)
				}

				if(!is_valid)
					action = 'add'
				this.$store.commit('error_registry', {action: action, tmp_id: this.day.tmp_id + '_notes'})

				return is_valid
			},
		},
		computed: {
			show_day_index: function() {
				return this.$store.state.active_trip.itinerary_navigation.show_day_index
			},
			notes_class: function() {
				console.log('hello')
				return {
					'form-control': true,
					'is-invalid': !this.validate_day_notes()
				}
			},
			day: function() {
				return this.$store.state.active_trip.itinerary[
						this.$store.state.active_trip.itinerary_navigation.show_day_index
					]
			},
			notes: {
				get() {
					return this.day.notes
				},
				set(value) {
					this.$store.commit('update_active_day', {property: 'notes', value: value})
					this.validate_day_notes()
				}
			},
		}
	}
</script>

<style>
</style>