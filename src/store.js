import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '@/main'
import { auth } from '@/main'

Vue.use(Vuex)

function convert_firebase_timestamp_to_js_date_object(firebase_timestamp) {
	let js_date = new Date(firebase_timestamp.seconds*1000)
	return js_date
}

var new_trip_template = {
	name: '',
	start_date: new Date(),
	end_date: new Date()
}

export const store = new Vuex.Store({
	strict: true,
	state: {
		trips: null
	},
	getters: {
		get_trips: state => {
			let tmp_trips = state.trips
			if(tmp_trips) {
				return tmp_trips.slice().sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
			}
			return tmp_trips
		},
		active_trip: state => {

		}
	},
	actions: {
		set_active_trip: (context, payload) => {
			context.commit('set_active_trip', payload)
		},
		setItems: context => {
			context.commit('setItems')
		},
		create_trip: context => {
			let new_trip = Object.create(new_trip_template)
			new_trip.name = 'New trip'
			context.commit('create_trip', new_trip)
			context.commit('set_active_trip', new_trip)
		},
		delete_active_trip: context => {
			context.commit('delete_active_trip')
		},
		set_trips: context => {
			let trips = []
			db.collection('users').doc(auth.currentUser.uid).collection('trips').orderBy('name').onSnapshot(snapshot => {
				snapshot.forEach(doc => {
					let trip = doc.data()
					trip.id = doc.id

					// Firebase timestamps need converting JavaScript date objects
					trip.start_date = convert_firebase_timestamp_to_js_date_object(trip.start_date)
					trip.end_date = convert_firebase_timestamp_to_js_date_object(trip.end_date)
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
	},
	mutations: {
		update_active_trip: (state, payload) => {
			switch (payload.property) {
				case 'name':
					state.active_trip.name = payload.value
					break
				case 'start_date':
					state.active_trip.start_date = payload.value
					break
				case 'end_date':
					state.active_trip.end_date = payload.value
					break
				default:
					console.log('Unkown active_trip property: ' + payload.target_property)
			}
			//console.log(payload.property + ' set to ' + payload.value)
		},
		create_trip: (state, payload) => {
			state.trips.push(payload)
		},
		set_active_trip: (state, payload) => {
			state.active_trip = payload
			//Vue.set(state.active_trip, 'id', payload)
			//state.active_trip = Object.assign({}, state.active_trip, payload)
		},
		set_trips: (state, payload) => {
			state.trips = payload
		},
		delete_active_trip: (state) => {
			state.active_trip = false
		}
	},
})
