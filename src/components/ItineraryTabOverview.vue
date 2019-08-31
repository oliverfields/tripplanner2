<template>
	<ul class="itinerary">
		<li class="day" v-for="day in this.$store.state.active_trip.itinerary">
			<a href="#" @click="show({view: 'day_view', day_index: day.day_index })">{{ day.date_pretty }}, day {{ day.day_number }}</a>
			<ul class="activities" v-if="day.activities">
				<li class="activity" v-for="activity in day.activities">
					<a href="#" @click="show({view: 'activity_view', activity_index: activity.activity_index, day_index: day.day_index })">{{ activity.description }}</a>
				</li>
			</ul>
		</li>
	</ul>
</template>

<script>
	export default {
	name: 'ItineraryTabOverveiw',
		data () {
			return {
			}
		},
		components: {
		},
		methods: {
			show(args) {
				this.$emit('show', args)
			}
		}
	}
</script>

<style>
	.itinerary {
		list-style: none;
		padding: 1rem;
		margin-top: 1rem;
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
	.activities{
		padding: .2rem 0 0 2rem;
	}
</style>