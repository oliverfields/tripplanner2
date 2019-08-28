<template>
	<div id="workspace">
		<div id="tabs_pane" ref="tab_pane">
			<Tabs />
		</div>
		<div id="map_pane">
			<Map />
		</div>
	</div>
</template>

<script>
	import Tabs from '@/components/Tabs'
	import Map from '@/components/Map'

	export default {
		name: 'Workspace',
		components: {
			Tabs,
			Map
		},
		methods: {
		},
		computed: {
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
		overflow-x: hidden;
		overflow-y: visible;
		height: calc(100% - 50px);
	}
	#map_pane {
		padding: 0;
		background-color: #DBF4FF;
		position: absolute;
		top: 50px;
		left: 400px;
	}
</style>