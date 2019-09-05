<template>
	<div class="container-fluid">
		<form>
			<div class="row">
				<div class="col-md-12">
					<div class="form-group">
						<label for="map_center_coordinates">Center</label>
						<input
							v-model="latlng"
							ref="latlng"
							:class="latlng_class"
							id="map_center_coordinates"
							aria-describedby="coordinates-help"
						/>
						<small id="coordinates-help" class="form-text text-muted">Latitude, Longitude</small>
						<div class="invalid-feedback">Format must be xx.xxxx,yy.yyyy</div>
					</div>
					<div class="form-group">
						<label for="map_zoom">Zoom</label>
						<select
							v-model="zoom"
							id="map_zoom"
							class="form-control"
							aria-describedby="zoom-help"
						>
							<option disabled value="">Please select one</option>
							<option value="1">1 - No zoom</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
							<option value="9">9</option>
							<option value="10">10</option>
							<option value="11">11</option>
							<option value="12">12</option>
							<option value="13">13</option>
							<option value="14">14</option>
							<option value="15">15</option>
							<option value="16">16</option>
							<option value="17">17</option>
							<option value="18">18</option>
							<option value="19">19</option>
							<option value="20">20 - Maximum</option>
						</select>
						<small id="zoom-help" class="form-text text-muted">Some maps may not support high zoom</small>
					</div>
					<div class="form-group">
						<a style="margin-top: 2rem; display: block;" href="#" @click="use_current_map_settings"><font-awesome-icon icon="map-marked-alt" /> Use current map center and zoom</a>
					</div>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
	export default {
		name: 'MapTab',
		data() {
			return {
				latlng_tmp_value: this.tp_latlng_2_str(this.$store.state.active_trip.map_center)
			}
		},
		components: {
		},
		computed: {
			latlng_class: function() {
				let latlng_valid = false
				if(this.tp_str_2_latlng(this.latlng_tmp_value))
					latlng_valid = true
				return {
					'form-control': true,
					'is-invalid': !latlng_valid
				}
			},
			latlng: {
				get() {
					return this.latlng_tmp_value
				},
				set(value) {
					// If tmp value is valid latlng update store, else just update tmp value, so don't mess up bindings to map
					this.latlng_tmp_value = value
					let action = 'add'

					let latlng_object = this.tp_str_2_latlng(value)
					if(latlng_object) {
						this.$store.commit('update_active_trip', { property: 'map_center', value: latlng_object })
						action = 'remove'
					}

					this.$store.commit('error_registry', {action: action, tmp_id: this.$store.state.active_trip.tmp_id + '_map_center'})
				}
			},
			zoom: {
				get() {
					return this.$store.state.active_trip.map_zoom
				},
				set(value) {
					this.$store.commit('update_active_trip', { property: 'map_zoom', value: value })
				}
			}
		},
		methods: {
			use_current_map_settings() {
				this.$store.commit('update_active_trip', {
					property: 'map_zoom',
					value: this.$store.getters.map_settings.zoom
				})
				let map_center = this.$store.getters.map_settings.center
				
				this.$store.commit('update_active_trip', {property: 'map_center', value: map_center})
				this.latlng_tmp_value = this.tp_latlng_2_str(map_center)
			},
		}
	}
</script>

<style>
</style>