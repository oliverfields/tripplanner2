<template>
	<div id="app">
		{{ t }}
		<router-view/>
	</div>
</template>

<script>
export default {
	name: 'App',
	computed: {
		t() {
			return this.$store.state.active_trip.id
		}
	}
}
</script>

<style>
</style>
