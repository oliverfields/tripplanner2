<template>
	<form>
		<div v-for="(day, day_index) in this.$store.state.active_trip.itinerary">
			<div v-for="(activity, activity_index) in day.activities">
				<div class="activity" v-show="show_activity(day_index, activity_index)">
					<div class="row">
						<div class="col-md-12">
							<div class="form-group">
								<label for="activity_description">Description</label>
								<input
									:class="activity_description_class"
									v-model="activity_description"
								/>
								<div v-show="validate_activity_description" class="invalid-feedback">Description can only use letters and numbers</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</form>
</template>

<script>
	export default {
		name: 'ItineraryTabActivityView',
		methods: {
			validate_activity_description: function() {
				if(this.activity_description == '') {
					this.$store.commit('update_active_trip', { property: 'valid', value: false})
					return false
				}
				let re = this.$XRegExp("^[\\p{L}\\d\ \\_\\-]+$")
				let result = re.test(this.activity_description)
				this.$store.commit('update_active_trip', { property: 'valid', value: result})

				return result
			},
			show_activity: function(day_index, activity_index) {
				return this.$store.state.active_trip.itinerary_navigation.show_day_index == day_index && this.$store.state.active_trip.itinerary_navigation.show_activity_index == activity_index
			}
		},
		computed: {
			activity_description_class: function() {
				return {
					'form-control': true,
					'is-invalid': !this.validate_activity_description()
				}
			},
			activity_description: {
				get() {
					return this.$store.state.active_trip.itinerary[
							this.$store.state.active_trip.itinerary_navigation.show_day_index
						]
						.activities[
							this.$store.state.active_trip.itinerary_navigation.show_activity_index
						]
						.description
				},
				set(value) {
					this.$store.commit('update_active_activity', {property: 'description', value: value})
					this.validate_activity_description()
				}
			},
		}
	}
</script>