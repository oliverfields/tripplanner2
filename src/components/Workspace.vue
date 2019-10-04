<template>
	<div id="workspace">
			<div id="tabs-pane">
				<Tabs />
			</div>
			<div id="map-pane">
				<Map />
			</div>
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
		},
		mounted() {
		},
	}
</script>

<style>
</style>