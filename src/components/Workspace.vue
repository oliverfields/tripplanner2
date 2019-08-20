<template>
	<div id="workspace">
		<Tabs />
		<Map />
		<div id="map">
			<h1>Map</h1>
		</div>
	</div>
</template>

<script>
import $ from 'jquery'
import Tabs from '@/components/Tabs'
import Map from '@/components/Map'

export default {
	name: 'Workspace',
	components: {
		Tabs,
		Map
	},
	methods: {
		resize_workspace(){
			var nav_height = $('#nav').css('height');
			nav_height = nav_height.replace('px', ''); // Remove px from height
			var window_height = window.innerHeight;
			var remaining_height = window_height - nav_height;

			$('#menus').css('height', remaining_height + 'px');
			$('#map').css('height', remaining_height + 'px');
		}
	},
	mounted() {
		window.addEventListener('resize', this.resize_workspace)
		this.resize_workspace()
	},
	computed: {
	}
}
</script>

<style>
</style>