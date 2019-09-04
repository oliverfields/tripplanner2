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

function setup_trip(trip) {
	if(!trip.name)
		trip.name = 'new trip'

	if(!trip.id)
		trip.id = 'trip_planner_tmp_id_' + new_id()

	if(!trip.start_date)
		trip.start_date = new Date()

	if(!trip.map_center)
		trip.map_center = { lat: 52.5125, lng: 13.3815 }

	if(!trip.itinerary){
		trip.itinerary = []
		trip.itinerary.push({
			activities: []
		})
	}

	if(!trip.itinerary_navigation)
		trip.itinerary_navigation = {}

	if(!trip.itinerary_navigation.show_day_index)
		trip.itinerary_navigation.show_day_index = null

	if(!trip.itinerary_navigation.show_activity_index)
		trip.itinerary_navigation.show_activity_index = null

	if(!trip.map_zoom)
		trip.map_zoom = 2

	if(!trip.valid)
		trip.valid = true

	if(!trip.dirty)
		trip.dirty = false

	// Controls for itinerary tab content
	trip.itinerary_navigation = {
		show_day_index: null,
		show_activity_index: null
	}

	return trip
}

var id_counter = 0
function new_id() {
	id_counter += 1
	return id_counter
}

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
			context.commit('set_itinerary_dates')
		},
		setItems: context => {
			context.commit('setItems')
		},
		create_trip: context => {
			let new_trip = setup_trip({})
			new_trip.dirty = true
			context.commit('create_trip', new_trip)
			context.commit('set_active_trip', new_trip)
			context.commit('set_itinerary_dates')
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

					if(trip.map_center)
						trip.map_center = convert_firebase_geopoint(trip.map_center)

					trip = setup_trip(trip)

					trips.push(trip)
				})
				context.commit('set_trips', trips)
			})
		},
		show_activity: (context, payload) => {
			context.commit('update_itinerary_navigation', { property: 'show_day_index', value: payload.day_index })
			context.commit('update_itinerary_navigation', { property: 'show_activity_index', value: payload.activity_index })
		},
		add_activity_and_show: (context, payload) => {
			let day_index = payload.day_index
			let day = payload.day
			context.commit('add_activity', day)
			let activity_index = day.activities.length - 1 // New activity is appended to end, so index = length - 1
			context.dispatch('show_activity', {day_index: day_index, activity_index: activity_index})
		},
		add_day_and_show: (context) => {
			context.commit('add_day')
			let day_index = context.state.active_trip.itinerary.length - 1 // New day is appended to itinerary end, so index = length - 1
			//context.commit('update_itinerary_navigation', { property: 'show_day_index', value: day_index })
			//context.commit('update_itinerary_navigation', { property: 'show_activity_index', value: null })
			context.commit('set_itinerary_dates')

		},
		update_active_trip: (context, payload) => {
			context.commit('update_active_trip', payload)
			if(payload.property == 'start_date')
				context.commit('set_itinerary_dates')
		},
	},
	mutations: {
		set_itinerary_dates: (state) => {
			for (let i = 0; i < state.active_trip.itinerary.length; i++) {
				let day_date = mixin.methods.tp_add_days_to_date(state.active_trip.start_date, i)
				Vue.set(state.active_trip.itinerary[i], 'date', day_date)
				Vue.set(state.active_trip.itinerary[i], 'date_pretty', mixin.methods.tp_date_format(day_date))
				Vue.set(state.active_trip.itinerary[i], 'day_number', i + 1)
			}
		},
		add_day: (state) => {
			let day_date = mixin.methods.tp_add_days_to_date(state.active_trip.start_date, state.active_trip.itinerary.length)
			state.active_trip.itinerary.push({
				date: day_date,
				date_pretty: mixin.methods.tp_date_format(day_date),
				day_number: state.active_trip.itinerary.length + 1,
				activities: [],
				notes: ''
			})
			
		},
		add_activity: (state, day) => {
			day.activities.push({
				description: 'new activity',
			})
		},
		delete_activity: (state, payload) => {
			state.active_trip.itinerary[payload.day_index].activities.splice(payload.activity_index, 1)
		},
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
		update_map_settings: (state, payload) => {
			if(payload.zoom)
				state.map.zoom = payload.zoom

			if(payload.center)
				state.map.center = payload.center
		},
		update_active_day: (state, payload) => {
			let active_day = state.active_trip.itinerary[state.active_trip.itinerary_navigation.show_day_index]
			switch (payload.property) {
				case 'notes':
					active_day.notes = payload.value
					break
				default:
					console.log('Unkown active day property: ' + payload.property)
			}
		},
		update_active_activity: (state, payload) => {
			let dirty = true
			let active_activity = state.active_trip.itinerary[state.active_trip.itinerary_navigation.show_day_index].activities[state.active_trip.itinerary_navigation.show_activity_index]
			switch (payload.property) {
				case 'description':
					active_activity.description = payload.value
					break
				default:
					console.log('Unkown active activity property: ' + payload.property)
					dirty = false
			}
			state.active_trip.dirty = dirty
		},
		update_active_trip: (state, payload) => {
			let dirty = true
			switch (payload.property) {
				case 'name':
					state.active_trip.name = payload.value
					break
				case 'start_date':
					state.active_trip.start_date = payload.value
					break
				case 'map_center':
					state.active_trip.map_center.lat = payload.value.lat
					state.active_trip.map_center.lng = payload.value.lng
					break
				case 'map_zoom':
					state.active_trip.map_zoom = parseInt(payload.value)
					break
				case 'valid':
					state.active_trip.valid = payload.value
					dirty = state.active_trip.dirty // I.e. don't update dirty flag when just checking if valid
					break
				case 'dirty':
					state.active_trip.dirty = payload.value
					break
				default:
					console.log('Unkown active_trip property: ' + payload.property)
					dirty = false
			}
			state.active_trip.dirty = dirty
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
