<template>
	<div id="tabs">
		<ul class="nav nav-tabs" id="tripTabs" role="tablist">
			<li class="nav-item">
				<a 
					class="nav-link active"
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
			<li class="nav-item">
				<a
					class="nav-link"
					data-toggle="tab"
					href="#itinerary-tab-content"
					role="tab"
				>Itinerary</a>
			</li>
		</ul>
		<div class="tab-content" id="tripTabsContent">
			<div class="tab-pane fade show active" id="trip-tab-content" role="tabpanel" aria-labelledby="trip-tab-content"><TripTab /></div>
			<div class="tab-pane fade" id="map-tab-content" role="tabpanel" aria-labelledby="map-tab-content"><MapTab /></div>
			<div class="tab-pane fade" id="itinerary-tab-content" role="tabpanel" aria-labelledby="itinerary-tab-content"><ItineraryTab /></div>
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
	}
}
</script>

<style>
#tripTabsContent {
margin-top: 1rem;
}
</style>