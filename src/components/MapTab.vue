<template>
	<div class="container-fluid">
		<form>
			<div class="row">
				<div class="col-md-12">
					<div class="form-group">
						<label for="map_center_coordinates">Center</label>
						<input :value="active_trip_map_center" ref="active_trip_map_center" class="form-control" id="map_center_coordinates" aria-describedby="coordinates-help" placeholder="Latitude, Longitude"/>
						<small id="coordinates-help" class="form-text text-muted">Latitude, Longitude</small>
					</div>
					<div class="form-group">
						<label for="map_zoom">Zoom</label>
						<input :value="this.$store.state.active_trip.map_zoom" class="form-control" id="map_zoom" ref="active_trip_map_zoom" />
					</div>
					<div class="form-group">
						<a style="margin-top: 1rem; display: block;" href="#" @click="use_current_map_settings"><font-awesome-icon icon="map-marked-alt" /> Use current map center and zoom</a>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-md-12">
					<div class="form-group">
						<a @click="save_map_settings" href="#" class="btn btn-success"><font-awesome-icon icon="save" /> Save</a>
					</div>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
export default {
	name: 'MapTab',
	components: {
	},
	computed: {
		active_trip_map_center() {
			return this.tp_latlng_2_str(this.$store.state.active_trip.map_center)
		}
	},
	methods: {
		save_map_settings: function() {
			this.$store.commit('update_active_trip', {
				property: 'map_center',
				value: this.tp_str_2_latlng(this.$refs.active_trip_map_center.value)
			})
			this.$store.commit('update_active_trip', {
				property: 'map_zoom',
				value: this.$refs.active_trip_map_zoom.value
			})
		},
		use_current_map_settings() {
			this.$store.commit('update_active_trip', {
				property: 'map_zoom',
				value: this.$store.getters.map_settings.zoom
			})
			this.$store.commit('update_active_trip', {property: 'map_center', value: this.$store.getters.map_settings.center})
		}
	}
}
</script>

<style>
</style>