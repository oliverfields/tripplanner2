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

			<div class="row">
				<div class="col-md-12">
					<div class="form-group">
						<a
							@click="save_map_settings"
							href="#"
							class="btn btn-success"
							:class="save_button_classes"
						><font-awesome-icon icon="save" /> Save</a>
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
				latlng_valid: true
			}
		},
		components: {
		},
		computed: {
			save_button_classes: function() {
				return {
					btn: true,
					'btn-success': true,
					disabled: !this.latlng_valid
				}
			},
			latlng_class: function() {
				return {
					'form-control': true,
					'is-invalid': !this.latlng_valid
				}
			},
			latlng: {
				get() {
					let latlng_str = this.tp_latlng_2_str(this.$store.state.active_trip.map_center)
					if(latlng_str) {
						this.latlng_valid = true
						return latlng_str
					}
					else {
						this.latlng_valid = false
						return this.$store.state.active_trip.map_center
					}
				},
				set(value) {
					let latlng_object = this.tp_str_2_latlng(value) // Convert string from input field to latlng object
					if(latlng_object) {
						this.$store.commit('update_active_trip', { property: 'map_center', value: latlng_object })
						this.latlng_valid = true
					}
					else {
						this.latlng_valid = false
					}
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
			save_map_settings: function() {
				if(this.latlng_valid) {
					console.log('Saving map')
				}
				else {
					console.log('Form invalid, aborting save')
				}
/*
				this.$store.commit('update_active_trip', {
					property: 'map_center',
					value: this.tp_str_2_latlng(this.$refs.active_trip_map_center.value)
				})
				this.$store.commit('update_active_trip', {
					property: 'map_zoom',
					value: this.$refs.active_trip_map_zoom.value
				})
*/
			},
			use_current_map_settings() {
				this.$store.commit('update_active_trip', {
					property: 'map_zoom',
					value: this.$store.getters.map_settings.zoom
				})
				this.$store.commit('update_active_trip', {property: 'map_center', value: this.$store.getters.map_settings.center})
			},
			validate_latlng: function() {
				console.log('validating latlng')
				return true
			},
		}
	}
</script>

<style>
</style>