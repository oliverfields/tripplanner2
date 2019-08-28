<template>
	<div>
		<h1>Overveiw</h1>
		<a href="#" @click="show({view: 'day_view', day_index: 99})">Edit day 99</a>
		<a href="#" @click="show({view: 'activity_view', day_index: 99, activity_index: 66})">Edit activity 66</a>
	</div>
</template>

<script>
	export default {
	name: 'ItineraryTabOverveiw',
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