<template>
	<nav id="nav" class="navbar navbar-expand navbar-dark bg-dark">
		<a class="navbar-brand" href="#"><object id="logo" type="image/svg+xml" data="images/ambulate-logo.svg"></object></a>
		<button
			class="navbar-toggler"
			style="border: none;"
			type="button"
			data-toggle="collapse"
			data-target="#navbars-site-menu"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span><i class="fa fa-bars" /></span>
		</button>

		<div class="collapse navbar-collapse navbar-dark bg-dark" id="navbars-site-menu">
			<ul class="navbar-nav mr-auto">
				<li class="nav-item">
					<a
						class="btn btn-success"
						href="#" @click="create_trip"
						style="margin-top: 3px;"
				>
					<i class="fa fa-plus" /> New trip</a>
				</li>
				<li v-if="this.$store.getters.get_trips && this.$store.getters.get_trips.length > 0" class="nav-item dropdown" style="margin-left: 0;">
					<a class="nav-link dropdown-toggle" href="#" id="trip-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Select trip</a>

					<div class="dropdown-menu" aria-labelledby="trip-dropdown">
						<div v-for="trip in this.$store.getters.get_trips" :key="trip.id">
							<a class="dropdown-item" href="#" @click="set_active_trip(trip.id)">{{ trip.name }}</a>
						</div>
					</div>
				</li>
				<li class="nav-item"><a class="btn btn-secondary" href="#" @click="log_trip">Console log active trip</a></li>
			</ul>
			<ul class="navbar-nav ml-auto">
				<li class="nav-item"><a class="nav-link" href="#" @click="logout"><i class="fa fa-sign-out-alt" /> Logout</a></li>
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
		z-index: 3000;
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
	.dropdown-toggle {
		margin-top: 4px;
	}
	.dropdown-menu {
		background-color: #343A40 ! important;
		border: none ! important;
		border-top-left-radius: 0 ! important;
		border-top-right-radius: 0 ! important;
		border-bottom-left-radius: 4px ! important;
		border-bottom-right-radius: 4px ! important;
	}
	.dropdown-menu a {
		color: #CCCDCF ! important;
	}
	.dropdown-menu a:hover {
		color: #fff ! important;
		background-color: #343A40 ! important;
	}
	.navbar-brand i {
		margin-left: 1rem ! important;
	}
	#logo {
		height: 28px;
		margin: 8px 0 0 1rem;
	}
	#trip-dropdown {
		margin-top: 2px ! important;
	}
</style>