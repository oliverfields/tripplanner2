<template>
	<div>
		<div class="breadcrumb">
			<a href="#" @click="show({view: 'overview'})"><font-awesome-icon icon="chevron-left" /> Overview</a>
		</div>
		<h2>{{ this.$store.state.active_trip.itinerary[this.$parent.day_index].date_pretty }}</h2>
		<h3>Activities</h3>
		<ul v-if="this.$store.state.active_trip.itinerary[this.$parent.day_index].activities">
			<li class="activity" v-for="activity in this.$store.state.active_trip.itinerary[this.$parent.day_index].activities">
				<a href="#" @click="show({view: 'activity_view', activity_index: activity.activity_index })">{{ activity.description }}</a>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: 'ItineraryTabDayVeiw',
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

</style>