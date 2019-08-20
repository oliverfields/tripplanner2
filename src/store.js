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
			id: 'store set id<3'
		}
	},
	getters: {
		get_trips: state => {
			return state.trips
		},
		active_trip_id: state => {
			console.log('store.getters.active_trip_id')
			return state.active_trip.id
		}
	},
	mutations: {
		set_active_trip_id: (state, payload) => {
			console.log('Mutation: set_active_trip_id: ' + state + ' ' + payload)
			state.active_trip.id = payload
			//Vue.set(state.active_trip, 'id', payload)
			//state.active_trip = Object.assign({}, state.active_trip, payload)
		},
		set_trips: (state, payload) => {
			state.trips = payload
		}
	},
	actions: {
		set_active_trip_id: (context, payload) => {
			console.log('Action: set_active_trip_id: ' + payload)
			context.commit('set_active_trip_id', payload)
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
