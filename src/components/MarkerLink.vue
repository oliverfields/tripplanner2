<template>
	<i
		:class="activity_marker_icon_class(activity)"
		:style="activity_marker_icon_color(activity)"
		v-if="activity.marker_coordinates"
		@click="set_map_center(activity.marker_coordinates)"
		title="Center map on marker"
	/>
</template>

<script>
	export default {
		name: 'MarkerLink',
		props: [
			'activity',
		],
		methods: {
			set_map_center(latlng) {
				this.$store.commit('update_map_settings', { center: latlng })
			},
			activity_marker_icon_class(activity) {
				return 'fa fa-' + activity.marker_icon
			},
			activity_marker_icon_color(activity) {
				return 'color: ' + activity.marker_color_hex
			},
		}
	}
</script>

<style>
	i {
		cursor: pointer;
	}
</style>