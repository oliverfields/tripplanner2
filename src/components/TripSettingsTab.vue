<template>
	<div>
		<div class="form-group" style="margin-top: -1.5rem;">
			<label for="trip_name">Trip name</label>
			<input
				type="text"
				:class="trip_name_class"
				id="trip_name"
				v-model="trip_name"
			>
			<div class="invalid-feedback"><i class="fa fa-exclamation-triangle" />Name can only use letters and numbers</div>
		</div>

		<div class="form-group">
			<label for="trip_name">Map</label>
			<a
				style="margin-top: 1rem; display: block;"
				title="Set default map center and zoom for trip"
				class="btn btn-primary"
				href="#" @click="use_current_map_settings"
			><i class="fa fa-map-marked-alt" /> Use current map center and zoom as default settings</a>
		</div>

		<div class="form-group">
			<label for="map_center_coordinates">Default map center</label>
			<input
				v-model="latlng"
				ref="latlng"
				:class="latlng_class"
				id="map_center_coordinates"
				aria-describedby="coordinates-help"
			/>
			<small id="coordinates-help" class="form-text text-muted">Latitude, Longitude</small>
			<div class="invalid-feedback"><i class="fa fa-exclamation-triangle" /> DD coordinates, e.g. xx.xxxx,yy.yyyy</div>
		</div>

		<div class="form-group">
			<label for="map_zoom">Default map zoom</label>
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
				<option value="20">20 - Maximum zoom</option>
			</select>
			<small id="zoom-help" class="form-text text-muted">Some maps may not support high zoom</small>
		</div>


		<hr style="margin-top: 3rem;" />

		<div class="form-group">
			<div class="form-group-danger">
				<h1>Delete trip</h1>
				<p><i class="danger fa fa-exclamation-triangle" /> Delete <strong>cannot</strong> be undone</p>
				<click-confirm button-size="sm" :messages="{ title: 'Delete \'' + this.$store.state.active_trip.name + '\'?'}">
					<a @click="delete_trip" id="delete_trip" href="#" class="btn btn-danger"><i class="fa fa-times" /> Delete {{ this.$store.state.active_trip.name }}</a>
				</click-confirm>
			</div>
		</div>
	</div>
</template>

<script>

	export default {
		name: 'TripSettingsTab',
		components: {
		},
		data() {
			return {
				latlng_tmp_value: this.tp_latlng_2_str(this.$store.state.active_trip.map_center)
			}
		},
		computed: {
			trip_name: {
				get() {
					return this.$store.state.active_trip.name
				},
				set(value) {
					this.$store.commit('update_active_trip', { property: 'name', value: value })
				}
			},
			trip_name_class: function() {
				return {
					'form-control': true,
					'is-invalid': !this.validate_trip_name()
				}
			},
			start_date: {
				get() {
					return this.$store.state.active_trip.start_date
				},
				set(value) {
					this.$store.dispatch('update_active_trip', { property: 'start_date', value: value })
				}
			},
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
						this.$store.commit('update_map_settings', { center: latlng_object })
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
					this.$store.commit('update_map_settings', { zoom: value })
				}
			},
		},
		methods: {
			delete_trip: function() {
				this.$store.dispatch('delete_active_trip')
			},
			validate_trip_name: function() {
				let action = 'remove'
				let re = this.$XRegExp("^[\\p{L}\\d\ \\_\\-]+$")
				let is_valid = re.test(this.trip_name)

				if(!is_valid)
					action = 'add'
				this.$store.commit('error_registry', {action: action, tmp_id: this.$store.state.active_trip.tmp_id + '_name'})

				return is_valid
			},
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
	.form-group-danger {
		padding: 2rem 0;
	}
	.form-group-danger h1{
		font-size: 2rem;
	}
	.date-input input {
		border: none;
		background-color: none;
		color: #228CFF;
	}
	.datepicker-input, .datepicker-input input {
		cursor: pointer;
	}
	.datepicker-input input {
	}
	.vdp-datepicker {
		display: inline-block;
		min-width: 50px;
	}
</style>