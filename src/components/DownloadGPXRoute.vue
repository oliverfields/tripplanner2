<template>
	<div>
		<a
			class="btn btn-primary"
			:href="'data:text/xml;charset=utf-8,' + encodeURIComponent(generate_gpx())"
			@click="download_gpx()"
			v-if="route_has_points()"
			:download="route.name + '.gpx'"

		><i class="fa fa-download" /> Download .gpx</a>
	</div>
</template>

<script>
	export default {
		name: 'DownloadGPXRoute',
		props: [
			'route',
		],
		computed: {
		},
		methods: {
			route_has_points:function(){
				if (this.route.points.length > 0)
					return true

				return false
			},
			generate_gpx() {


/*
var xmltext = "<sometag><someothertag></someothertag></sometag>";
var pom = document.createElement('a');

var filename = "file.xml";
var pom = document.createElement('a');
var bb = new Blob([xmltext], {type: 'text/plain'});

pom.setAttribute('href', window.URL.createObjectURL(bb));
pom.setAttribute('download', filename);

pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
pom.draggable = true; 
pom.classList.add('dragout');

pom.click();
*/

				let gpx = '<?xml version="1.0" encoding="UTF-8"?>'
					+ '<gpx xmlns="http://www.topografix.com/GPX/1/1"'
					+ ' creator="Ambulate - Gotta plan"'
					+ ' version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'
					+ ' xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">'
					+ '<metadata>'
					+ '<name>' + this.route.name + '</name>'
					+ '<link href="https://ambulate.org/"><text>Track from ambulate.org</text></link>'
					+ '</metadata>'
					+ '<rte>'
					+ '<name>' + this.route.name + '</name>'

				for (let p = 0; p < this.route.points.length; p++) {
					gpx += '<rtept lat="' + this.route.points[p][0] + '" lon="' + this.route.points[p][1] + '"></rtept>'
					//<ele>81.000000</ele>
					//<time>2010-01-01T00:00:00Z</time>
					//</rtept>
				}

				gpx += '</rte></gpx>'

				return gpx
			},

		}
	}
</script>

<style scoped>
</style>