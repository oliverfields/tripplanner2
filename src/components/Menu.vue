<template>
	<nav id="nav" class="navbar navbar-expand navbar-dark bg-dark">
		<a class="navbar-brand" href="#"><font-awesome-icon icon="hiking" /> Ambulate</a>
		<button class="navbar-toggler" style="border: none;" type="button" data-toggle="collapse" data-target="#navbars-site-menu" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
			<span><font-awesome-icon icon="bars" /></span>
		</button>

		<div class="collapse navbar-collapse navbar-dark bg-dark" id="navbars-site-menu">
			<ul class="navbar-nav mr-auto">
				<li v-if="this.$store.state.active_trip" class="nav-item">
					<a :class="save_button_classes" href="#" @click="log_trip">
						<font-awesome-icon icon="save" /> Save {{ this.$store.state.active_trip.name }}
						<sup v-if="this.$store.state.active_trip.error_registry.length > 0">
							<font-awesome-icon icon="exclamation-triangle" />
						</sup>
						<sup v-else-if="this.$store.state.active_trip.dirty">
							<font-awesome-icon icon="asterisk" />
						</sup>
					</a>
				</li>
				<li class="nav-item"><a class="btn btn-success" href="#" @click="create_trip"><font-awesome-icon icon="plus" /> New trip</a></li>
				<li v-if="this.$store.getters.get_trips && this.$store.getters.get_trips.length > 0" class="nav-item dropdown" style="margin-left: 0;">
					<a class="nav-link dropdown-toggle" href="#" id="trip-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Select trip</a>

					<div class="dropdown-menu" aria-labelledby="trip-dropdown">
						<div v-for="trip in this.$store.getters.get_trips" :key="trip.id">
							<a class="dropdown-item" href="#" @click="set_active_trip(trip)">{{ trip.name }}</a>
						</div>
					</div>
				</li>
				<li class="nav-item"><a class="btn btn-secondary" href="#" @click="log_trip">Console log active trip</a></li>
			</ul>
			<ul class="navbar-nav ml-auto">
				<li class="nav-item"><a class="nav-link" href="#" @click="logout"><font-awesome-icon icon="sign-out-alt" /> Logout</a></li>
			</ul>
		</div>
	</nav>
</template>

<script>
	import { auth } from '@/main'

	export default {
		name: 'Menu',
		beforeCreate: function() {
			this.$store.dispatch('set_trips')
		},
		computed: {
			save_button_classes: function() {
				return {
					btn: true,
					'btn-primary': true,
					disabled: this.active_trip_has_errors
				}
			},
			active_trip_has_errors() {
				return (this.$store.state.active_trip.error_registry.length != 0)
			}
		},
		methods: {
			logout: function() {
				auth.signOut().then(() => {
					this.$router.replace('login')
				})
			},
			set_active_trip(payload) {
				this.$store.dispatch('set_active_trip', payload)
			},
			create_trip() {
				this.$store.dispatch('create_trip')
			},
			log_trip() {
				console.log(this.$store.state.active_trip)
			}
		}
	}
</script>

<style>
	#nav {
	position: absolute;
		top: 0px;
		right: 0px;
		width: 100%;
		height: 50px; /* NB! This is hardcoded into Workspace component */
		padding: 0;
	}
	.tp-nav-group-title {
		font-size: 1rem;
		color: #fff;
	}
	.tp-nav-group ul {
		padding-left: 3rem;
	}
	svg.svg-inline--fa {
		margin: 0 .5rem;
	}
	.nav-link {
		padding: .5rem 1rem ! important;
		margin: 0 1rem;
	}
	#nav .nav-item {
		margin-left: 2rem;
	}
</style>