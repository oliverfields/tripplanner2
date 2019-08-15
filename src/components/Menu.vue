<template>
	<nav class="navbar navbar-expand-md navbar-dark bg-dark">
		<a class="navbar-brand" href="#">Trip planner</a>
		<button class="navbar-toggler" style="border: none;" type="button" data-toggle="collapse" data-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
			<span><font-awesome-icon icon="bars" /></span>
		</button>

		<div class="collapse navbar-collapse" id="navbarsExample04">
			<ul class="navbar-nav mr-auto">
				<li v-if="this.$store.getters.get_trips && this.$store.getters.get_trips.length > 0" class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="#" id="trip-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Trips</a>

					<div class="dropdown-menu" aria-labelledby="trip-dropdown">
						<div v-for="trip in this.$store.getters.get_trips" :key="trip.id">
							<a class="dropdown-item" href="#">{{ trip.name }}</a>
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
<!--
	<nav class="navbar navbar-dark bg-dark">
		<router-link to="/home" class="navbar-brand">Trip planner</router-link>
		<button class="navbar-toggler navbar-dark" style="border: none; clear: right;" type="button" data-toggle="collapse" data-target="#main-navigation">
			<span><font-awesome-icon icon="bars" /></span>
		</button>
		<div class="collapse navbar-collapse justify-content-end" id="main-navigation">
			<h1 class="tp-nav-group-title"><font-awesome-icon icon="cannabis" /> Trips</h1>
			<div class="tp-nav-group">
				<div v-if="this.$store.getters.get_trips && this.$store.getters.get_trips.length > 0">
					<ul class="navbar-nav" v-for="trip in this.$store.getters.get_trips" :key="trip.id">
						<li class="nav-item"><a class="nav-link" href="#">{{ trip.name }} {{ trip.map_zoom }}</a></li>
					</ul>
				</div>
				<ul class="navbar-nav">
					<li class="nav-item"><a class="nav-link" href="#">+ Add trip</a></li>
				</ul>
			</div>
			<ul class="navbar-nav">
				<li class="nav-item"><a class="nav-link" href="#">About</a></li>
				<li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
				<li class="nav-item"><a class="nav-link" href="#" @click="logout">Logout</a></li>
			</ul>
		</div>
	</nav>
-->
</template>

<script>
import { db } from '@/main'
import { auth } from '@/main'

export default {
	name: 'Todo',
	beforeCreate: function() {
		this.$store.dispatch('setItems'),
		this.$store.dispatch('set_trips')
	},
	data: function() {
		return{
			myTodo: '',
			trip_name: null,
			error: ''
		}
	},
	methods: {
		logout: function() {
			auth.signOut().then(() => {
				this.$router.replace('login')
			})
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
}
.nav-link {
padding: .5rem 1rem ! important;
margin: 0 1rem;
}
</style>