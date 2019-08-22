<template>
	<div id="workspace">
		<div id="tabs_pane" ref="tab_pane">
			<Tabs />
		</div>
		<div id="map_pane" v-bind="map_pane" :style="{'width': this.map_pane.width, 'height': this.map_pane.height}">
			<p>{{ this.map_pane.width }} x {{ this.map_pane.height }}</p>
			<Map :map_dimensions="{width: this.map_pane.width, height: this.map_pane.height}" />
		</div>
	</div>
</template>

<script>
import Tabs from '@/components/Tabs'
import Map from '@/components/Map'

export default {
	name: 'Workspace',
	data: function () {
		return {
			map_pane: {
				width: 0,
				height: 0
			}
		}
	},
	components: {
		Tabs,
		Map
	},
	methods: {
		handleResize() {
			// map_pane width
			this.map_pane.width = (window.innerWidth - 400) + 'px' // 400 is hardcoded tabs width..


			// map_pane height
			let available_height = window.innerHeight - 50 // 50 is hardcoded nav height..
			let tabs_height = this.$refs.tab_pane.clientHeight

			if(tabs_height > available_height) {
				this.map_pane.height = tabs_height + 'px'
			}
			else {
				this.map_pane.height = available_height + 'px'
			}
			console.log('map_pane dims: ' + this.map_pane.width + ' x ' + this.map_pane.height)
		}
	},
	computed: {
	},
	mounted() {
		window.addEventListener('resize', this.handleResize)
		this.handleResize()
	},
	destroyed() {
		window.removeEventListener('resize', this.handleResize)
	}
}
</script>

<style>
#workspace {
margin-top: 50px;
}
#tabs_pane {
padding: 1rem;
width: 400px;
position: absolute;
top: 50px;
left: 0px;
}
#map_pane {
padding: 0;
background-color: #DBF4FF;
position: absolute;
top: 50px;
left: 400px;
}
</style>