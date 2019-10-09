<template>
	<div>
		<v-map
			id="map"
			ref="map"
			:style="{'width': this.map_dimensions.width + 'px', 'height': this.map_dimensions.height + 'px'}"
			:zoom="this.map_zoom"
			:center="this.map_center"
			@update:zoom="zoom_updated"
			@update:center="center_updated"
			@click="toggle_map_menu"
		>
			<v-control-layer></v-control-layer>

			<v-tile-layer
				:url="url"
				:attribution="this.attribution"
			></v-tile-layer>

			<v-layer-group ref="route_layer" />

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
					<v-tooltip>{{ activity.description }}, {{ day.date_pretty }}</v-tooltip>
				</v-marker>

				<v-polyline
					v-for="(route, route_index) in day_routes(day_index)"
					:lat-lngs="route.points"
					:color="route.color_hex"
					:visible="route.visible"
					@click="show_route(day_index, route_index)"
				 >
					<v-tooltip>{{ route.name }}, {{ day.date_pretty }}</v-tooltip>
				</v-polyline>
			</v-layer-group>

		</v-map>

		<div id="map_menu">
			<div class="content">
				<i class="fa fa-times map_menu_close_icon" title="Close" @click="toggle_map_menu" />
				<select
					id="activity_day"
					v-model="selected_day_tmp_id"
					class="form-control"
				>
					<option
						v-for="(activity_day, activity_day_index) in this.$store.state.active_trip.itinerary"
						:value="activity_day.tmp_id"
						 :selected="activity_day_index === 0"
					>{{ activity_day.date_pretty }}</option>
				</select>
				<a
					href="#"
					@click="add_activity_marker()"
					class="btn btn-primary"
				>
					<i class="fa fa-map-marker" title="Add marker" /> Add marker
				</a>
				<a
					href="#"
					@click="add_route()"
					class="btn btn-primary"
				>
					<i class="fa fa-route" title="Draw route" /> Draw route
				</a>
			</div>
			<div class="arrow-down"></div>
		</div>

	</div>
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
		LLatLngBounds,
		LTooltip
	} from 'vue2-leaflet'
	import { auth, s3, s3_bucket } from '@/main'
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
			'v-tooltip': LTooltip
		},
		data() {
			return {
				url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
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
				map_menu: {
					coordinates: {
						lat: null,
						lng: null
					},
				},
				selected_day_tmp_id: this.$store.state.active_trip.itinerary.length ? this.$store.state.active_trip.itinerary[0].tmp_id : '', // This is needed to set selectbox default select first item.. GULP!
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
			handle_map_resize() {
				let bootstrap_breakpoint = 768 // XSmall <576px, Small ≥576px, Medium ≥768px, Large ≥992px, XLarge ≥1200px
				let available_width = window.innerWidth

				let nav_height = $('#nav').outerHeight()
				if($('#navbars-site-menu').css('display') != 'none' && available_width < bootstrap_breakpoint) {
					nav_height = nav_height - $('#navbars-site-menu').outerHeight()
				}

				let available_height = window.innerHeight - nav_height
				let tabs_pane_max_width = 400

				// Position panes just under navigation and set height

				$('#tabs-pane').css('top', nav_height + 'px')
				$('#tabs-pane').css('height', available_height + 'px')
				$('#map-pane').css('top', nav_height + 'px')
				$('#map-pane').css('height', available_height + 'px')
				this.map_dimensions.height = available_height

				// Large screen, show only one pane
				if (available_width < bootstrap_breakpoint) {
					$('#tabs-pane').css('width', available_width + 'px')
					$('#tabs-pane').css('visibility', 'visible')
					$('#map-pane').css('visibility', 'hidden')
					$('#map-pane').css('width', available_width + 'px')
					$('#map-pane').css('left', 0)
					this.map_dimensions.width = available_width
				}
				// Large screen, show both tabs pane and map pane
				else {
					let map_width = available_width - tabs_pane_max_width
					$('#tabs-pane').css('width', tabs_pane_max_width + 'px')
					$('#tabs-pane').css('visibility', 'visible')
					$('#map-pane').css('visibility', 'visible')
					$('#map-pane').css('left', tabs_pane_max_width)
					$('#map-pane').css('width', map_width + 'px')
					this.map_dimensions.width = map_width
				}

				let map_horizontal_center = this.map_dimensions.width / 2
				let map_vertical_center = this.map_dimensions.height / 2

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
			toggle_map_menu(event) {
				let map_menu = $('#map_menu')
				let map = this.$refs.map.mapObject

				if(map_menu.css('display') == 'none') {
					// Disable map moving
					map.dragging.disable()
					map.touchZoom.disable()
					map.doubleClickZoom.disable()
					map.scrollWheelZoom.disable()
					map.boxZoom.disable()
					map.keyboard.disable()
					if (map.tap) map.tap.disable()
					document.getElementById('map').style.cursor='default'

					// Set clicked latlng
					let latlng = event.latlng
					this.map_menu.coordinates = latlng

					// Show menu
					let click_x = event.originalEvent.clientX
					let click_y = event.originalEvent.clientY
					let menu_height = map_menu.outerHeight()
					let menu_width = map_menu.outerWidth()

					let top_position = click_y - menu_height;
					let left_position = click_x - (menu_width / 2);

					map_menu.css('top', top_position)
					map_menu.css('left', left_position)
					map_menu.css('display', 'block')
				}
				else {
					// Enable map moving
					map.dragging.enable()
					map.touchZoom.enable()
					map.doubleClickZoom.enable()
					map.scrollWheelZoom.enable()
					map.boxZoom.enable()
					map.keyboard.enable()
					if (map.tap) map.tap.enable()
					document.getElementById('map').style.cursor='grab'

					// Hide menu
					map_menu.css('display', 'none')
				}
				//this.markers.push(event.latlng);
			},
			add_activity_marker() {
				let day_tmp_id = this.selected_day_tmp_id
				let day = null
				let itinerary = this.$store.state.active_trip.itinerary
				let day_index = null


				// get day
				for (let d = 0; d < itinerary.length; d++) {
					if(itinerary[d].tmp_id == day_tmp_id) {
						day = itinerary[d]
						day_index = d
					}
				}

				let payload = {
					day: day,
					day_index: day_index,
					marker_coordinates: { lat: Number(this.map_menu.coordinates.lat), lng: Number(this.map_menu.coordinates.lng) },
				}

				this.$store.dispatch('add_activity_and_show', payload)
				this.toggle_map_menu()
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
			window.addEventListener('resize', this.handle_map_resize)
			this.handle_map_resize()
			this.$nextTick(function () {
				this.$refs.map.mapObject.invalidateSize()
			})
			this.$refs.map.mapObject.zoomControl.setPosition('bottomright')

			this.plotter = L.Polyline.Plotter([],{weight: 5}).addTo(this.$refs.map.mapObject)
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
				if(this.map_bounds)
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
	#tabs-pane {
		overflow-y: scroll;
		position: absolute;
		top: 75;
		left: 0;
		margin: 0 ! important;
		padding: 1rem ! important;
	}
	#map-pane {
		padding: 0 ! important;
		margin: 0 ! important;
		position: absolute;
		top: 75;
		left: 400;
	}
	#map_menu {
		display: none;
		position: fixed;
		z-index: 9999;
		width: 140px;
	}
	#map_menu .content {
		background-color: white;
		padding: .4rem;
		border-radius: 3px;
	}
	.arrow-down {
		margin-left: 61.35px;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 17.3px 10px 0 10px;
		border-color: #ffffff transparent transparent transparent;
	}
	#map_menu .content a, #map_menu .content select {
		width: 100%;
		margin: .2rem 0;
		font-size: .8rem !important;
		padding: .2rem;
	}
	.map_menu_close_icon {
		color: #999;
		float: right;
		margin: -.3rem 0 .2rem 0 !important;
	}
</style>