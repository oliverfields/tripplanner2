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
		<l-tile-layer :url="url"></l-tile-layer>
		<l-marker :lat-lng="this.map_center"></l-marker>
		<l-marker :lat-lng="this.$store.getters.map_settings.center"></l-marker>
	</l-map>
</template>

<script>
import {LMap, LTileLayer, LMarker} from 'vue2-leaflet'

export default {
	name: 'Map',
	components: { LMap, LTileLayer, LMarker },
	data() {
		return {
			url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
			map_dimensions: {
				width: 0,
				height: 0
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