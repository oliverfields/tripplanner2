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

	if(!trip.tmp_id)
		trip.tmp_id = 'trip_' + new_id()

	if(!trip.start_date)
		trip.start_date = new Date()

	if(!trip.map_center)
		trip.map_center = { lat: 51.1739726374, lng: -1.82237671048 }

	if(!trip.map_zoom)
		trip.map_zoom = 2

	if(!trip.itinerary){
		trip.itinerary = []
		trip.itinerary.push({})
		Vue.set(trip.itinerary[0], 'notes', '')
	}

	if(!trip.itinerary_navigation)
		trip.itinerary_navigation = {}

	if(!trip.itinerary_navigation.show_day_index)
		trip.itinerary_navigation.show_day_index = null

	if(!trip.itinerary_navigation.show_activity_index)
		trip.itinerary_navigation.show_activity_index = null

	if(!trip.itinerary_navigation.show_route_index)
		trip.itinerary_navigation.show_route_index = null

	if(!trip.error_registry)
		trip.error_registry = []

	if(!trip.dirty)
		trip.dirty = false

	// Controls for itinerary tab content
	trip.itinerary_navigation = {
		show_day_index: null,
		show_activity_index: null,
		show_route_index: null,
	}

	// Ensure itinerary, activities and routes have required properties
	for (let i = 0; i < trip.itinerary.length; ++i) {
		if(!trip.itinerary[i].tmp_id)
			Vue.set(trip.itinerary[i], 'tmp_id', 'day_' + new_id())

		if(!trip.itinerary[i].activities) {
			Vue.set(trip.itinerary[i], 'activities', [])
			trip.itinerary[i].activities.push({})
		}

		if(!trip.itinerary[i].routes) {
			Vue.set(trip.itinerary[i], 'routes', [])
		}

		for(let n = 0; n < trip.itinerary[i].activities.length; n++) {
			if(!trip.itinerary[i].activities[n].tmp_id)
				Vue.set(trip.itinerary[i].activities[n], 'tmp_id', 'activity_' + new_id())

			if(!trip.itinerary[i].activities[n].marker_coordinates)
				Vue.set(trip.itinerary[i].activities[n], 'marker_coordinates', null)

			if(!trip.itinerary[i].activities[n].marker_icon)
				Vue.set(trip.itinerary[i].activities[n], 'marker_icon', 'circle')

			if(!trip.itinerary[i].activities[n].marker_color)
				Vue.set(trip.itinerary[i].activities[n], 'marker_color', 'red')

			if(!trip.itinerary[i].activities[n].marker_color_hex)
				Vue.set(trip.itinerary[i].activities[n], 'marker_color_hex', '#D63E2A')

			if(!trip.itinerary[i].activities[n].description)
				Vue.set(trip.itinerary[i].activities[n], 'description', 'new activity')
		}
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
			center: { lat: 51.1739726374, lng: -1.82237671048 },
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

			if(payload.map_center)
				context.commit('update_map_settings', { center: context.state.active_trip.map_center })

			if(payload.map_zoom)
				context.commit('update_map_settings', { zoom: context.state.active_trip.map_zoom })
		},
		setItems: context => {
			context.commit('setItems')
		},
		create_trip: context => {
			let new_trip = setup_trip({})
			context.commit('create_trip', new_trip)
			context.dispatch('set_active_trip', new_trip)
			context.commit('set_itinerary_dates')
			context.commit('update_active_trip', {property: 'dirty', value: false})
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

					// Convert firestore coordinates to tp style
					if(trip.map_center)
						trip.map_center = convert_firebase_geopoint(trip.map_center)

					// .. and for activity coordinates
					for(let i=0; i < trip.itinerary.length; i++) {
						for(let n=0; n < trip.itinerary[i].activities.length; n++) {
							if(trip.itinerary[i].activities[n].marker_coordinates)
								trip.itinerary[i].activities[n].marker_coordinates = convert_firebase_geopoint(trip.itinerary[i].activities[n].marker_coordinates)
						}
					}

					trip = setup_trip(trip)

					trips.push(trip)
				})
				context.commit('set_trips', trips)
			})
		},
		show_tab: (context, object) => {
			// Display tab based on object tmp_id

			// Show overview
			if(object == null) {
				context.commit('update_itinerary_navigation', { property: 'show_day_index', value: null })
				context.commit('update_itinerary_navigation', { property: 'show_activity_index', value: null })
				context.commit('update_itinerary_navigation', { property: 'show_route_index', value: null })
				return true
			}

			// Look through days first
			for (let i = 0; i < context.state.active_trip.itinerary.length; i++) {
				if(object.tmp_id === context.state.active_trip.itinerary[i].tmp_id) {
					context.commit('update_itinerary_navigation', { property: 'show_day_index', value: i })
					context.commit('update_itinerary_navigation', { property: 'show_activity_index', value: null })
					context.commit('update_itinerary_navigation', { property: 'show_route_index', value: null })
					return true
				}
			}

			// If not day it chould be an activity
			for (let i = 0; i < context.state.active_trip.itinerary.length; i++) {
				for(let n = 0; n < context.state.active_trip.itinerary[i].activities.length; n++) {
					if(object.tmp_id === context.state.active_trip.itinerary[i].activities[n].tmp_id) {
						context.commit('update_itinerary_navigation', { property: 'show_day_index', value: i })
						context.commit('update_itinerary_navigation', { property: 'show_activity_index', value: n })
						context.commit('update_itinerary_navigation', { property: 'show_route_index', value: null })
						return true
					}
				}
			}

			// Guess it must be a route then
			for (let i = 0; i < context.state.active_trip.itinerary.length; i++) {
				for(let m = 0; m < context.state.active_trip.itinerary[i].routes.length; m++) {
					if(object.tmp_id === context.state.active_trip.itinerary[i].routes[m].tmp_id) {
						context.commit('update_itinerary_navigation', { property: 'show_day_index', value: i })
						context.commit('update_itinerary_navigation', { property: 'show_activity_index', value: null })
						context.commit('update_itinerary_navigation', { property: 'show_route_index', value: m })
						return true
					}
				}
			}
			return false
		},
		show_activity: (context, payload) => {
			context.commit('update_itinerary_navigation', { property: 'show_day_index', value: payload.day_index })
			context.commit('update_itinerary_navigation', { property: 'show_activity_index', value: payload.activity_index })
			context.commit('update_itinerary_navigation', { property: 'show_route_index', value: null })
		},
		show_route: (context, payload) => {
			context.commit('update_itinerary_navigation', { property: 'show_day_index', value: payload.day_index })
			context.commit('update_itinerary_navigation', { property: 'show_activity_index', value: null })
			context.commit('update_itinerary_navigation', { property: 'show_route_index', value: payload.route_index })
		},
		add_activity_and_show: (context, payload) => {
			let day_index = payload.day_index
			let day = payload.day
			context.commit('add_activity', day)
			let activity_index = day.activities.length - 1 // New activity is appended to end, so index = length - 1
			context.dispatch('show_activity', {day_index: day_index, activity_index: activity_index})
		},
		add_route_and_show: (context, payload) => {
			let day_index = payload.day_index
			let day = payload.day
			context.commit('add_route', day)
			let route_index = day.routes.length - 1 // New route is appended to end, so index = length - 1
			context.dispatch('show_route', {day_index: day_index, route_index: route_index})
		},
		add_day_and_show: (context) => {
			context.commit('add_day')
			//let day_index = context.state.active_trip.itinerary.length - 1 // New day is appended to itinerary end, so index = length - 1
			context.commit('set_itinerary_dates')

		},
		update_active_trip: (context, payload) => {
			context.commit('update_active_trip', payload)
			if(payload.property == 'start_date')
				context.commit('set_itinerary_dates')
		},
	},
	mutations: {
		toggle_loading: (state) => {
			console.log('toggling loading')
			if(!state.hasOwnProperty('is_loading'))
				Vue.set(state, 'is_loading', false)
			state.is_loading = !state.is_loading
		},
		error_registry: (state, payload) => {
			let errors = state.active_trip.error_registry

			switch (payload.action) {
				case 'add':
					if(!errors.includes(payload.tmp_id))
						errors.push(payload.tmp_id)
					break
				case'remove':
					for(let i = 0; i < errors.length; i++){
						if(errors[i] === payload.tmp_id)
							errors.splice(i, 1)
					}
					break
				default:
					console.log('Invalid payload: ' + payload)
			}
		},
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
			state.active_trip.itinerary.push({})
			let i = state.active_trip.itinerary.length - 1 // New index is length - 1
			Vue.set(state.active_trip.itinerary[i], 'date', day_date)
			Vue.set(state.active_trip.itinerary[i], 'date_pretty', mixin.methods.tp_date_format(day_date))
			Vue.set(state.active_trip.itinerary[i], 'tmp_id', 'day_' + new_id())
			Vue.set(state.active_trip.itinerary[i], 'activities', [])
			Vue.set(state.active_trip.itinerary[i], 'routes', [])
			Vue.set(state.active_trip.itinerary[i], 'notes', '')

			state.active_trip.dirty = true
		},
		add_activity: (state, day) => {
			day.activities.push({})
			let i = day.activities.length - 1 // New index is length - 1
			Vue.set(day.activities[i], 'description', 'new activity')
			Vue.set(day.activities[i], 'marker_icon', 'circle')
			Vue.set(day.activities[i], 'marker_color', 'red')
			Vue.set(day.activities[i], 'marker_color_hex', '#D63E2A')
			Vue.set(day.activities[i], 'marker_coordinates', null)
			Vue.set(day.activities[i], 'tmp_id', 'activity_' + new_id())
		},
		add_route: (state, day) => {
			day.routes.push({})
			let i = day.routes.length - 1 // New index is length - 1
			Vue.set(day.routes[i], 'name', '')
			Vue.set(day.routes[i], 'color_hex', '#FF0000')
			Vue.set(day.routes[i], 'url', null)
			Vue.set(day.routes[i], 'tmp_id', 'route_' + new_id())
		},
		delete_activity: (state, payload) => {
			state.active_trip.itinerary[payload.day_index].activities.splice(payload.activity_index, 1)
		},
		delete_route: (state, payload) => {
			state.active_trip.itinerary[payload.day_index].routes.splice(payload.route_index, 1)
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
				case 'show_route_index':
					if(typeof payload.value != 'number') payload.value = null
					state.active_trip.itinerary_navigation.show_route_index = payload.value
					break
				default:
					console.log('Unkown itinerary_navigation property: ' + payload.property)
			}
		},
		update_map_settings: (state, payload) => {
			if(payload.zoom)
				state.map.zoom = parseInt(payload.zoom)

			if(payload.center) {
				state.map.center = payload.center
			}
		},
		update_active_day: (state, payload) => {
			let active_day = state.active_trip.itinerary[state.active_trip.itinerary_navigation.show_day_index]
			let dirty = true

			switch (payload.property) {
				case 'notes':
					active_day.notes = payload.value
					break
				default:
					console.log('Unkown active day property: ' + payload.property)
			}
			state.active_trip.dirty = dirty
		},
		update_active_route: (state, payload) => {
			let active_route = state.active_trip.itinerary[state.active_trip.itinerary_navigation.show_day_index].routes[state.active_trip.itinerary_navigation.show_route_index]
			let dirty = true

			switch (payload.property) {
				case 'name':
					active_route.name = payload.value
					break
				case 'url':
					active_route.url = payload.value
					break
				case 'color_hex':
					active_route.color_hex = payload.value
					break
				default:
					console.log('Unkown active route property: ' + payload.property)
					dirty = false
			}
			state.active_trip.dirty = dirty
		},
		update_active_activity: (state, payload) => {
			let dirty = true
			let active_activity = state.active_trip.itinerary[state.active_trip.itinerary_navigation.show_day_index].activities[state.active_trip.itinerary_navigation.show_activity_index]
			switch (payload.property) {
				case 'description':
					active_activity.description = payload.value
					break
				case 'marker_coordinates':
					active_activity.marker_coordinates = payload.value
					break
				case 'marker_icon':
					active_activity.marker_icon = payload.value
					break
				case 'marker_color':
					active_activity.marker_color = payload.value

					let colors = {
						//white: '#FFFFFF',
						lightred: '#EB7D7F',
						red: '#D63E2A',
						darkred: '#A23336',
						orange: '#F69730',
						beige: '#FFCB92',
						lightgreen: '#BBF970',
						green: '#72AF26',
						darkgreen: '#728224',
						lightblue: '#8ADAFF',
						blue: '#38AADD',
						darkblue: '#0067A3',
						cadetblue: '#436978',
						purple: '#D252B9',
						darkpurple: '#5B396B',
						pink: '#FF91EA',
						lightgray: '#A3A3A3',
						gray: '#575757',
						black: '#000000',
					}

					active_activity.marker_color_hex = colors[payload.value]

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
				case 'dirty':
					dirty = payload.value
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
