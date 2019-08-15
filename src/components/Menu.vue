<template>
	<nav class="navbar navbar-dark bg-dark">
			<a class="navbar-brand" href="#">Trip Planner</a>
			<button class="navbar-toggler navbar-dark" type="button" data-toggle="collapse" data-target="#main-navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="main-navigation">
				<div class="tp_nav_group">
					<h1>Trips</h1>
					<div v-if="this.$store.getters.get_trips && this.$store.getters.get_trips.length > 0">
						<ul class="navbar-nav" v-for="trip in this.$store.getters.get_trips" :key="trip.id">
							<li class="nav-item">
								<a class="nav-link" href="#">{{ trip.name }} {{ trip.map_zoom }}</a>
							</li>
						</ul>
					</div>
					<ul class="navbar-nav">
						<li class="nav-item">
							<a class="nav-link" href="#">+ Add trip</a>
						</li>
					</ul>
				</div>
				<ul class="navbar-nav">
					<li class="nav-item">
						<a class="nav-link" href="#">About</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="#">Contact</a>
					</li>

					<li class="nav-item">
						<a class="nav-link" href="#">Logout</a>
					</li>
				</ul>
			</div>
		</nav>

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
		addTodo: function() {
			db
				.collection("users")
				.doc(auth.currentUser.uid)
				.collection("trips")
				.add({
					name: this.trip_name,
					createdAt: new Date()
				})
				.then(function(docRef) {
					console.log('Document ID: ', docRef.id)
				})
				.catch(function(error) {
					console.error('Error: ', error)
				})
		},
		WORKING_addTodo: function() {
			this.error = ''

			if(this.myTodo !== '') {
				db.collection('items').add({
					title: this.myTodo,
					created_at: Date.now()					
				}).then((response) => {
					if(response) {
						this.myTodo = ''
					}
				}).catch((error) => {
					this.error = error
				})
			}
			else {
				this.error = 'Todo title empty'
			}
			console.log('myTodo: ' + this.myTodo)
		},
		deleteItem: function(id) {
			if(id) {
				db.collection('items').doc(id).delete().then(function() {
					console.log('Document ' + id + ' deleted')
				}).catch(function(error) {
					this.error = error	
				})
			}
			else {
				this.error = 'Invalid ID'
			}
		}
	}
}
</script>
