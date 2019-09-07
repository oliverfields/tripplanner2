<template>
	<l-map
		id="map"
		ref="map"
		:style="{'width': this.map_dimensions.width, 'height': this.map_dimensions.height}"
		:zoom="this.map_zoom"
		:center="this.map_center"
		@update:zoom="zoom_updated"
		@update:center="center_updated"
	>
		<l-control-layers></l-control-layers>

		<l-tile-layer
			:url="url"
			:attribution="this.attribution"
		></l-tile-layer>

<!--
		<l-marker :lat-lng="this.$store.getters.map_settings.center">
			<l-icon
				:icon-size="this.center_crosshairs_icon.size"
				:icon-anchor="this.center_crosshairs_icon.anchor"
				:icon-url="this.center_crosshairs_icon.image_url"
			/>
		</l-marker>
-->

		<l-layer-group
			v-for="(day,day_index) in this.$store.state.active_trip.itinerary"
			layer-type="overlay"
			v-bind:name="day.date_pretty"
		>
			<l-marker
				v-for="activity in day_activities_with_markers(day_index)"
				v-bind:lat-lng="latlng_array(activity)"
				:icon="marker_icon(activity)"
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

	import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css'
	import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.js'

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
			marker_icon(activity) {
				let icon_name = 'circle'
				let icon_color = 'red'

				if(activity.marker_icon)
					icon_name = activity.marker_icon

				if(activity.marker_color)
					icon_color = activity.marker_color

				let icon = L.AwesomeMarkers.icon({
					prefix: 'fa',
					icon: icon_name,
					markerColor: icon_color
				})

				return icon
			},
			zoom_updated () {
				this.$store.commit('update_map_settings', {'zoom': this.$refs.map.mapObject._zoom})
			},
			center_updated (center) {
				this.$store.commit('update_map_settings', {'center': center})
			},
			handleResize() {
				let nav_height = 50 // 50 is hardcoded nav height..
				let tabs_width = 400 // 400 is hardcoded tabs width..

				// map width
				this.map_dimensions.width = (window.innerWidth - tabs_width) + 'px'

				// map height
				let available_height = window.innerHeight - nav_height
				this.map_dimensions.height = available_height + 'px'

				let map_horizontal_center = (window.innerWidth - tabs_width) / 2
				let map_vertical_center = (window.innerHeight - nav_height) / 2


				if(!$('#map_center_crosshairs').length) {
					$('#map').append('<object type="image/svg+xml" data="images/MapCenterCoordIcon2.svg" id="map_center_crosshairs" />')
					$('#map_center_crosshairs').css({
						'position': 'relative',
						'width': '30px',
						'height': '30px',
						'margin-top': '-15px',
						'margin-left': '-15px',
						'z-index': 2000
					})
				}
				$('#map_center_crosshairs').css({'top': map_vertical_center + 'px', 'left': map_horizontal_center + 'px'})
			},
			day_activities_with_markers(day_index) {
				let markers = []
				let itinerary = this.$store.state.active_trip.itinerary[day_index]

				if(itinerary.activities) {
					for (let n = 0; n < itinerary.activities.length; n++) {
						if(itinerary.activities[n].marker_coordinates != null) {
							//itinerary.activities[n].marker_latlng = [ itinerary.activities[n].marker_coordinates.lat, itinerary.activities[n].marker_coordinates.lng ]
							markers.push(itinerary.activities[n])
						}
					}
				}
				return markers
			},
			latlng_array(activity) {
				return [ activity.marker_coordinates.lat, activity.marker_coordinates.lng ]
			}
		},
		computed: {
			map_center() {
				return [this.$store.state.map.center.lat, this.$store.state.map.center.lng]
			},
			map_zoom() {
				return this.$store.state.map.zoom
			}
		},
		mounted() {
			window.addEventListener('resize', this.handleResize)
			this.handleResize()
			this.$nextTick(function () {
				this.$refs.map.mapObject.invalidateSize()
			})
			this.$refs.map.mapObject.zoomControl.setPosition('bottomright')
		},
		destroyed() {
			window.removeEventListener('resize', this.handleResize)
		}
	}
</script>

<style>
	.awesome-marker i {
		margin: 12px 10px ! important;
	}
</style>