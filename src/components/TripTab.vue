<template>
	<div class="container-fluid">
		<form>
			<div class="row">
				<div class="col-md-12">
					<div class="form-group">
						<label for="trip_name">Name</label>
						<input v-model="trip_name" id="trip_name" class="form-control" />
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-md-6">
					<div class="form-group">
						<label for="trip_start_date">Start date</label>
						<Datepicker :value="trip_start_date" format="yyyy-MM-dd" monday-first bootstrap-styling name="trip_start_date"></Datepicker>
					</div>
				</div>
				<div class="col-md-6">
					<div class="form-group">
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
							<h1><font-awesome-icon icon="exclamation-triangle" /> Delete trip</h1>
							<p>Deleted trips can <strong>not</strong> be undeleted</p>
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
		trip_name: {
			get() {
				return this.$store.state.active_trip.name
			},
			set(value) {
				this.$store.commit('update_active_trip', { property: 'name', value: value })
			}
		},
		trip_start_date: {
			get() {
				return this.tp_date_format(this.$store.state.active_trip.start_date)
			},
			set(value) {
				this.$store.commit('update_active_trip', { property: 'start_date', value: value })
			}
		},
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
		save_trip: function() {
			console.log('Saving trip')
		},
		delete_trip: function() {
			this.$store.dispatch('delete_active_trip')
		}
	}
	//mounted() {
	//}
}
</script>

<style>
.form-group-danger {
padding: 2rem 0;
}
.form-group-danger h1{
font-size: 2rem;
}
</style>