<template>
	<l-map
		id="map"
		ref="map"
		:style="{'width': this.map_dimensions.width, 'height': this.map_dimensions.height}"
		:zoom="this.map_zoom"
		:center="this.map_center"
		@update:zoom="zoomUpdated"
		@update:center="centerUpdated"
	>
		<l-control-layers></l-control-layers>

		<l-tile-layer
			:url="url"
			:attribution="this.attribution"
		></l-tile-layer>

		<l-marker :lat-lng="this.$store.getters.map_settings.center">
			<l-icon
				:icon-size="this.center_crosshairs_icon.size"
				:icon-anchor="this.center_crosshairs_icon.anchor"
				:icon-url="this.center_crosshairs_icon.image_url"
			/>
		</l-marker>

		<l-layer-group
			v-for="(day,day_index) in this.$store.state.active_trip.itinerary"
			layer-type="overlay"
			v-bind:name="day.date_pretty"
		>
			<l-marker
				v-for="activity in day_activities_with_markers(day_index)" v-bind:lat-lng="activity.marker_latlng"
			></l-marker>
		</l-layer-group>
	</l-map>
</template>

<script>
	// Fine guide: https://github.com/KoRiGaN/Vue2Leaflet/blob/master/examples/src/components/Example.vue

	import {
		LMap,
		LTileLayer,
		LMarker,
		LIcon,
		LControlLayers,
		LLayerGroup
	} from 'vue2-leaflet'
	import { icon } from "leaflet"

	export default {
		name: 'Map',
		components: {
			LMap,
			LTileLayer,
			LMarker,
			LIcon,
			LControlLayers,
			LLayerGroup
		},
		data() {
			return {
				url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
				map_dimensions: {
					width: 0,
					height: 0
				},
				center_crosshairs_icon: {
					image_url: 'images/MapCenterCoordIcon2.svg',
					size: [30, 30],
					anchor: [15, 15]
				}
			}
		},
		methods: {
			zoomUpdated (zoom) {
				this.$store.commit('update_map_settings', {'zoom': zoom})
			},
			centerUpdated (center) {
				this.$store.commit('update_map_settings', {'center': center})
			},
			handleResize() {
				// map width
				this.map_dimensions.width = (window.innerWidth - 400) + 'px' // 400 is hardcoded tabs width..

				// map height
				let available_height = window.innerHeight - 50 // 50 is hardcoded nav height..
				this.map_dimensions.height = available_height + 'px'
			},
			day_activities_with_markers(day_index) {
				let markers = []
				let itinerary = this.$store.state.active_trip.itinerary[day_index]

				if(itinerary.activities) {
					for (let n = 0; n < itinerary.activities.length; n++) {
						if(itinerary.activities[n].marker_coordinates != null) {
							itinerary.activities[n].marker_latlng = [ itinerary.activities[n].marker_coordinates.lat, itinerary.activities[n].marker_coordinates.lng ]
							markers.push(itinerary.activities[n])
						}
					}
				}
				console.log(markers)
				return markers
			},
		},
		computed: {
			map_center() {
				let center = null
				if(this.$store.state.active_trip.map_center)
					return this.$store.state.active_trip.map_center

				return this.$store.state.map.center
			},
			map_zoom() {
				let zoom = null
				if(this.$store.state.active_trip.map_zoom)
					return this.$store.state.active_trip.map_zoom

				return this.$store.state.map.zoom
			}
		},
		mounted() {
			window.addEventListener('resize', this.handleResize)
			this.handleResize()
			this.$nextTick(function () {
				this.$refs.map.mapObject.invalidateSize()
			})
		},
		destroyed() {
			window.removeEventListener('resize', this.handleResize)
		}
	}
</script>

<style>
</style>