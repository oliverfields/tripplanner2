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
					@click="show_itinerary()"
					title="Itinerary"
				><i class="fa fa-clipboard-list" /></a>
			</li>
			<li class="nav-item">
				<a 
					class="nav-link"
					data-toggle="tab"
					href="#trip-settings-tab-content"
					role="tab"
					title="Trip settings"
				><i class="fa fa-cog" /></a>
			</li>
		</ul>
		<div class="tab-content" id="trip-tabs-content">
			<div class="tab-pane show active" id="itinerary-tab-content" role="tabpanel" aria-labelledby="itinerary-tab-content"><ItineraryTab /></div>
			<div class="tab-pane" id="trip-settings-tab-content" role="tabpanel" aria-labelledby="trip-settings-tab-content"><TripSettingsTab /></div>
		</div>
	</div>
</template>

<script>
	import TripSettingsTab from '@/components/TripSettingsTab'
	import ItineraryTab from '@/components/ItineraryTab'

	export default {
		name: 'Tabs',
		components: {
			TripSettingsTab,
			ItineraryTab
		},
		methods: {
			save_trip() {
				this.$store.dispatch('save_active_trip')
			},
			show_itinerary() {
				this.$store.dispatch('show_tab', null)
			},
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
	#trip-tabs a.active {
		display: none
	}
	#trip-tabs a {
		padding-right: 0 !important;
	}
	#trip-tabs a:hover {
		border: 1px solid white !important;
	}
	#trip-tabs {
		border: none !important;
		display: inline-block;
		float: right;
	}
	.tab-content {
		padding: 2rem 0;
	}
</style>