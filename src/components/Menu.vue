<template>
	<nav id="nav" class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">

		<a class="navbar-brand" href="#"><object id="logo" type="image/svg+xml" data="images/ambulate-logo-bindle.svg"></object><span class="app-name d-none d-md-inline-block">Ambulate</span></a>

		<div class="toggle d-sm-block d-md-none">
			<i
				v-if="this.$store.state.active_trip"
				@click="toggle_panes"
				:class="toogle_panes_icon"
				title="Toggle itinerary/map view"
			/>

		</div>

		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbars-site-menu" aria-controls="navbars-site-menu" aria-expanded="false" aria-label="Toggle navigation">
			<span><i class="fa fa-bars" /></span>
		</button>

		<div class="collapse navbar-collapse navbar-dark bg-dark" id="navbars-site-menu">
			<ul class="navbar-nav mr-auto">
				<li class="nav-item">
					<click-confirm
						button-size="sm"
						:messages="{ title: 'Trip has unsaved changes, discard them and create new trip?'}"
						placement="bottom"
						:disabled="trip_saved"
					>
						<a
							class="nav-link"
							href="#" @click="create_trip"
					>
							<i class="fa fa-plus" /> New trip
						</a>
					</click-confirm>
				</li>
				<li v-if="this.$store.getters.get_trips && this.$store.getters.get_trips.length > 0" class="nav-item dropdown" style="margin-left: 0;">
					<a class="nav-link dropdown-toggle" href="#" id="trip-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Select trip</a>

					<div class="dropdown-menu" aria-labelledby="trip-dropdown">
						<div v-for="trip in this.$store.getters.get_trips" :key="trip.id">
							<click-confirm
								button-size="sm"
								:messages="{ title: 'Trip has unsaved changes, discard them and load new trip?'}"
								placement="bottom"
								:disabled="trip_saved"
							>
								<a class="dropdown-item" href="#" @click="set_active_trip(trip.id)">{{ trip.name }}</a>
							</click-confirm>
						</div>
					</div>
				</li>
			</ul>
			<ul class="navbar-nav ml-auto">
				<li class="nav-item">
					<click-confirm
						button-size="sm"
						:messages="{ title: 'Trip has unsaved changes, discard them and logout?'}"
						placement="bottom"
						:disabled="trip_saved"
						class="logout-link"
					>
						<a class="nav-link" href="#" @click="logout"><i class="fa fa-sign-out-alt" /> Logout</a>
					</click-confirm>
					<img
						v-if="current_user_photo"
						:src="current_user_photo"
						class="profile-pic"
						:title="current_user_email"
						:alt="current_user_email"
					/>
				</li>
			</ul>
		</div>
	</nav>
</template>

<script>
	import { auth } from '@/main'

	export default {
		name: 'Menu',
		data() {
			return {
				active_pane: 'tabs-pane'
			}
		},
		beforeCreate: function() {
			this.$store.dispatch('set_trips')
		},
		computed: {
			current_user_photo: function() {
				return auth.currentUser.photoURL
			},
			current_user_email: function() {
				return auth.currentUser.email
			},
			trip_saved:function(){
				if(this.$store.state.active_trip)
					return !this.$store.state.active_trip.dirty

				return true
			},
			toogle_panes_icon: function() {
				if(this.active_pane == 'tabs-pane')
					return ['fa', 'fa-map-marked-alt']

				return ['fa', 'fa-clipboard-list']
			},
		},
		methods: {
			toggle_panes: function() {
				if($('#tabs-pane').css('visibility') == 'visible') {
					this.active_pane = 'map-pane'
					$('#tabs-pane').css('visibility', 'hidden')
					$('#map-pane').css('visibility', 'visible')
				}
				else {
					this.active_pane = 'tabs-pane'
					$('#tabs-pane').css('visibility', 'visible')
					$('#map-pane').css('visibility', 'hidden')
				}
			},
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
				console.log('UID: ' + auth.currentUser.uid)
				console.log('EMAIL: ' + auth.currentUser.email)
				console.log('Photo: ' + auth.currentUser.photoURL)
				console.log(this.$store.state.active_trip)
			}
		}
	}
</script>

<style>
	svg.svg-inline--fa {
		margin: 0 .5rem;
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
	.navbar-brand {
		font-size: 2rem ! important;
	}
	#logo {
		height: 28px;
	}
	.profile-pic {
		border-radius: 50%;
		height: 30px;
		width: 30px;
		margin: 0 0 0 1rem;
		display: inline-block;
	}
	.logout-link {
		display: inline-block ! important;
		margin-right: 0;
	}
	.navbar-toggler {
		border: none ! important;
		font-size: 1.5rem ! important;
		color: white ! important;
	}
	.app-name {
		margin: 0 1.5rem 0 1rem;
	}
	.toggle i {
		font-size: 1.5rem;
		color: white;
	}
</style>