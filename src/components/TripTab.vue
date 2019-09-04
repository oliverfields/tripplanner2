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
						<div class="invalid-feedback"><font-awesome-icon icon="exclamation-triangle" />Name can only use letters and numbers</div>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-md-12">
					<div class="form-group date-input">
						<label for="trip_start_date">Start date</label>
						<div class="control-group datepicker-input">
							<div class="form-control">
								<font-awesome-icon icon="calendar" />
								<Datepicker
									v-model="start_date"
									format="D d MMM yyyy"
									monday-first
								></Datepicker>
							</div>
						</div>
					</div>
				</div>
			</div>

			<hr >

			<div class="row">
				<div class="col-md-12">
					<div class="form-group">
						<div class="form-group-danger">
							<h1>Delete trip</h1>
							<p><font-awesome-icon class="danger" icon="exclamation-triangle" /> Deleted trips can <strong>not</strong> be undeleted</p>
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
		},
		methods: {
			delete_trip: function() {
				this.$store.dispatch('delete_active_trip')
			},
			validate_trip_name: function() {
				let re = this.$XRegExp("^[\\p{L}\\d\ \\_\\-]+$")
				let result = re.test(this.trip_name)

				this.$store.commit('update_active_trip', { property: 'valid', value: result})

				return result
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