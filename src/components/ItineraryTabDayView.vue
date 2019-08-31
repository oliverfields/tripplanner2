<template>
	<div>
		<div v-for="day in this.$store.state.active_trip.itinerary">
			<div class="day" v-show="show_day_index == day.day_index">
				<h2>{{ day.date_pretty }}</h2>
				<h3>Activities</h3>
				<ul v-if="day.activities">
					<li class="activity" v-for="activity in day.activities">
						<a href="#" @click="show_activity(day.day_index, activity.activity_index)">{{ activity.description }}</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'ItineraryTabDayVeiw',
		components: {
		},
		methods: {
			show_activity(day_index, activity_index){
				this.$store.dispatch('show_activity', {day_index: day_index, activity_index: activity_index})
			}
		},
		computed: {
			show_day_index: function() {
				return this.$store.state.active_trip.itinerary_navigation.show_day_index
			}
		}
	}
</script>

<style>
</style>