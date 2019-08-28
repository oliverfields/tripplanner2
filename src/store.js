import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '@/main'
import { auth } from '@/main'

Vue.use(Vuex)

function convert_firebase_timestamp_to_js_date_object(firebase_timestamp) {
	let js_date = new Date(firebase_timestamp.seconds*1000)
	return js_date
}

function convert_firebase_geopoint(firebase_geopoint) {
	return {
		lat: firebase_geopoint._lat,
		lng: firebase_geopoint._long
	}
}

var new_trip_id_counter = 1

export const store = new Vuex.Store({
	strict: true,
	state: {
		trips: null,
		active_trip: false,
		map: {
			zoom: 2,
			center: [52.529562,  13.413047],
			bounds: null,
		}
	},
	getters: {
		map_settings: state => {
			return state.map
		},
		get_trips: state => {
			let tmp_trips = state.trips
			if(tmp_trips) {
				return tmp_trips.slice().sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
			}
			return tmp_trips
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
			let new_trip = {
				name: 'New trip',
				id: 'trip_planner_tmp_id_' + new_trip_id_counter,
				start_date: new Date(),
				end_date: new Date(),
				map_center: { lat: 52.5125, lng: 13.3815 },
				map_zoom: 2
			}
			new_trip_id_counter += 1
			
			context.commit('create_trip', new_trip)
			context.commit('set_active_trip', new_trip)
		},
		delete_active_trip: ({commit, state}, payload) => {
			let delete_trip_id = state.active_trip.id
			commit('delete_active_trip')
			commit('delete_trip', delete_trip_id)
		},
		set_trips: context => {
			let trips = []
			db.collection('users').doc(auth.currentUser.uid).collection('trips').orderBy('name').onSnapshot(snapshot => {
				snapshot.forEach(doc => {
					let trip = doc.data()
					trip.id = doc.id

					// Firebase timestamps need converting JavaScript date objects
					if(trip.start_date)
						trip.start_date = convert_firebase_timestamp_to_js_date_object(trip.start_date)

					if(trip.end_date)
						trip.end_date = convert_firebase_timestamp_to_js_date_object(trip.end_date)

					if(trip.map_center)
						trip.map_center = convert_firebase_geopoint(trip.map_center)

					if(trip.name)
						trip.name = trip.name

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
		update_map_settings: (state, payload) => {
			if(payload.zoom)
				state.map.zoom = payload.zoom

			if(payload.center)
				state.map.center = payload.center
		},
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
				case 'map_center':
					state.active_trip.map_center.lat = payload.value.lat
					state.active_trip.map_center.lng = payload.value.lng
					break
				case 'map_zoom':
					state.active_trip.map_zoom = parseInt(payload.value)
					break
				default:
					console.log('Unkown active_trip property: ' + payload.property)
			}
		},
		create_trip: (state, payload) => {
			state.trips.push(payload)
		},
		set_active_trip_id: (state, payload) => {
			state.active_trip_id = payload
		},
		set_active_trip: (state, payload) => {
			state.active_trip = payload
		},
		set_trips: (state, payload) => {
			state.trips = payload
		},
		delete_active_trip: (state) => {
			state.active_trip = false
		},
		delete_trip: (state, payload) => {
			state.trips.forEach(
				function (trip, index, array) {
					if(trip.id == payload) {
						console.log('Deleting trip.id: ' + trip.id + ' at index ' + index)
						state.trips.splice(index, 1) // remove 1 element starting at index from array
					}
				}
			)
		}
	},
})
