<template>
	<div id="tabs">
		<ul class="nav nav-tabs" id="tripTabs" role="tablist">
			<li class="nav-item">
				<a class="nav-link active" id="trip-tab" data-toggle="tab" href="#trip" role="tab" aria-controls="trip" aria-selected="true">Trip</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" id="itinerary-tab" data-toggle="tab" href="#itinerary" role="tab" aria-controls="itinerary" aria-selected="false">Itinerary</a>
			</li>
		</ul>
		<div class="tab-content" id="tripTabsContent">
			<div class="tab-pane fade show active" id="trip" role="tabpanel" aria-labelledby="trip-tab"><TripTab /></div>
			<div class="tab-pane fade" id="itinerary" role="tabpanel" aria-labelledby="itinerary-tab"><ItineraryTab /></div>
		</div>
	</div>
</template>

<script>
import $ from 'jquery'
import TripTab from '@/components/TripTab'
import ItineraryTab from '@/components/ItineraryTab'

export default {
	name: 'Tabs',
	components: {
		TripTab,
		ItineraryTab
	}
}
</script>

<style>
</style>