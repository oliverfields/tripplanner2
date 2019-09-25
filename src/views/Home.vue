<template>
	<div>
		<Menu />
		<Workspace v-if="this.$store.state.active_trip" />
		<div v-else class="just-a-thought container d-flex align-items-center justify-content-center">
			<div>A journey of a thousand miles begins with a <a
					class="btn btn-success"
					href="#" @click="create_trip"
				>
					<i class="fa fa-plus" /> New trip
				</a>
			</div>
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
			create_trip() {
				this.$store.dispatch('create_trip')
			},
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

<style scoped>
	.just-a-thought {
		height: 500px;
		font-size: 1.4rem;
		color: #666;
	}
</style>
