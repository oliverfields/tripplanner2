<template>
	<div>
		<div key="breadcrumb" class="breadcrumb">
			<a
				href="#"
				v-if="this.show_day_index != null || this.show_activity_index != null"
				@click="show_itinerary()"
			><i class="fa fa-chevron-left" /> Overview</a> <a
				href="#"
				v-if="this.show_activity_index != null"
				@click="show_day(show_day_index)"
			><i class="fa fa-chevron-left" /> {{ selected_day_date_pretty }}</a>
		</div>

		<div v-if="this.show_activity_index != null">
			<ItineraryTabActivityView />
		</div>
		<div v-else-if="this.show_day_index != null">
			<ItineraryTabDayView />
		</div>
		<div v-else>
			<ul class="itinerary">
				<li class="day" v-for="(day, day_index) in this.$store.state.active_trip.itinerary">
					<a href="#" @click="show_day(day_index)">{{ day.date_pretty }}, day {{ day.day_number }}</a>
					<div class="notes">{{ day.notes }}</div>
					<ul class="activities" v-if="day.activities">
						<li class="activity" v-for="(activity, activity_index) in day.activities">
							<a href="#" @click="show_activity(day_index, activity_index)">
								<span v-if="activity.description">{{ activity.description }}</span>
								<span v-else><em>empty</em></span>
							</a>
							&nbsp;
							<i
								:class="activity_marker_icon_class(activity)"
								:style="activity_marker_icon_color(activity)"
								v-if="activity.marker_coordinates"
								@click="set_map_center(activity.marker_coordinates)"
							/>
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
	
	export default {
	name: 'ItineraryTab',
		components: {
			ItineraryTabDayView,
			ItineraryTabActivityView
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
			selected_day_date_pretty() {
				let day_index = this.$store.state.active_trip.itinerary_navigation.show_day_index
				if(day_index != null)
					return this.$store.state.active_trip.itinerary[day_index].date_pretty
			}
		},
		methods: {
			set_map_center(latlng) {
				this.$store.commit('update_map_settings', { center: latlng })
			},
			activity_marker_icon_class(activity) {
				return 'fa fa-' + activity.marker_icon
			},
			activity_marker_icon_color(activity) {
				return 'color: ' + activity.marker_color_hex
			},
			add_day_and_show() {
				this.$store.dispatch('add_day_and_show')
			},
			show_day(index){
				this.$store.commit('update_itinerary_navigation', {property: 'show_activity_index', value: null})
				this.$store.commit('update_itinerary_navigation', {property: 'show_day_index', value: index})
			},
			show_itinerary(){
				this.$store.commit('update_itinerary_navigation', {property: 'show_day_index', value: null})
				this.$store.commit('update_itinerary_navigation', {property: 'show_activity_index', value: null})
			},
			show_activity(day_index, activity_index){
				this.$store.dispatch('show_activity', {day_index: day_index, activity_index: activity_index})
			}
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
		padding: .2rem 0 0 2rem;
	}
	.breadcrumb a:nth-child(2) {
		margin: 0 .5rem 0 1.5rem;
	}
	.notes {
		font-style: italic;
	}
	li.activity i {
		cursor: pointer;
	}
</style>