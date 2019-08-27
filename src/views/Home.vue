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
		}
	}
</script>
