<template>
	<i
		@click="set_map_bounds(route.map_bounds)"
		class="fa fa-route"
		:title="'Show route ' + route.name + ' ' + route.distance_km + 'km'"
		:style="{ color: route.color_hex }"
	/>

</template>

<script>
	export default {
		name: 'RouteLink',
		props: [
			'route',
		],
		methods: {
			set_map_bounds(bounds) {
				this.$store.commit('set_map_bounds', bounds)
			},
		}
	}
</script>

<style>
	i {
		cursor: pointer;
	}
</style>