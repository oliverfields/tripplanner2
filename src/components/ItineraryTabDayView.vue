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
							<div class="invalid-feedback"><i class="fa fa-exclamation-triangle" /> Notes can only use letters and numbers</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-12">
						<div class="form-group">
							<label for="activities">Activities</label>
							<draggable
								tag="ul"
								v-model="day_activities_list"
								handle=".handle"
								class="activities"
							>
								<li
									v-for="(activity, activity_index) in day.activities"
									:key="activity.tmp_id"
								>
									<i class="fa fa-grip-vertical handle"></i>
									<a href="#" @click="show_activity(day_index, activity_index)">{{ activity.description }} </a>
									<MarkerLink :activity="activity" class="text-to-left" />
									<click-confirm button-size="sm" :messages="{ title: 'Delete \'' + activity.description + '\'?'}">
										<i class="fa fa-times danger text-to-left" @click="delete_activity({day_index: day_index, activity_index: activity_index})"></i>
									</click-confirm>
								</li>
							</draggable>
						</div>
					</div>
					<div class="col-md-6">
						<a class="btn btn-primary slim-button" href="#" @click="add_activity_and_show(day_index, day)"><i class="fa fa-plus" /> Add activity</a>
					</div>
				</div>
				<div class="row">
					<div class="col-md-12">
						<div class="form-group">
							<label for="routes">Routes</label>

							<draggable
								tag="ul"
								v-model="day_routes_list"
								handle=".handle"
								class="activities"
							>
								<li
									v-for="(route, route_index) in day.routes"
									:key="route.tmp_id"
								>
									<i class="fa fa-grip-vertical handle"></i>
									<a href="#" @click="show_route(day_index, route_index)">
										<span v-if="route.name">{{ route.name }}</span>
										<span v-else><em>empty</em></span>
									</a>&nbsp;
									<span>{{ route.distance_km }}km</span>
									<RouteLink :route="route" class="text-to-left" />
									<click-confirm button-size="sm" :messages="{ title: 'Delete \'' + route.name + '\'?'}">
										<i class="fa fa-times danger text-to-left" @click="delete_route({day_index: day_index, route_index: route_index})"></i>
									</click-confirm>
								</li>
							</draggable>


<!--
							<ul id="label">
								<li  v-if="day.routes.length > 0" class="route" v-for="(route, route_index) in day.routes">
									<a href="#" @click="show_route(day_index, route_index)">
										<span v-if="route.name">{{ route.name }}</span>
										<span v-else><em>empty</em></span>
									</a>
									&nbsp;
									<span class="text-to-left">{{ route.distance_km }}km</span>
									<a href="#" @click="delete_route({day_index: day_index, route_index: route_index})"><i class="danger fa fa-times text-to-left" title="Delete route" /></a>
								</li>
							</ul>
-->

						</div>
					</div>
					<div class="col-md-6">
						<a class="btn btn-primary slim-button" href="#" @click="add_route_and_show(day_index, day)"><i class="fa fa-plus" /> Add route</a>
					</div>
				</div>
			</div>
		</div>
	</form>
</template>

<script>
	import MarkerLink from '@/components/MarkerLink'
	import RouteLink from '@/components/RouteLink'
	import draggable from "vuedraggable"

	export default {
		name: 'ItineraryTabDayVeiw',
		components: {
			RouteLink,
			MarkerLink,
			draggable
		},
		methods: {
			show_activity(day_index, activity_index) {
				this.$store.dispatch('show_activity', {day_index: day_index, activity_index: activity_index})
			},
			add_activity_and_show(day_index, day) {
				this.$store.dispatch('add_activity_and_show', {day_index: day_index, day: day})
			},
			show_route(day_index, route_index) {
				this.$store.dispatch('show_route', {day_index: day_index, route_index: route_index})
			},
			add_route_and_show(day_index, day) {
				this.$store.dispatch('add_route_and_show', {day_index: day_index, day: day})
			},
			delete_activity(payload) {
				this.$store.dispatch('delete_activity', payload)
			},
			delete_route(payload) {
				this.$store.dispatch('delete_route', payload)
			},
			validate_day_notes() {
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
			day_activities_list: {
				get() {
					return this.$store.state.active_trip.itinerary[
						this.$store.state.active_trip.itinerary_navigation.show_day_index
					]
					.activities
				},
				set(value) {
					this.$store.commit('update_active_day', { property: 'activities', value: value })
				}
			},
			day_routes_list: {
				get() {
					return this.$store.state.active_trip.itinerary[
						this.$store.state.active_trip.itinerary_navigation.show_day_index
					]
					.routes
				},
				set(value) {
					this.$store.commit('update_active_day', { property: 'routes', value: value })
				}
			},
			show_day_index: function() {
				return this.$store.state.active_trip.itinerary_navigation.show_day_index
			},
			notes_class: function() {
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

<style scoped>
	.slim-button {
		margin-bottom: 2rem;
	}
	.activities {
		padding: .5rem 0 .5rem 0 ! important;
	}
	.activities li {
		list-style: none;
		margin-left: 0;
	}
	.activities li div {
		display: inline-block;
	}
	.handle {
		cursor: grab;
		color: #999;
	}
</style>