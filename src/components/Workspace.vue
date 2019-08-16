<template>
	<splitpanes class="default-theme">
		<div id="menus" splitpanes-min="20" splitpanes-max="70" splitpanes-size="30">
			<tabs>
				<tab title="Trip">
					<button @click="log_trip_id">Log trip id</button>
<!--
					!!{{ this.$store.getters.getField('selected_trip_id') }}!!
					<h1 v-if="selected_trip_id === 'hola'">Default</h1>
					<h1 v-else>{{ active_trip.id }}</h1>
-->
					<input v-model="active_trip_id" />
				</tab>
				<tab title="Itinerary">Manage itinerary</tab>
			</tabs>
		</div>
		<div id="map" splitpanes-min="20" splitpanes-max="70" splitpanes-size="70">
			<h1>Map</h1>
		</div>
	</splitpanes>
</template>

<script>
import $ from 'jquery'
import Splitpanes from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { Tabs, Tab } from 'vue-slim-tabs'

export default {
	name: 'Workspace',
	components: {
		Splitpanes,
		Tabs,
		Tab
	},
	methods: {
		resize_workspace(){
			var nav_height = $('#nav').css('height');
			nav_height = nav_height.replace('px', ''); // Remove px from height
			var window_height = window.innerHeight;
			var remaining_height = window_height - nav_height;

			$('#menus').css('height', remaining_height + 'px');
			$('#map').css('height', remaining_height + 'px');
		},
		log_trip_id() {
			console.log('Trip id: ' + this.$store.getters.active_trip.id)
		}
	},
	mounted() {
		window.addEventListener('resize', this.resize_workspace)
		this.resize_workspace()
	},
	computed: {
		active_trip_id: function() {
			return this.$store.getters.active_trip.id
		}
	}
}

</script>

<style>
#menus {
padding: 1rem;
}
#map {
background-color: blue;
}
.splitpanes--vertical > .splitpanes__splitter {
min-width: 1rem;
border-left: none ! important;
margin-left: 0 ! important;
background-color: #343A40 ! important;
}
.vue-tablist {
list-style: none;
display: flex;
padding-left: 0;
}
.vue-tab {
padding: .5rem 1rem;
cursor: pointer;
user-select: none;
border: .1rem solid transparent;
position: relative;
bottom: -.1rem;
color: blue;
}
.vue-tab[aria-selected="true"] {
border: .1rem solid transparent;
border-bottom-color: #343A40;
}
.vue-tab[aria-disabled="true"] {
cursor: not-allowed;
color: #999;
}
</style>