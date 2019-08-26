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

			return {
				lat: string[0],
				lng: string[1]
			}
		},
		tp_latlng_2_str: function(latlng) {
			return latlng.lat + ',' + latlng.lng
		}
	}
}
