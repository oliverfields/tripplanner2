<template>
	<div>
		<input v-model="myTodo" @click="addTodo" /><button @click="addTodo">Add</button>
		<div v-if="error !== ''" id="error">{{ error }}</div>
		<div v-if="this.$store.getters.getItems && this.$store.getters.getItems.length > 0">
			<div class="title">Todays todos</div>

			<div v-for="item in this.$store.getters.getItems" :key="item.id">
				{{ item.title }}<br /><br /><small style="text-decoration: underline;" @click="deleteItem(item.id)">Delete</small>
				<br />
			</div>
		</div>
	</div>
</template>

<script>
import { db } from '@/main'

export default {
	name: 'Todo',
	beforeCreate: function() {
		this.$store.dispatch('setItems')
	},
	data: function() {
		return{
			myTodo: '',
			error: ''
		}
	},
	methods: {
		addTodo: function() {
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
