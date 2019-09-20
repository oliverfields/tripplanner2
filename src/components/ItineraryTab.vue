<template>
	<div>
		<div key="breadcrumb" class="breadcrumb">
			<a
				href="#"
				v-if="this.show_day_index != null || this.show_activity_index != null || this.show_route_index != null"
				@click="show_itinerary()"
			><i class="fa fa-chevron-left" /> Overview</a> <a
				href="#"
				v-if="this.show_activity_index != null || this.show_route_index != null"
				@click="show_day(show_day_index)"
			><i class="fa fa-chevron-left" /> {{ selected_day_date_pretty }}</a>
		</div>
		<div v-if="this.show_activity_index != null">
			<ItineraryTabActivityView />
		</div>
		<div v-else-if="this.show_route_index != null">
			<ItineraryTabRouteView />
		</div>
		<div v-else-if="this.show_day_index != null">
			<ItineraryTabDayView />
		</div>
		<div v-else>
			<ul class="itinerary">
				<li class="day" v-for="(day, day_index) in this.$store.state.active_trip.itinerary">
					<div>
						<a href="#" @click="show_day(day_index)">{{ day.date_pretty }}, day {{ day.day_number }}</a>
					</div>

					<div class="routes" v-if="day.routes.length > -1">
						<span v-if="day.routes.length > 0">{{ day_route_distance(day_index) }}km</span>
						<span
							class="route_shortcut"
							v-for="(route, route_index) in day.routes"
							@click="set_map_bounds(route.map_bounds)"
						>
							<i
								class="fa fa-route text-to-left"
								:title="'Show route ' + route.name + ' ' + route.distance_km + 'km'"
								:style="{ color: route.color_hex }"
							/>
						</span>
					</div>

					<div class="notes">{{ day.notes }}</div>

					<ul class="activities" v-if="day.activities">
						<li class="activity" v-for="(activity, activity_index) in day.activities">
							<a href="#" @click="show_activity(day_index, activity_index)">
								<span v-if="activity.description">{{ activity.description }}</span>
								<span v-else><em>empty</em></span>
							</a>
							<MarkerLink :activity="activity" class="text-to-left" />
						</li>
					</ul>
				</li>
			</ul>
			<div class="col-md-6">
				<a class="btn btn-primary slim-button" href="#" @click="add_day_and_show()"><i class="fa fa-plus" /> Add day</a>
			</div>
		</div>
	</div>
</template>

<script>
	import ItineraryTabDayView from '@/components/ItineraryTabDayView'
	import ItineraryTabActivityView from '@/components/ItineraryTabActivityView'
	import ItineraryTabRouteView from '@/components/ItineraryTabRouteView'
	import MarkerLink from '@/components/MarkerLink'
	
	export default {
		name: 'ItineraryTab',
		components: {
			ItineraryTabDayView,
			ItineraryTabActivityView,
			ItineraryTabRouteView,
			MarkerLink,
		},
		computed: {
			show_day_index: {
				get() {
					return this.$store.state.active_trip.itinerary_navigation.show_day_index
				},
				set(index) {
					this.$store.commit('update_itinerary_navigation', {property: 'show_day_index', value: index})
				}
			},
			show_activity_index: {
				get() {
					return this.$store.state.active_trip.itinerary_navigation.show_activity_index
				},
				set(index) {
					this.$store.commit('update_itinerary_navigation', {property: 'show_activity_index', value: index})
				}
			},
			show_route_index: {
				get() {
					return this.$store.state.active_trip.itinerary_navigation.show_route_index
				},
				set(index) {
					this.$store.commit('update_itinerary_navigation', {property: 'show_route_index', value: index})
				}
			},
			selected_day_date_pretty() {
				let day_index = this.$store.state.active_trip.itinerary_navigation.show_day_index
				if(day_index != null)
					return this.$store.state.active_trip.itinerary[day_index].date_pretty
			}
		},
		methods: {
			day_route_distance(day_index) {
				let distance = 0
				let itinerary = this.$store.state.active_trip.itinerary[day_index]
				for (let r = 0; r < itinerary.routes.length; r++) {
					distance += itinerary.routes[r].distance_km
				}
				return distance
			},
			set_map_center(latlng) {
				this.$store.commit('update_map_settings', { center: latlng })
			},
			add_day_and_show() {
				this.$store.dispatch('add_day_and_show')
			},
			show_day(index){
				this.$store.commit('update_itinerary_navigation', {property: 'show_activity_index', value: null})
				this.$store.commit('update_itinerary_navigation', {property: 'show_route_index', value: null})
				this.$store.commit('update_itinerary_navigation', {property: 'show_day_index', value: index})
			},
			show_itinerary(){
				this.$store.commit('update_itinerary_navigation', {property: 'show_day_index', value: null})
				this.$store.commit('update_itinerary_navigation', {property: 'show_activity_index', value: null})
				this.$store.commit('update_itinerary_navigation', {property: 'show_route_index', value: null})
			},
			show_activity(day_index, activity_index){
				this.$store.dispatch('show_activity', {day_index: day_index, activity_index: activity_index})
				this.$store.commit('update_itinerary_navigation', {property: 'show_route_index', value: null})
			},
			show_route(day_index, route_index){
				this.$store.dispatch('show_route', {day_index: day_index, route_index: route_index})
				this.$store.commit('update_itinerary_navigation', {property: 'show_activity_index', value: null})
			},
			set_map_bounds(bounds) {
				this.$store.commit('set_map_bounds', bounds)
			},
		}
	}
</script>

<style>
	.itinerary {
		list-style: none;
		padding: 1rem;
	}
	.itinerary a{
		margin: 0;
	}
	.day {
		margin-bottom: 1.5rem;
	}
	.day>a {
		display: block;
	}
	.activities {
		padding: .5rem 0 0 2rem;
	}
	.breadcrumb a:nth-child(2) {
		margin: 0 .5rem 0 1.5rem;
	}
	.notes {
		font-style: italic;
		margin: .3rem 1rem;
	}
	.routes {
		margin-left: 1rem;
		color: #666;
	}
	.route_shortcut {
		cursor: pointer;
	}
	.route_shortcut:hover {
		text-decoration: underline;
	}
</style>