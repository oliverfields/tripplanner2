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

					<div class="row">
						<div class="col-md-12">
							<div class="form-group" v-if="active_route != null && active_route.tmp_id == route.tmp_id">
								<a
									href="#"
									style="margin-top: 2rem;"
									@click="toggle_active_route(null)"
									class="btn btn-primary active"
								>
									<i class="fa fa-route" title="Stop editing route" />Stop editing</a>
									<span v-if="route.distance_km > 0" class="route_distance">{{ route.distance_km }}km</span>
							</div>
							<div class="form-group" v-else>
								<a
									href="#"
									style="margin-top: 2rem;"
									@click="toggle_active_route(route)"
									class="btn btn-primary"
								>
									<i class="fa fa-route" title="Start route edit" />Edit route</a>
									<span v-if="route.distance_km > 0" class="route_distance">{{ route.distance_km }}km</span>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-md-12">
							<div class="form-group">
								<label for="route_color">Color</label>
								<div>
									<div class="selected_route_color" :style="route_color_css"></div>
									<div id="route_color">
	<!--
										<span style="background-color: #FFFFFF;" @click="activity_marker_color = 'white'">&nbsp;</span>
	-->
										<span style="background-color: #EB7D7F;" @click="route_color = '#EB7D7F'" title="Light red">&nbsp;</span>
										<span style="background-color: #D63E2A;" @click="route_color = '#D63E2A'" title="Red">&nbsp;</span>
										<span style="background-color: #A23336;" @click="route_color = '#A23336'" title="Dark red">&nbsp;</span>
										<span style="background-color: #F69730;" @click="route_color = '#F69730'" title="Orange">&nbsp;</span>
										<span style="background-color: #FFCB92;" @click="route_color = '#FFCB92'" title="Beige">&nbsp;</span>
										<span style="background-color: #BBF970;" @click="route_color = '#BBF970'" title="Light green">&nbsp;</span>
										<span style="background-color: #72AF26;" @click="route_color = '#72AF26'" title="Green">&nbsp;</span>
										<span style="background-color: #728224;" @click="route_color = '#728224'" title="Dark green">&nbsp;</span>
										<span style="background-color: #8ADAFF;" @click="route_color = '#8ADAFF'" title="Light blue">&nbsp;</span>
										<span style="background-color: #38AADD;" @click="route_color = '#38AADD'" title="Blue">&nbsp;</span>
										<span style="background-color: #0067A3;" @click="route_color = '#0067A3'" title="Dark blue">&nbsp;</span>
										<span style="background-color: #436978;" @click="route_color = '#436978'" title="Cadet blue">&nbsp;</span>
										<span style="background-color: #FF91EA;" @click="route_color = '#FF91EA'" title="Pink">&nbsp;</span>
										<span style="background-color: #D252B9;" @click="route_color = '#D252B9'" title="Purple">&nbsp;</span>
										<span style="background-color: #5B396B;" @click="route_color = '#5B396B'" title="Dark purple">&nbsp;</span>
										<span style="background-color: #A3A3A3;" @click="route_color = '#A3A3A3'" title="Light grey">&nbsp;</span>
										<span style="background-color: #575757;" @click="route_color = '#575757'" title="Gray">&nbsp;</span>
										<span style="background-color: #000000;" @click="route_color = '#000000'" title="Black">&nbsp;</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-md-12">
							<div class="form-group">
								<label for="route_gpx">Import route</label>
								<ImportGPXRoute :route="route" />
								<small id="coordinates-help" class="form-text text-muted">Import route from .gpx file</small>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-md-12">
							<div class="form-group">
								<label for="route_day">Day</label>
								<select
									id="route_day"
									class="form-control"
									@change="move_route_to_day(route, route_index, day)"
									:ref="'move_route_day_' + route.tmp_id"
								>
									<option
										v-for="route_day in itinerary_days()"
										:value="route_day.tmp_id"
										:selected="route_day.tmp_id == day.tmp_id"
									>{{ route_day.date_pretty }}</option>
								</select>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	</form>
</template>

<script>
	import ImportGPXRoute from '@/components/ImportGPXRoute'

	export default {
		name: 'ItineraryTabRouteView',
		components: {
			ImportGPXRoute
		},
		data() {
			return {
				tmp_route_name_is_valid: true,
			}
		},
		methods: {
			itinerary_days() {
				return this.$store.state.active_trip.itinerary
			},
			move_route_to_day(route, route_index, day) {
				let target_day_tmp_id = this.$refs['move_route_day_' + route.tmp_id][0].value
				let target_day = null
				let target_day_index = null

				// Get target day
				let itinerary = this.$store.state.active_trip.itinerary

				for(let d = 0; d < itinerary.length; d++) {
					if(itinerary[d].tmp_id == target_day_tmp_id) {
						target_day = itinerary[d]
						target_day_index = d
						break
					}
				}

				this.$store.dispatch('move_route_to_day', { route: route, source_day: day, target_day: target_day })
				this.$store.dispatch('show_route', {day_index: target_day_index, route_index: this.$store.state.active_trip.itinerary[target_day_index].routes.length - 1}) // Show last route
				this.$store.commit('update_itinerary_navigation', {property: 'show_activity_index', value: null})
			},
			toggle_active_route(route) {
				this.$store.dispatch('replace_active_route', route)
			},
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
			route_color_css: function() {
				return 'background-color: ' + this.route.color_hex + ';'
			},
			route_color: {
				get() {
					return this.route.color_hex
				},
				set(value) {
					this.$store.commit('update_active_route', {property: 'color_hex', value: value})
				}
			},
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
			active_route: function() {
				return this.$store.state.map.active_route
			},
		}
	}
</script>

<style scoped>
	#route_color span {
		margin: 0 .5rem 0 0 ! important;
		height: 1rem;
		width: 1rem;
		display: inline-block;
		border: solid 1px #000;
	}
	.selected_route_color {
		font-size: 2rem;
		width: 4rem;
		float: left;
		background-color: red;
		height: 4rem;
		padding: .5rem 0 0 .5rem;
		margin-right: 1rem;
		color: white;
		text-align: center;
	}
	.route_distance {
		vertical-align: bottom;
		font-size: 1.5rem;
		margin-left: 1rem;
		color: #666;
	}
	.route li {
		list-style: none;
		margin-left: 0;
	}
</style>