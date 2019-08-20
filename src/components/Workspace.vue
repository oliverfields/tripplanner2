<template>
	<div>
	## {{ t }} ##
	<splitpanes class="default-theme">
		<div id="menus" splitpanes-min="20" splitpanes-max="70" splitpanes-size="30">
			<tabs>
				<tab title="Trip">
					<input @input="set_active_trip_id" name="active_trip_id">
					!! {{ active_trip_idx }} !!
					!! {{ this.$store.state.active_trip }} !!
					## {{ t }} ##
					<button @click="log_active_trip_id">Log active trip id</button>
				</tab>
				<tab title="Itinerary">Manage itinerary</tab>
			</tabs>
		</div>
		<div id="map" splitpanes-min="20" splitpanes-max="70" splitpanes-size="70">
			<h1>Map</h1>
		</div>
	</splitpanes>
	</div>
</template>

<script>
import $ from 'jquery'
import Splitpanes from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { Tabs, Tab } from 'vue-slim-tabs'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
	name: 'Workspace',
	components: {
		Splitpanes,
		Tabs,
		Tab
	},
	methods: {
		log_active_trip_id(){
			console.log('this.$store.getters.active_trip_id: ' + this.$store.getters.active_trip_id)
			console.log(this.$store.state.active_trip)
		},
		resize_workspace(){
			var nav_height = $('#nav').css('height');
			nav_height = nav_height.replace('px', ''); // Remove px from height
			var window_height = window.innerHeight;
			var remaining_height = window_height - nav_height;

			$('#menus').css('height', remaining_height + 'px');
			$('#map').css('height', remaining_height + 'px');
		},
		set_active_trip_id(e) {
			console.log('workspace.method.set_active_trip_id: ' + e.target.value)
			this.$store.dispatch('set_active_trip_id', e.target.value)
			console.log('Workspace.methods.set_active_trip_id: After action set_active_trip_id is now ' + this.$store.state.active_trip.id)
		}
	},
	mounted() {
		window.addEventListener('resize', this.resize_workspace)
		this.resize_workspace()
	},
	computed: {
		active_trip_idx() {
			console.log('YYYYYYYYYYYworkspace.computed.active_trip_id calling store state')
			//return this.$store.getters.active_trip_id
			return this.$store.state.active_trip.id
		},
		t() {
			return this.$store.state.active_trip.id
		}
	}
/*,
	watch: {
		active_trip_id: {
			handler () {
				console.log("!!Changed!!");
				//this.getConsumption();
			},
			deep: true
		}
	}
*/
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