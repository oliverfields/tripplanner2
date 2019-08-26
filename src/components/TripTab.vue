<template>
	<div class="container-fluid">
		<form>
			<div class="row">
				<div class="col-md-12">
					<div class="form-group">
						<label for="trip_name">Name</label>
						<input
							type="text"
							:class="trip_name_class"
							id="trip_name"
							v-model="trip_name"
						>
						<div class="invalid-feedback">Name too short</div>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-md-12">
					<div class="form-group date-input">
						<label for="trip_start_date">Start date</label>
						<div class="control-group">
							<Datepicker
								:value="trip_start_date"
								@closed="this.trip_start_date_valid"
								format="yyyy-MM-dd"
								monday-first
								name="trip_start_date"
								
							></Datepicker>
						</div>
						<div class="invalid-feedback" :style="trip_start_date_datepicker_style">Date cannot be empty and must be before End date</div>
						
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<div class="form-group date-input">
						<label for="trip_end_date">End date</label>
						<Datepicker :value="trip_end_date" format="yyyy-MM-dd" monday-first bootstrap-styling name="trip_end_date"></Datepicker>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-md-12">
					<div class="form-group">
						<a @click="save_trip" href="#" class="btn btn-success"><font-awesome-icon icon="save" /> Save</a>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-md-12">
					<div class="form-group">
						<div class="form-group-danger">
							<h1>Delete trip</h1>
							<p><font-awesome-icon style="color: red;" icon="exclamation-triangle" /> Deleted trips can <strong>not</strong> be undeleted</p>
							<a @click="delete_trip" id="delete_trip" href="#" class="btn btn-danger"><font-awesome-icon icon="trash-alt" /> Delete</a>
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';

export default {
	name: 'TripTab',
	components: {
		Datepicker
	},
	computed: {

		// trip_name

		trip_name: {
			get() {
				return this.$store.state.active_trip.name
			},
			set(value) {
				this.$store.commit('update_active_trip', { property: 'name', value: value })
			}
		},
		trip_name_valid: function() {
			return (this.trip_name.length < 1)
		},
		trip_name_class: function() {
			return {
				'form-control': true,
				'is-invalid': this.trip_name_valid
			}
		},


		// trip_start_date
		trip_start_date: {
			get() {
				return this.tp_date_format(this.$store.state.active_trip.start_date)
			},
			set(value) {
				this.$store.commit('update_active_trip', { property: 'start_date', value: value })
			}
		},


		// trip_end_date
		trip_end_date: {
			get() {
				return this.tp_date_format(this.$store.state.active_trip.end_date)
			},
			set(value) {
				this.$store.commit('update_active_trip', { property: 'end_date', value: value })
			}
		}
	},
	methods: {
		delete_trip: function() {
			this.$store.dispatch('delete_active_trip')
		},
		save_trip: function() {
			console.log(this.trip_start_date)
			if(
				this.trip_name_error
				|| this.trip_start_date_error
			) {
				console.log('Errors found, NOT saving trip')
			}
			else {
				console.log('No errors, saving trip')
			}
		},
		trip_start_date_valid: function() {
			let start_date = this.tp_date_from_str(this.trip_start_date)
			let end_date = this.tp_date_from_str(this.trip_end_date)

			console.log('Comparing: ' + start_date + ' <= ' + end_date)
			console.log(start_date <= end_date)
			return start_date <= end_date
		},
		trip_start_date_datepicker_style: function() {
			if(this.trip_start_date_valid) {
				return "display: block;"
			}
			else {
				return "display: none;"
			}
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
</style>