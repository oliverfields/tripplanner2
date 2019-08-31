import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '@/main'
import { auth } from '@/main'
import mixin from '@/mixin'

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

					if(trip.start_date && trip.end_date) // Always compute trip duration, must be done after dates are converted to javascript date objects
						trip.trip_days_duration = mixin.methods.tp_date_difference(trip.start_date, trip.end_date)

					// Controls for itinerary tab content
					trip.itinerary_navigation = {
						show_day_index: null,
						show_activity_index: null
					}

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
		},
		update_active_trip_duration: (context, payload) => {
			context.commit('update_active_trip', { property: 'trip_days_duration', value: payload.duration })
			context.commit('update_active_itinerary_length') // Call after trip_days_duration is updated
		},
		show_activity: (context, payload) => {
			context.commit('update_itinerary_navigation', { property: 'show_day_index', value: payload.day_index })
			context.commit('update_itinerary_navigation', { property: 'show_activity_index', value: payload.activity_index })
		}
	},
	mutations: {
		update_itinerary_navigation: (state, payload) => {
			switch (payload.property) {
				case 'show_day_index':
					if(typeof payload.value != 'number') payload.value = null
					state.active_trip.itinerary_navigation.show_day_index = payload.value
					break
				case 'show_activity_index':
					if(typeof payload.value != 'number') payload.value = null
					state.active_trip.itinerary_navigation.show_activity_index = payload.value
					break
				default:
					console.log('Unkown itinerary_navigation property: ' + payload.property)
			}
		},
		update_active_itinerary_length: (state) => {
			// Ensure length of itinerary list corresponds to trip_days_duration
			if(!state.active_trip.itinerary)
				state.active_trip.itinerary = []

			let itinerary_length = state.active_trip.itinerary.length
			let duration = state.active_trip.trip_days_duration
			let itinerary = state.active_trip.itinerary
			let day_date = state.active_trip.start_date
			

			// Add array items (days) to the itinerary to make it longer
			if(itinerary_length < duration) {
				for (let i = 0; i < duration; i++) {

					// For array elements that already exist, just make sure the day object they contain reflects the trip
					if(i < itinerary_length) {
						itinerary[i].date = day_date
						itinerary[i].date_pretty = mixin.methods.tp_date_format(day_date)
						itinerary[i].day_number = i + 1
						itinerary[i].day_index = i

						if(!itinerary[i].activities)
							itinerary[i].activities = []

					}
					// Add empty day objects
					else {
						itinerary.push({
							date: day_date,
							date_pretty: mixin.methods.tp_date_format(day_date),
							day_number: i + 1,
							day_index: i,
							activities: []

						})
					}
					day_date = mixin.methods.tp_add_days_to_date(day_date, 1)
				}
			}
			else if(itinerary_length == duration) {
				console.log('Itinerary_length is same as duration, doing nothing (' +itinerary_length + ' = ' + duration +')')
			}
			else {
				console.log('Itinerary_length is less than duration, decreasing itinerary (' +itinerary_length + ' < ' + duration +')')
			}

			// Add activity indexes (for template lookups
			for (let x = 0; x < itinerary.length; x++) {
				for (let n = 0; n < itinerary[x].activities.length; n++) {
					itinerary[x].activities[n].activity_index = n
				}
			}
		},
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
				case 'trip_days_duration':
					state.active_trip.trip_days_duration = payload.value
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
