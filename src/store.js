import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '@/main'
import { auth } from '@/main'


Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		items: null,
		trips: null,
		selected_trip_id: 'hola'
	},
	getters: {
		getItems: state => {
			return state.items
		},
		get_trips: state => {
			return state.trips
		},
		get_selected_trip_id: state => {
			return state.selected_trip_id
		}
	},
	mutations: {
		setItems: state => {
			let items = []

			db.collection('items').orderBy('created_at').onSnapshot((snapshot) => {
				snapshot.forEach((doc) => {
					items.push({id: doc.id, title: doc.data().title})
				})

				state.items = items
			})
		},
		set_trips: state => {
			let trips = []
			state.trips = trips
			db.collection('users').doc(auth.currentUser.uid).collection('trips').orderBy('name').get()
			.then(function(snapshot) {
				snapshot.forEach(function(doc) {
					let d = doc.data()
					trips.push({
						id: doc.id,
						name: d.name,
						start_date: d.start_date,
						end_date: d.end_date,
						map_lat: d.map_lat,
						map_lon: d.map_lon,
						map_zoom: d.map_zoom,
						itinerary: d.itinerary
					})
				})
				state.trips = trips
			})
			.catch(function(error) {
				console.log('Error getting trips: ', error)
			})
		}
	},
	actions: {
		setItems: context => {
			context.commit('setItems')
		},
		set_trips: context => {
			context.commit('set_trips')
		}
	}
})
