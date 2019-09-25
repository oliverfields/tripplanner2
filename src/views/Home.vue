<template>
	<div>
		<Menu />
		<Workspace v-if="this.$store.state.active_trip" />
		<div id="workspace" v-else>
			<p>Go on trip, man;)</p>
		</div>
	</div>
</template>

<script>
	import Menu from '@/components/Menu'
	import Workspace from '@/components/Workspace'

	export default {
		name: 'home',
		components: {
			Menu,
			Workspace
		},
		methods: {
			confirm_unload: function confirm_unload(event) {
				alert('ho')
				console.log(event)
				event.preventDefault()
				// Chrome requires returnValue to be set.
				event.returnValue = ''
				return false
			},
		},
		created() {
			window.addEventListener('beforeunload', (event) => {
				if(this.$store.state.active_trip.dirty) {
					event.preventDefault()
					// Chrome requires returnValue to be set.
					event.returnValue = ''
				}
			}, false)
		},
	}
</script>
