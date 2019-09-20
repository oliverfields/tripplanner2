<template>
	<v-map
		id="map"
		ref="map"
		:style="{'width': this.map_dimensions.width, 'height': this.map_dimensions.height}"
		:zoom="this.map_zoom"
		:center="this.map_center"
		@update:zoom="zoom_updated"
		@update:center="center_updated"
	>
		<v-control-layer></v-control-layer>

		<v-tile-layer
			:url="url"
			:attribution="this.attribution"
		></v-tile-layer>

		<v-layer-group
			v-for="(day,day_index) in this.$store.state.active_trip.itinerary"
			layer-type="overlay"
			v-bind:name="day.date_pretty"
			:ref="day.tmp_id"
		>
			<v-marker
				v-for="activity in day_activities_with_markers(day_index)"
				:lat-lng="latlng_array(activity)"
				:icon="marker_icon(activity)"
				@click="show_activity_tab(activity)"
			>
			</v-marker>

			<v-polyline
				v-for="(route, route_index) in day_routes(day_index)"
				:lat-lngs="route.points"
				:color="route.color_hex"
				:visible="route.visible"
				@click="show_route(day_index, route_index)"
			 />
		</v-layer-group>

	</v-map>
</template>

<script>
	// Fine guide: https://github.com/KoRiGaN/Vue2Leaflet/blob/master/examples/src/components/Example.vue

	import 'leaflet/dist/leaflet.css'
	import {
		LMap,
		LTileLayer,
		LMarker,
		LPopup,
		LIcon,
		LControlLayers,
		LLayerGroup,
		LPolyline,
		LLatLng,
		LLatLngBounds
	} from 'vue2-leaflet'
	import '../../public/js/leaflet-plotter.js'
	import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css'
	import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.js'

	export default {
		name: 'Map',
		components: {
			'v-map': LMap,
			'v-tile-layer': LTileLayer,
			'v-marker': LMarker,
			'v-icon': LIcon,
			'v-control-layer': LControlLayers,
			'v-layer-group': LLayerGroup,
			'v-popup': LPopup,
			'v-polyline': LPolyline,
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
				},
				plotter: null,
				routes_map_polylines: {},
			}
		},
		methods: {
			show_route(day_index, route_index){
				this.$store.dispatch('show_route', {day_index: day_index, route_index: route_index})
				this.$store.commit('update_itinerary_navigation', {property: 'show_activity_index', value: null})
			},
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
			show_activity_tab(activity) {
				this.$store.dispatch('show_tab', activity)
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
					$('#map').append('<div id="map_center_crosshairs" />')
					$('#map_center_crosshairs').css({
						'background': 'url(images/MapCenterCoordIcon2.svg) 50% 50% no-repeat',
						'background-size': '30px 30px',
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
							markers.push(itinerary.activities[n])
						}
					}
				}
				return markers
			},
			day_routes(day_index) {
				let routes = []
				let day = this.$store.state.active_trip.itinerary[day_index]
				if(day.routes) {
					for (let n = 0; n < day.routes.length; n++) {
						if(Array.isArray(day.routes[n].points)) {
							routes.push(day.routes[n])
						}
					}
				}
				return routes
			},
			latlng_array(activity) {
				return [ activity.marker_coordinates.lat, activity.marker_coordinates.lng ]
			},
			points_distance_m(points) {
				let mDistanse = 0
				let length = points.length

				for (let i = 1; i < length; i++) {
					let a = L.latLng(points[i])
					let b = L.latLng(points[i - 1])
					mDistanse += a.distanceTo(b)
				}
				return mDistanse
			},
		},
		computed: {
			map_center() {
				return [this.$store.state.map.center.lat, this.$store.state.map.center.lng]
			},
			map_zoom() {
				return this.$store.state.map.zoom
			},
			map_pan_to() {
				return this.$store.state.map.pan_to
			},
			map_bounds() {
				return this.$store.state.map.bounds
			},
			active_route() {
				return this.$store.state.map.active_route
			},
		},
		mounted() {
			window.addEventListener('resize', this.handleResize)
			this.handleResize()
			this.$nextTick(function () {
				this.$refs.map.mapObject.invalidateSize()
			})
			this.$refs.map.mapObject.zoomControl.setPosition('bottomright')

			this.plotter = L.Polyline.Plotter([],{weight: 5}).addTo(this.$refs.map.mapObject);
			this.plotter.setReadOnly(true)
		},
		destroyed() {
			window.removeEventListener('resize', this.handleResize)
		},
		watch: {
			map_pan_to: function() {
				this.$refs.map.mapObject.panTo(this.map_pan_to)
			},
			map_bounds: function() {
				this.$refs.map.mapObject.fitBounds(this.map_bounds)
			},
			active_route: function() {
				let ar = this.$store.state.map.active_route

				// ----------------------------------------
				// Stop plotting
				// ----------------------------------------
				if(ar == null) {
					window.L.DomUtil.removeClass(this.$refs.map.mapObject._container,'crosshair-cursor-enabled');
					// Show route ployline
					this.$store.commit('update_active_route', { property: 'visible', value: true })

					// Set distances, metric, ofcourse;)
					let distance_m = this.points_distance_m(this.plotter.getPlotLatLngs())
					let distance_km = Number(parseFloat(Math.round(distance_m) / 1000).toFixed(1))
					this.$store.commit('update_active_route', { property: 'distance_m', value: distance_m })
					this.$store.commit('update_active_route', { property: 'distance_km', value: distance_km })

					// Set polyline bounds
					let bounds = L.latLngBounds(this.plotter.getPlotLatLngs())
					bounds = [
						[bounds._northEast.lat, bounds._northEast.lng],
						[bounds._southWest.lat, bounds._southWest.lng]
					]
					this.$store.commit('update_active_route', { property: 'map_bounds', value: bounds })

					this.$store.dispatch('replace_route_points', {
						route: this.$store.state.active_trip.itinerary[
							this.$store.state.active_trip.itinerary_navigation.show_day_index
						].routes[
							this.$store.state.active_trip.itinerary_navigation.show_route_index
						],
						points: this.plotter.getPlotLatLngs(),
					})

					this.plotter.clearPoints()
					this.plotter.setReadOnly(true)
				}

				// ----------------------------------------
				// Start plotting
				// ----------------------------------------
				else {
/*
					// Remove route from map if already drawn
					if(ar.tmp_id in this.routes_map_polylines) {
						this.$refs.map.mapObject.removeLayer(this.routes_map_polylines[ar.tmp_id])
						delete this.routes_map_polylines[ar.tmp_id]
					}
*/
					// Hide route ployline
					this.$store.commit('update_active_route', { property: 'visible', value: false })
					window.L.DomUtil.addClass(this.$refs.map.mapObject._container,'crosshair-cursor-enabled');

					// Load plotter with route points and make editable
					if(ar.points.length > 0) {
						for (let i = 0; i < ar.points.length; i++) {
							this.plotter.addNewMarker(ar.points[i])
						}
					}
					this.plotter.setReadOnly(false)
				}
			}
		},
	}
</script>

<style>
	.awesome-marker i {
		margin: 12px 10px ! important;
	}
	.tp-popup {
		font-size: .8rem;
	}
	.tp-popup .description {
		font-weight: bold;
		color: #666;
		margin-top: 1rem;
	}
	.leaflet-container.crosshair-cursor-enabled {
		cursor: crosshair;
	}
	.leaflet-marker-icon.leaflet-interactive {
		border-radius: 50%;
		cursor: crosshair;
	}
</style>