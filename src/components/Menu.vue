<template>
	<nav id="nav" class="navbar navbar-expand-md navbar-dark bg-dark">
		<a class="navbar-brand" href="#"><font-awesome-icon icon="hiking" /> Trip planner</a>
		<button class="navbar-toggler" style="border: none;" type="button" data-toggle="collapse" data-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
			<span><font-awesome-icon icon="bars" /></span>
		</button>

		<div class="collapse navbar-collapse" id="navbarsExample04">
			<ul class="navbar-nav mr-auto">
				<li v-if="this.$store.getters.get_trips && this.$store.getters.get_trips.length > 0" class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="#" id="trip-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Trips</a>

					<div class="dropdown-menu" aria-labelledby="trip-dropdown">
						<div v-for="trip in this.$store.getters.get_trips" :key="trip.id">
							<a class="dropdown-item" href="#" @click="set_active_trip_id(trip.id)">{{ trip.name }}</a>
						</div>
					</div>
				</li>
				<li class="nav-item"><a class="nav-link tp-main-button" href="#">New trip</a></li>
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
	methods: {
		logout: function() {
			auth.signOut().then(() => {
				this.$router.replace('login')
			})
		},
		set_active_trip_id(payload) {
			this.$store.dispatch('set_active_trip', payload)
		}
	}
}
</script>

<style>
.tp-nav-group-title {
font-size: 1rem;
color: #fff;
}
.tp-nav-group ul {
padding-left: 3rem;
}
svg.svg-inline--fa {
margin-right: .5rem;
}
.tp-main-button {
background-color: #008000;
color: #fff ! important;
text-align: center ! important;
border-radius: 2px;
}
.nav-link {
padding: .5rem 1rem ! important;
margin: 0 1rem;
}
</style>