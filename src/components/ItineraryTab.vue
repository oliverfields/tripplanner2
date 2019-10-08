<template>
	<div>
		<div
			key="breadcrumb"
			class="breadcrumb"
			v-if="this.show_day_index != null || this.show_activity_index != null || this.show_route_index != null"
		>
			<a
				href="#"
				v-if="this.show_day_index != null || this.show_activity_index != null || this.show_route_index != null"
				@click="show_itinerary()"
			><i class="fa fa-chevron-left" />Itinerary</a> <a
				href="#"
				v-if="this.show_activity_index != null || this.show_route_index != null"
				@click="show_day(show_day_index)"
			><i class="fa fa-chevron-left" />{{ selected_day_date_pretty }}</a>
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
			<div class="day" v-for="(day, day_index) in this.$store.state.active_trip.itinerary">
				<div>


					<div
						v-if="day_index == 0"
					>
						<a
							href="#"
							@click="show_day(day_index)"
						>{{ day.date_pretty }}, day {{ day.day_number }}</a>
						<Datepicker
							v-model="start_date"
							format="D d MMM yyyy"
							monday-first
							calendar-button
							calendar-button-icon="fa fa-calendar"
							title="Start date"
							class="text-to-left"
						></Datepicker>
					</div>
					<div v-else>
						<a
							href="#"
							@click="show_day(day_index)"
						>
							{{ day.date_pretty }}, day {{ day.day_number }}
						</a>
					</div>
					<click-confirm
						button-size="sm"
						:messages="{ title: 'Delete \'' + day.date_pretty + '\'?'}"
						v-if="day_index > 0"
					>
						<i
							class="fa fa-times danger text-to-left"
							@click="delete_day({day_index: day_index})"
							v-if="day_index > 0"
						>
						</i>
					</click-confirm>
				</div>

				<div class="routes" v-if="day.routes.length > -1">
					<span v-if="day.routes.length > 0">{{ day_route_distance(day_index) }}km</span>
					<span
						class="route_shortcut"
						v-for="(route, route_index) in day.routes"
					>
						<RouteLink :route="route" class="text-to-left" />
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
			</div>

			<div class="col-md-6">
				<a class="btn btn-primary slim-button" style="margin: 1rem 0 2rem -1rem;" href="#" @click="add_day_and_show()"><i class="fa fa-plus" /> Add day</a>
			</div>
		</div>
	</div>
</template>

<script>
	import ItineraryTabDayView from '@/components/ItineraryTabDayView'
	import ItineraryTabActivityView from '@/components/ItineraryTabActivityView'
	import ItineraryTabRouteView from '@/components/ItineraryTabRouteView'
	import MarkerLink from '@/components/MarkerLink'
	import RouteLink from '@/components/RouteLink'
	import Datepicker from 'vuejs-datepicker'
	
	export default {
		name: 'ItineraryTab',
		components: {
			ItineraryTabDayView,
			ItineraryTabActivityView,
			ItineraryTabRouteView,
			MarkerLink,
			RouteLink,
			Datepicker,
		},
		computed: {
			start_date: {
				get() {
					return this.$store.state.active_trip.start_date
				},
				set(value) {
					this.$store.dispatch('update_active_trip', { property: 'start_date', value: value })
				}
			},
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
			delete_day(payload) {
				this.$store.dispatch('delete_day', payload)
			},
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
		}
	}
</script>

<style>
	.day>a {
		display: block;
	}
	.activities {
		padding: 0 0 0 2rem;
	}
	.activity {
		list-style: disc;
	}
	.breadcrumb {
		margin-top: 0 !important;
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
	.day > div > div {
		display: inline-block;
	}
	.vdp-datepicker {
		padding-right: 0;
		width: 0;
		display: inline-block;
	}
	.vdp-datepicker input {
		display: none;
	}
	.vdp-datepicker i {
		color: #007bff;
	}
	.vdp-datepicker__calendar {
		margin-left: -10rem;
	}
</style>