<template>
	<click-confirm button-size="sm" :messages="{ title: 'Imported route will overwrite existing route'}">
		<input type="file" accept=".gpx" @change="on_upload_file_change">
	</click-confirm>
</template>

<script>
	export default {
		name: 'ImportGPXRoute',
		props: [
			'route',
		],
		methods: {
			on_upload_file_change(e) {
				let files = e.target.files || e.dataTransfer.files
				let reader = new FileReader()
				let store = this.$store
				let self = this

				if (!files.length)
					return // Exit, no file selected

				reader.readAsText(files[0], "UTF-8")

				reader.onload = function (event) {
					let route = self.parse_route(event.target.result)
				}

				reader.onerror = function (event) {
					console.error('error reading file')
				}
			},

			parse_route(data) {
				let gpxParse = require('gpx-parse')
				let route = null
				let latlngs = []
				let self = this

				gpxParse.parseGpx(data, function(error, gpx) {
					// Gpx can contain a track, a route and waypoints, use the largest one for plotting route
					if(gpx.tracks.length > gpx.routes.length && gpx.tracks.length > gpx.waypoints.length)
						route = gpx.tracks
					else if(gpx.routes.length > gpx.tracks.length && gpx.routes.length > gpx.waypoints.length)
						route = gpx.routes
					else if(gpx.waypoints.length > gpx.tracks.length && gpx.waypoints.length > gpx.routes.length)
						route = gpx.waypoints
					else
						route = gpx.routes

					route = route[0]

					for (let s = 0; s < route.segments.length; s++) {
						for (let p = 0; p < route.segments[s].length; p++) {
							latlngs.push([route.segments[s][p].lat,route.segments[s][p].lon])
						}
					}

					self.$store.dispatch('replace_route_points', { route: self.route, points: latlngs })

				})

			},

		}
	}
</script>

<style scoped>
</style>