<template>
	<div id="tabs">
		<a
			:class="save_button_classes"
			href="#" @click="save_trip"
			v-if="this.$store.state.active_trip"
			class="nav-item"
		>
			<i class="fa fa-save" /> Save {{ this.$store.state.active_trip.name }}
			<sup v-if="this.$store.state.active_trip.error_registry.length > 0">
				<i class="fa fa-exclamation-triangle" />
			</sup>
			<sup v-else-if="this.$store.state.active_trip.dirty">
				<i class="fa fa-asterisk" />
			</sup>
		</a>
		<ul class="nav nav-tabs" id="trip-tabs" role="tablist">
			<li class="nav-item">
				<a
					class="nav-link active"
					data-toggle="tab"
					href="#itinerary-tab-content"
					role="tab"
				>Itinerary</a>
			</li>
			<li class="nav-item">
				<a 
					class="nav-link"
					data-toggle="tab"
					href="#trip-tab-content"
					role="tab"
				>Trip</a>
			</li>
			<li class="nav-item">
				<a
					class="nav-link"
					data-toggle="tab"
					href="#map-tab-content"
					role="tab"
				>Map</a>
			</li>
		</ul>
		<div class="tab-content" id="trip-tabs-content">
			<div class="tab-pane show active" id="itinerary-tab-content" role="tabpanel" aria-labelledby="itinerary-tab-content"><ItineraryTab /></div>
			<div class="tab-pane" id="trip-tab-content" role="tabpanel" aria-labelledby="trip-tab-content"><TripTab /></div>
			<div class="tab-pane" id="map-tab-content" role="tabpanel" aria-labelledby="map-tab-content"><MapTab /></div>
		</div>
	</div>
</template>

<script>
	import TripTab from '@/components/TripTab'
	import MapTab from '@/components/MapTab'
	import ItineraryTab from '@/components/ItineraryTab'

	export default {
		name: 'Tabs',
		components: {
			TripTab,
			MapTab,
			ItineraryTab
		},
		methods: {
			save_trip() {
				console.log(this.$store.state.active_trip)
			}
		},
		computed: {
			save_button_classes: function() {
				let is_active = (this.active_trip_has_errors || !this.$store.state.active_trip.dirty)
				return {
					btn: true,
					'btn-primary': true,
					'trip_save_button': true,
					disabled: is_active,
				}
			},
			active_trip_has_errors() {
				return (this.$store.state.active_trip.error_registry.length != 0)
			},
		},
	}
</script>

<style>
	#trip-tabs-content {
	margin-top: 1rem;
	}
	.trip_save_button {
		margin-bottom: 1.5rem;
	}
	#trip-tabs a.active {
		border-color: #6C757D #6C757D #ffffff !important;
	}
	#trip-tabs {
		border-bottom: 1px solid #6C757D !important;
	}
</style>