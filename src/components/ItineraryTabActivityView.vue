<template>
	<div>
		<div class="breadcrumb">
			<a href="#" @click="show({view: 'overview'})"><font-awesome-icon icon="chevron-left" /> Overview</a> <a href="#" @click="show({view: 'day_view', day_index: this.$parent.day_index })"><font-awesome-icon icon="chevron-left" /> {{ this.$store.state.active_trip.itinerary[this.$parent.day_index].date_pretty }}</a>
		</div>
		{{ this.$parent.day_index }}
		<h1>Activity view</h1>
		{{ this.$store.state.active_trip.itinerary[this.$parent.day_index].description }}
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
			show(args) {
				this.$emit('show', args)
			}
		}
	}
</script>