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
								<div class="invalid-feedback"><font-awesome-icon icon="exclamation-triangle" /> Description can only use letters and numbers</div>
							</div>
						</div>
					</div>
<!--
					<div class="row">
						<div class="col-md-12">
							<div class="form-group">
								<label for="activity_marker">Marker</label>
								<input
									:class="activity_marker_class"
									v-model="activity_marker"
								/>
							</div>
						</div>
					</div>
-->
					<div class="row">
						<div class="col-md-12">
							<div class="form-group">
								<label for="activity_coordinates">Marker coordinates</label>
								<input
									:class="activity_coordinates_class"
									v-model="activity_coordinates"
								/>
								<small id="coordinates-help" class="form-text text-muted">Latitude, Longitude</small>
								<div class="invalid-feedback"><font-awesome-icon icon="exclamation-triangle" /> Format must be xx.xxxx,yy.yyyy</div>
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
		data() {
			return {
				tmp_activity_coordinates: null,
				tmp_activity_description_is_valid: true
			}
		},
		methods: {
			validate_activity_coordinates() {
				let latlng_valid = false
				let action = 'remove'

				if(this.tmp_activity_coordinates == null || this.tmp_activity_coordinates == '')
					 latlng_valid = true
				else {
					let latlng_object = this.tp_str_2_latlng(this.tmp_activity_coordinates)
					if(latlng_object)
						latlng_valid = true
				}

				if(!latlng_valid)
					action = 'add'
				this.$store.commit('error_registry', {action: action, tmp_id: this.activity.tmp_id + '_marker_coordinates'})

				return latlng_valid
			},
			show_activity(day_index, activity_index) {
				return this.$store.state.active_trip.itinerary_navigation.show_day_index == day_index && this.$store.state.active_trip.itinerary_navigation.show_activity_index == activity_index
			},
			validate_activity_description() {

				let is_valid = true
				let action = 'remove'

				if(this.activity_description == '')
					is_valid = false
				else {
					let re = this.$XRegExp("^[\\p{L}\\d\ \\_\\-]+$")
					is_valid = re.test(this.activity_description)
					
				}

				if(!is_valid)
					action = 'add'
				this.$store.commit('error_registry', {action: action, tmp_id: this.activity.tmp_id + '_description'})

				return is_valid
			},
		},
		computed: {
			activity_description_class: function() {
				return {
					'form-control': true,
					'is-invalid': !this.validate_activity_description()
				}
			},
			activity: function() {
				return this.$store.state.active_trip.itinerary[
						this.$store.state.active_trip.itinerary_navigation.show_day_index
					]
					.activities[
						this.$store.state.active_trip.itinerary_navigation.show_activity_index
					]
			},
			activity_description: {
				get() {
					return this.activity.description
				},
				set(value) {
					this.$store.commit('update_active_activity', {property: 'description', value: value})
				}
			},
			activity_coordinates_class: function() {
				return {
					'form-control': true,
					'is-invalid': !this.validate_activity_coordinates()
				}
			},
			activity_coordinates: {
				get() {
					return this.tmp_activity_coordinates
				},
				set(value) {
					// If tmp value is valid latlng update store, else just update tmp value, so don't mess up bindings to map
					this.tmp_activity_coordinates = value

					if(this.validate_activity_coordinates()){
						this.$store.commit('update_active_activity', { property: 'marker_coordinates', value: this.tp_str_2_latlng(this.tmp_activity_coordinates) })
					}
					else
						this.$store.commit('update_active_activity', { property: 'marker_coordinates', value: null })
				}
			},
		}
	}
</script>