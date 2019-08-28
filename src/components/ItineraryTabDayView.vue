<template>
	<div>
		<a href="#" @click="show({view: 'overview'})"><font-awesome-icon icon="chevron-left" /> Overview</a>
		<h1>Day view</h1>
		Currently editing day {{ this.$parent.day_index }}
		<a href="#" @click="show({view: 'activity_view', day_index: 99, activity_inded: 66})">Activity 66</a>
	</div>
</template>

<script>
	export default {
		name: 'ItineraryTabDayVeiw',
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