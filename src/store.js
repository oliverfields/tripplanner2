import Vue from 'vue'
import Vuex from 'vuex'
import { auth, s3, s3_bucket } from '@/main'
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

		for (let r = 0; r < trip.itinerary[i].routes.length; r++) {
			if(!trip.itinerary[i].routes[r].tmp_id)
				Vue.set(trip.itinerary[i].routes[r], 'tmp_id', 'route_' + new_id())
		}
	}

	return trip
}


function s3_get_json (key) {
	console.log('getting key: ' + key)
	return new Promise((resolve, reject) => {
		s3.getObject({ Bucket: s3_bucket, Key: key }, (err, data) => {
			if (err) return reject(err)

			try {
				const bodyString = data.Body.toString('utf8')
				const obj = JSON.parse(bodyString)
				resolve(obj)
			} catch (e) {
				reject(err)
			}
		})
	})
}

function s3_upload(key, content) {
	console.log('Uploading to s3: ' + key)
	let params = {
		Bucket: s3_bucket,
		Key: key,
		Body: content
	}

	let options = {
		partSize: 10 * 1024 * 1024, // 10 MB
		queueSize: 10
	}

	s3.upload(params, options, function (err, data) {
			if (!err) {
				//console.log(data); // successful response
			}
			else {
				console.error('Unable to upload to s3: ' + err)
			}
	})
}

function s3_remove(key) {
	console.log('Removing from s3: ' + key)
	var params = {
		Bucket: s3_bucket,
		Key: key
	};
	s3.deleteObject(params, function(err, data) {
		if (!err) {}
		else {console.error('Unable to delete from s3: ' + err)}
	})
}

function s3_remove_folder(folder) {
	console.log('Removing folder from s3: ' + folder)
	if (folder.charAt(folder.length-1) != '/')
		folder = folder + '/' // Must end with slash

	let currentData
	let params = {
		Bucket: s3_bucket,
		Prefix: folder
	};

	return s3.listObjects(params).promise().then(data => {
		if (data.Contents.length === 0) {
			throw new Error('List of objects empty.')
		}

		currentData = data

		params = {Bucket: s3_bucket}
		params.Delete = {Objects:[]}

		currentData.Contents.forEach(content => {
			params.Delete.Objects.push({Key: content.Key})
		});

		return s3.deleteObjects(params).promise()
	}).then(() => {
		if (currentData.Contents.length === 1000) {
			s3_remove_folder(callback)
		} else {
			return true
		}
	})
}


var id_counter = 0
function new_id() {
	id_counter += 1
	return id_counter
}

export const store = new Vuex.Store({
	strict: true,
	state: {
		trips_list: null,
		active_trip: false,
		map: {
			zoom: 2,
			center: { lat: 51.1739726374, lng: -1.82237671048 },
			bounds: null,
			active_route: null,
		},
		
	},
	getters: {
		map_settings: state => {
			return state.map
		},
		get_trips: state => {
			let tmp_trips = state.trips_list
			if(tmp_trips) {
				return tmp_trips.slice().sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
			}
			return tmp_trips
		}
	},
	actions: {
		save_active_trip: (context) => {
			context.commit('save_trips_list')
			context.commit('save_active_trip')
		},
		replace_active_route: (context, route) => {
			let active_route = context.state.map.active_route
			if(route == null && active_route == null) {
				//console.log('both null doing nothing')
			}
			else if(route == null && active_route != null) {
				//console.log('overwriting active route with null')
				context.commit('set_map_active_route', null)
			}
			else if(route != null && active_route == null) {
				//console.log('Setting route because active route is null')
				context.commit('set_map_active_route', route)
			}
			else {
				if(route.tmp_id == active_route.tmp_id) {
					//console.log('route is already active, doing nothing')
				}
				else {
					//console.log('both something, saving active and replacing with route')
					context.commit('save_map_active_route')
					context.commit('set_map_active_route', route)
				}
			}
		},
		set_active_trip: (context, trip_id) => {

			let uid = auth.currentUser.uid

			// First try to get user trips file, if not create it
			s3_get_json(uid + '/' + trip_id + '/trip.json')
			.then(
				function(json) {
					let trip = setup_trip(json)

					// Set trip name and add reference to trips_list id
					for (let i = 0; i < context.state.trips_list.length; i++) {
						if(context.state.trips_list[i].id == trip_id) {
							trip.name = context.state.trips_list[i].name
							trip.trip_id = trip_id
						}
					}

					context.commit('set_active_trip', trip)

					context.commit('set_itinerary_dates')

					if(payload.map_center)
						context.commit('update_map_settings', { center: context.state.active_trip.map_center })

					if(payload.map_zoom)
						context.commit('update_map_settings', { zoom: context.state.active_trip.map_zoom })

				},
				function error(error) {
					console.error('Error getting trip: ' + error)
				}
			)
		},
		create_trip: context => {
			let new_trip = setup_trip({})
			let uid = auth.currentUser.uid

			// Get new trip id
			let new_id = 1
			let trips_list = context.state.trips_list

			for(let i = 0; i < trips_list.length; i++) {
				if(new_id <= trips_list[i].id ) {
					new_id = Number(trips_list[i].id) + 1
				}
			}

			new_trip.trip_id = new_id

			context.commit('add_to_trips_list', { name: new_trip.name, id: new_id })
			context.commit('set_active_trip', new_trip)
			context.commit('set_itinerary_dates')
			context.commit('save_active_trip')
		},
		delete_active_trip: ({commit, state}, payload) => {
			let uid = auth.currentUser.uid
			let active_trip = state.active_trip

			// First remove evidence of trip from persistent storage
			s3_remove_folder(uid + '/' + active_trip.trip_id + '/')

			// then delete trip from vuex store
			commit('delete_from_trips_list') // Requires active_trip to delete
			commit('delete_active_trip') 
		},
		set_trips: context => {
			let uid = auth.currentUser.uid

			// First try to get user trips file, if not create it
			s3_get_json(uid + '/trips_list.json')
			.then(
				function(json) {
					context.commit('set_trips_list', json)
				},
				function error(error) {
					if(error.code == "NoSuchKey")
						context.commit('set_trips_list', []) // Just initialize tirps list
					else
						console.error('Error getting trips_list from s3: ' + error)
				}
			)
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
		replace_route_points: (context, payload) => {
			context.commit('replace_route_points', payload)
			context.commit('update_active_trip', { property: 'dirty', value: true })
		}
	},
	mutations: {
		add_to_trips_list: (state, payload) => {
			let uid = auth.currentUser.uid
			state.trips_list.push({ name: payload.name, id: payload.id })
			s3_upload(uid + '/trips_list.json',  JSON.stringify(state.trips_list))
		},
		set_trips_list: (state, payload) => {
			state.trips_list = payload
		},
		replace_route_points: (state, payload) => {
			console.log('replacing points on route: ' + payload.route.tmp_id + ' with:')
			console.log(payload.points)
			payload.route.points = payload.points
		},
		save_map_active_route: (state) => {
			console.log('Need to saving active route now')
		},
		set_map_active_route: (state, payload) => {
			state.map.active_route = payload
		},
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

			state.active_trip.dirty = true
		},
		add_route: (state, day) => {
			day.routes.push({})
			let i = day.routes.length - 1 // New index is length - 1
			Vue.set(day.routes[i], 'name', '')
			Vue.set(day.routes[i], 'color_hex', '#FF0000')
			Vue.set(day.routes[i], 'url', null)
			Vue.set(day.routes[i], 'points', [])
			Vue.set(day.routes[i], 'tmp_id', 'route_' + new_id())

			state.active_trip.dirty = true
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
		delete_from_trips_list: (state) => {
			let delete_id = state.active_trip.trip_id
			let uid = auth.currentUser.uid
			state.trips_list.forEach(
				function (trip, index, array) {
					if(trip.id == delete_id) {
						state.trips_list.splice(index, 1) // remove 1 element starting at index from array
						s3_upload(uid + '/trips_list.json',  JSON.stringify(state.trips_list))
					}
				}
			)
		},
		save_trips_list: (state) => {
			for (let i = 0; i < state.trips_list.length; i++) {
				if (state.trips_list[i].id == state.active_trip.trip_id) {
					state.trips_list[i].name = state.active_trip.name
					break
				}
			}
			let uid = auth.currentUser.uid
			s3_upload(uid + '/trips_list.json',  JSON.stringify(state.trips_list))
		},
		save_active_trip: (state) => {
			// Only save relevant stuff
			let uid = auth.currentUser.uid
			let trip = JSON.parse(JSON.stringify(state.active_trip)) // Hehe, horrible way to dump stuff
			let trip_id = Number(trip.trip_id)

			// Delete superflous stuff
			for(let p of [
				'dirty',
				'error_registry',
				'itinerary_navigation',
				'name', // Gets set from trips_list
				'trip_id', // Gets set from trips_list
				'tmp_id'
			]) {
				delete trip[p]
			}

			for (let d = 0; d < trip.itinerary.length; d++) {
				delete trip.itinerary.tmp_id
				delete trip.itinerary[d].date
				delete trip.itinerary[d].date_pretty
				delete trip.itinerary[d].day_number
				delete trip.itinerary[d].tmp_id

				for (let a = 0; a < trip.itinerary[d].activities.length; a++) {
					delete trip.itinerary[d].activities[a].tmp_id
				}

				for (let r = 0; r < trip.itinerary[d].routes.length; r++) {
					delete trip.itinerary[d].routes[r].tmp_id
				}
			}

			s3_upload(uid + '/' + trip_id + '/trip.json',  JSON.stringify(trip))

			state.active_trip.dirty = false
		}
	},
})
