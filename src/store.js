import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '@/main'
import { auth } from '@/main'


Vue.use(Vuex)

export const store = new Vuex.Store({
	strict: true,
	state: {
		items: null,
		trips: null,
		active_trip: {
			id: 'hola'
		}
	},
	getters: {
		get_trips: state => {
			return state.trips
		},
		getItems: state => {
			return state.items
		},
		active_trip: state => {
			return state.active_trip
		}
	},
	mutations: {
		set_active_trip: (state, payload) => {
			console.log('Mutation: set_active_trip: ' + state + ' ' + payload)
			state.active_trip.id = payload
			console.log('active_trip.id is now ' + state.active_trip.id)
		},
/*
		setItems: state => {
			let items = []

			db.collection('items').orderBy('created_at').onSnapshot((snapshot) => {
				snapshot.forEach((doc) => {
					items.push({id: doc.id, title: doc.data().title})
				})
				state.items = items
			})
		},
*/
		set_trips: (state, payload) => {
			state.trips = payload
		}
	},
	actions: {
		set_active_trip: (context, payload) => {
			context.commit('set_active_trip', payload)
		},
		setItems: context => {
			context.commit('setItems')
		},
		set_trips: context => {
			let trips = []
			db.collection('users').doc(auth.currentUser.uid).collection('trips').orderBy('name').onSnapshot(snapshot => {
				snapshot.forEach(doc => {
					let trip = doc.data()
					trip.id = doc.id;
					trips.push(trip)
				})
				context.commit('set_trips', trips)
			})
/*
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
			})
			.catch(function(error) {
				console.log('Error getting trips: ', error)
			})
			context.commit('set_trips', trips)
*/
		}
	}
})
