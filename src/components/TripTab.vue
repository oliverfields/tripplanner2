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
						<div class="invalid-feedback">Name must be alpha numeric</div>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-md-12">
					<div class="form-group date-input">
						<label for="trip_start_date">Start date</label>
						<div class="control-group datepicker-input">
							<font-awesome-icon icon="calendar" />
							<Datepicker
								v-model="start_date"
								format="yyyy-MM-dd"
								monday-first
								style="display: inline-block;"
							></Datepicker>
						</div>
						<div class="invalid-feedback" style="display: block;" v-show="this.trip_dates_valid === false">Must be same or before End date</div>
						
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<div class="form-group date-input">
						<label for="trip_end_date">End date</label>
						<div class="control-group datepicker-input">
							<font-awesome-icon icon="calendar" />
							<Datepicker
								v-model="end_date"
								format="yyyy-MM-dd"
								monday-first
								style="display: inline-block;"
							></Datepicker>
						</div>
						<div class="invalid-feedback" style="display: block;" v-show="this.trip_dates_valid === false">Must be after Start date</div>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-md-12">
					<div class="form-group">
						<a @click="save_trip" href="#" :class="save_button_classes"><font-awesome-icon icon="save" /> Save</a>
					</div>
				</div>
			</div>

			<hr >

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
	import Datepicker from 'vuejs-datepicker'

	export default {
		name: 'TripTab',
		components: {
			Datepicker
		},
		data() {
			return {
				trip_dates_valid: true,
				trip_name_valid: true,
				trip_form_valid: true
			}
		},
		computed: {
			save_button_classes: function() {
				return {
					btn: true,
					'btn-success': true,
					disabled: !this.trip_dates_valid
				}
			},
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
					if(this.validate_trip_dates({start_date: value, end_date: this.$store.state.active_trip.end_date})) {
						this.trip_dates_valid = true
						this.$store.commit('update_active_trip', { property: 'start_date', value: value })
					}
					else {
						this.trip_dates_valid = false
					}
				}
			},
			end_date: {
				get() {
					return this.$store.state.active_trip.end_date
				},
				set(value) {
					if(this.validate_trip_dates({start_date: this.$store.state.active_trip.start_date, end_date: value})) {
						this.trip_dates_valid = true
						this.$store.commit('update_active_trip', { property: 'end_date', value: value })
					}
					else {
						this.trip_dates_valid = false
					}
				}
			},
		},
		methods: {
			delete_trip: function() {
				this.$store.dispatch('delete_active_trip')
			},
			save_trip: function() {
				this.trip_dates_invalid = true
				let has_error = false
				has_error = this.trip_name_valid
				has_error = this.trip_start_date_valid
				if(
					has_error
				) {
					console.log('Errors found, NOT saving trip')
				}
				else {
					console.log('No errors, saving trip')
				}
			},
			validate_trip_name: function() {
				let re = this.$XRegExp("^[\\p{L}\\d\ \\_\\-]+$")
				return re.test(this.trip_name)
			},
			validate_trip_dates: function(dates) {
				console.log(dates.start_date)
				console.log(dates.end_date)
				return (dates.start_date <= dates.end_date)
			}
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
</style>