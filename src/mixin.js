export default {
	methods: {
		tp_date_format: function(date) {
			return date.getFullYear() + '-' + ("0"+(date.getMonth()+1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2)
		},
		tp_date_from_str: function(str) {
			// Assumes string is in format yyyy-mm-dd
			let d = str.split('-')
			return new Date(d[0],d[1],d[2]);
		},
		tp_str_2_latlng: function(string) {
			string = string.replace(' ', '')
			string = string.split(',')

			if(string.length != 2) { // Must have not been exactly one comma
				return false
			}

			let lat_number = 0
			let lng_number = 0

			try {
				lat_number = Number(string[0])
			}
			catch {
				return false
			}

			try {
				lng_number = Number(string[1])
			}
			catch {
				return false
			}

			let latlng = {
				lat: lat_number,
				lng: lng_number
			}

			if(this.tp_valid_latlng(latlng))
				return latlng
		},
		tp_latlng_2_str: function(latlng) {
			if(this.tp_valid_latlng(latlng))
				return latlng.lat + ',' + latlng.lng
			return false
		},
		tp_valid_latlng: function(latlng) {
			if(
				typeof latlng.lat === 'number'
				&& !isNaN(latlng.lat)
				&& typeof latlng.lng === 'number'
				&& !isNaN(latlng.lng)
			) {
				return true
			}
			return false
		},
		tp_date_difference: function(d1, d2) {
			if(d1.getTime() > d2.getTime())
				return 0

			let timeDiff = Math.abs(d2.getTime() - d1.getTime())
			return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1
		}
	}
}
