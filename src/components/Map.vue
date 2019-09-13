<template>
	<div id="map"></div>
<!--
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
		>
			<v-marker
				v-for="activity in day_activities_with_markers(day_index)"
				v-bind:lat-lng="latlng_array(activity)"
				:icon="marker_icon(activity)"
				@click="show_activity_tab(activity)"
			>
!!--
				:title="marker_title(day, activity)"
				<v-popup :content="activity_popup(day, activity)"></v-popup>
--!!
			</v-marker>
		</v-layer-group>
	</v-map>
-->
</template>

<script>
	// Fine guide: https://github.com/KoRiGaN/Vue2Leaflet/blob/master/examples/src/components/Example.vue

	//import '../../public/js/leaflet.js' -> Included in html instead..
	//import '../../public/css/leaflet.css'
	import '../../public/js/leaflet-plotter.js'
	import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css'
	import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.js'

	const L = window.L
	var _map = null
	const _baselayers_conf = {
		opentopo: {
			url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
			attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
			name: 'Topo',
		},
		esriArieal: {
			url: 'https://server.arcgisonline.com/ArcGIS/rest/services' + '/World_Imagery/MapServer/tile/{z}/{y}/{x}',
			attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, ' + 'USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the' + ' GIS User Community',
			name: 'Arieal',
		}
	}


	export default {
		name: 'Map',
		components: {
		},
		data() {
			return {

			}
		},
		computed: {
			active_route() {
				return this.$store.state.map.active_route
			},
			map_registry() {
				return this.$store.state.map.registry
			},
		},
		methods: {
			handle_resize() {
				let nav_height = 50 // 50 is hardcoded nav height..
				let tabs_width = 400 // 400 is hardcoded tabs width..

				// map width
				$('#map').css('width', (window.innerWidth - tabs_width) + 'px')

				// map height
				let available_height = window.innerHeight - nav_height
				$('#map').css('height', available_height + 'px')

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
			setup_map() {
				_map = new L.Map(
					'map',
					{
						center: [60.001046, 10.623779],
						zoom: 8,
						layers: [
							new L.TileLayer(_baselayers_conf['opentopo'].url, {
								attribution: _baselayers_conf['opentopo'].attribution
							})
						]
					}
				)
				window.addEventListener('resize', this.handle_resize)
				this.handle_resize()

				_map.zoomControl.setPosition('bottomright')

				let base_maps = {
					"Topo": new L.TileLayer(_baselayers_conf['opentopo'].url, {
						attribution: _baselayers_conf['opentopo'].attribution
					}),
					"Arieal": new L.TileLayer(_baselayers_conf['esriArieal'].url, {
						attribution: _baselayers_conf['esriArieal'].attribution
					})
				}

				L.control.layers(base_maps).addTo(_map);
			},
		},
		mounted() {
			this.setup_map()

			this.$nextTick(function () {
				_map.invalidateSize()
			})
		},
		destroyed() {
			window.removeEventListener('resize', this.handle_resize)
		},
		watch: {
			map_registry: function() {
				console.log('map registry changed')
			},
			active_route: function() {
				let ar = this.$store.state.map.active_route
				//console.log(this.$refs.map.mapObject)


let i = 0
this.$refs.map.mapObject.eachLayer(function(layer) {
	//console.log('_leflet_id: ' + layer._leaflet_id)
	//console.log(layer)
	i += 1
});
console.log('LAYERS BEFORE: ' + i)

				// ----------------------------------------
				// Stop plotting
				// ----------------------------------------
				if(ar == null) {
					window.L.DomUtil.removeClass(this.$refs.map.mapObject._container,'crosshair-cursor-enabled');

					this.$store.dispatch('replace_route_points', {
						route: this.$store.state.active_trip.itinerary[
							this.$store.state.active_trip.itinerary_navigation.show_day_index
						].routes[
							this.$store.state.active_trip.itinerary_navigation.show_route_index
						],
						points: this.plotter.getPlotLatLngs(),
					})

					this.add_routes_to_map()

					this.plotter.clearPoints()
					this.plotter.setReadOnly(true)
				}

				// ----------------------------------------
				// Start plotting
				// ----------------------------------------
				else {
					// Remove route from map if already drawn
					if(ar.tmp_id in this.routes_map_polylines) {
						this.$refs.map.mapObject.removeLayer(this.routes_map_polylines[ar.tmp_id])
						delete this.routes_map_polylines[ar.tmp_id]
					}

					window.L.DomUtil.addClass(this.$refs.map.mapObject._container,'crosshair-cursor-enabled');

					// Make route editable
					if(ar.points.length > 0) {
						for (let i = 0; i < ar.points.length; i++) {
							this.plotter.addNewMarker(ar.points[i])
						}
					}
					this.plotter.setReadOnly(false)
				}

				console.log('active_route changed')
				console.log(this.$store.state.map.active_route)

let n = 0
this.$refs.map.mapObject.eachLayer(function(layer) {
	//console.log('_leflet_id: ' + layer._leaflet_id)
	//console.log(layer)
	n += 1
});
console.log('LAYERS After: ' + n)



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