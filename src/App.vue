<template>
	<div id="app">
		<loading :active.sync="this.$store.state.is_loading" :can-cancel="false"></loading>
		<router-view></router-view>
	</div>
</template>

<script>
	import Loading from 'vue-loading-overlay';
	import 'vue-loading-overlay/dist/vue-loading.css';

	window.$ = require('jquery')
	window.JQuery = require('jquery')

	export default {
		name: 'App',
		components: {
			Loading
		},
	}
</script>

<style>
</style>
