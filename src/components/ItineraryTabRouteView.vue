<template>
	<form>
		<div v-for="(day, day_index) in this.$store.state.active_trip.itinerary">
			<div v-for="(route, route_index) in day.routes">
				<div class="route" v-show="show_route(day_index, route_index)">
					<h2>Route</h2>
					<div class="row">
						<div class="col-md-12">
							<div class="form-group">
								<label for="route_name">Name</label>
								<input
									:class="route_name_class"
									v-model="route_name"
								/>
								<div class="invalid-feedback"><i class="fa fa-exclamation-triangle" /> Name can only use letters and numbers</div>
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
		name: 'ItineraryTabRouteView',
		components: {
		},
		data() {
			return {
				tmp_route_name_is_valid: true
			}
		},
		methods: {
			show_route(day_index, route_index) {
				return this.$store.state.active_trip.itinerary_navigation.show_day_index == day_index && this.$store.state.active_trip.itinerary_navigation.show_route_index == route_index
			},
			validate_route_name() {

				let is_valid = true
				let action = 'remove'

				if(this.route_name == '')
					is_valid = true
				else {
					let re = this.$XRegExp("^[\\p{L}\\d\ \\_\\-]+$")
					is_valid = re.test(this.route_name)
					
				}

				if(!is_valid)
					action = 'add'
				this.$store.commit('error_registry', {action: action, tmp_id: this.route.tmp_id + '_name'})

				return is_valid
			},
		},
		computed: {
			route_name_class: function() {
				return {
					'form-control': true,
					'is-invalid': !this.validate_route_name()
				}
			},
			route: function() {
				return this.$store.state.active_trip.itinerary[
						this.$store.state.active_trip.itinerary_navigation.show_day_index
					]
					.routes[
						this.$store.state.active_trip.itinerary_navigation.show_route_index
					]
			},
			route_name: {
				get() {
					return this.route.name
				},
				set(value) {
					this.$store.commit('update_active_route', {property: 'name', value: value})
				}
			},
		}
	}
</script>

<style>
</style>