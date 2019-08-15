<template>
	<div>
		<input v-model="myTodo" @click="addTodo" /><button @click="addTodo">Add</button>
		<input type="text" placeholder="Trip name" v-model="trip_name" required />
		<div v-if="error !== ''" id="error">{{ error }}</div>
		<div v-if="this.$store.getters.getItems && this.$store.getters.getItems.length > 0">
			<div class="title">Todays todos</div>

			<div v-for="item in this.$store.getters.getItems" :key="item.id">
				{{ item.title }}<br /><br /><small style="text-decoration: underline;" @click="deleteItem(item.id)">Delete</small>
				<br />
			</div>
		</div>

		<div v-if="this.$store.getters.get_trips && this.$store.getters.get_trips.length > 0">
			<h1>Trips</h1>
			<ul v-for="trip in this.$store.getters.get_trips" :key="trip.id">
				<li>{{ trip.name }} {{ trip.map_zoom }}</li>
			</ul>
		</div>
	</div>
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
