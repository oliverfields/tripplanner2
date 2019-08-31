<template>
	<div>
		<div v-for="day in this.$store.state.active_trip.itinerary">
			<div v-for="activity in day.activities">
				<div class="activity" v-show="show_activity(day.day_index, activity.activity_index)">
					{{ activity.activity_id }}{{ activity.description }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'ItineraryTabActivityView',
		data () {
			return {
			}
		},
		components: {
		},
		methods: {
			show_activity: function(day_index, activity_index) {
				return this.$store.state.active_trip.itinerary_navigation.show_day_index == day_index && this.$store.state.active_trip.itinerary_navigation.show_activity_index == activity_index
			}
		},
		computed: {
		}
	}
</script>