<template>
	<div>
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