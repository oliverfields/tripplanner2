<template>
	<div>
		<a href="#" @click="show({view: 'overview'})"><font-awesome-icon icon="chevron-left" /> Overview</a> <a href="#" @click="show({view: 'day_view', day_index: 99})"><font-awesome-icon icon="chevron-left" /> Day</a>
		<h1>Activity view</h1>
		Currently editing activity {{ this.$parent.activity_index }} on day {{ this.$parent.day_index }}
	</div>
</template>

<script>
	export default {
		name: 'ItineraryTabActivityView',
		data () {
			return {
			}
		},
		components: {
		},
		methods: {
			show(args) {
				this.$emit('show', args)
			}
		}
	}
</script>