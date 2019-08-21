<template>
	<div id="workspace">
		<div v-if="active_trip">
			<div id="tabs_pane">
				<Tabs />
			</div>
			<div id="map_pane">
				<Map />
			</div>
		</div>
		<div v-else>
			<p>Go on trip, man;)</p>
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
		active_trip() {
			return this.$store.state.active_trip
		}
	}
}
</script>

<style>
#tabs_pane {
width: 30%;
float: left;
padding: 1rem;
}
#map_pane {
float: right;
width: 70%;
background-color: #DBF4FF;
}
</style>