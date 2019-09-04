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
							<div v-show="validate_day_notes" class="invalid-feedback"><font-awesome-icon icon="exclamation-triangle" /> Notes can only use letters and numbers</div>
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
			validate_day_notes: function() {
				if(this.notes == '') {
					this.$store.commit('update_active_trip', { property: 'valid', value: true})
					return true
				}

				let re = this.$XRegExp("^[\\p{L}\\d\ \\_\\-]+$")
				let result = re.test(this.notes)
				this.$store.commit('update_active_trip', { property: 'valid', value: result})
				return result
			},
		},
		computed: {
			show_day_index: function() {
				return this.$store.state.active_trip.itinerary_navigation.show_day_index
			},
			notes_class: function() {
				return {
					'form-control': true,
					'is-invalid': !this.validate_day_notes()
				}
			},
			notes: {
				get() {
					return this.$store.state.active_trip.itinerary[
						this.$store.state.active_trip.itinerary_navigation.show_day_index
					].notes
				},
				set(value) {
					this.$store.commit('update_active_day', {property: 'notes', value: value})
				}
			},
		}
	}
</script>

<style>
</style>