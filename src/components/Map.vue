<template>

<!--
	<div id="map">
		<div class="info" style="height: 15%">
			<span>Center: {{ center }}</span>
			<span>Zoom: {{ zoom }}</span>
			<span>Bounds: {{ bounds }}</span>
		</div>


			//style="height: 100px; width: 100px"
:style="{'width': map_width, 'height': map_height}"

:style="{'width': map_width, 'height': map_height}"

-->
		<l-map
			id="map"
			ref="map"
			style="height: 100px; width: 100px"
			:zoom="zoom"
			:center="center"
			@update:zoom="zoomUpdated"
			@update:center="centerUpdated"
			@update:bounds="boundsUpdated"
		>
			<l-tile-layer :url="url"></l-tile-layer>
			<l-marker :lat-lng="center"></l-marker>
		</l-map>
<!--
	</div>
-->
</template>

<script>
import {LMap, LTileLayer, LMarker} from 'vue2-leaflet'

export default {
	name: 'Map',
	props: [
		'map_dimensions'
	],
	components: { LMap, LTileLayer, LMarker },
	data() {
		return {
			url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
			zoom: 13,
			center: [52.529562,  13.413047],
			bounds: null
		}
	},
	methods: {
		zoomUpdated (zoom) {
			this.zoom = zoom
		},
		centerUpdated (center) {
			this.center = center
		},
		boundsUpdated (bounds) {
			this.bounds = bounds
		}
	},
	watch: { 
		map_dimensions: function(new_dimensions, old_dimensions) {
			console.log(this.$refs.map.mapObject)
			console.log('Prop changed: ', new_dimensions, ' | was: ', old_dimensions)
			this.$refs.map.style.width = new_dimensions.width
			this.$refs.map.style.height = new_dimensions.height
			this.$refs.map.mapObject.invalidateSize()
		}
	}
}
</script>

<style>
</style>