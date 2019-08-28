<template>
	<div>
		<div v-if="this.itinerary_view === 'day_view'">
			<ItineraryTabDayView @show="show" />
		</div>
		<div v-else-if="this.itinerary_view === 'activity_view'">
			<ItineraryTabActivityView @show="show" />
		</div>
		<div v-else>
			<ItineraryTabOverview @show="show" />
		</div>
		<input v-model="itinerary_view" />
		<input v-model="day_index" />
		<input v-model="activity_index" />
	</div>
</template>

<script>
	import ItineraryTabOverview from '@/components/ItineraryTabOverview'
	import ItineraryTabDayView from '@/components/ItineraryTabDayView'
	import ItineraryTabActivityView from '@/components/ItineraryTabActivityView'
	
	export default {
	name: 'ItineraryTab',
		data () {
			return {
				itinerary_view: 'overview', // overview, day_view, activity_view
				day_index: 0 ,
				activity_index: null,
			}
		},
		components: {
			ItineraryTabOverview,
			ItineraryTabDayView,
			ItineraryTabActivityView,
		},
		methods: {
			show: function(args) {
				console.log(args)
				if(
					args.view == 'overview'
					|| args.view == 'day_view'
					|| args.view == 'activity_view'
				)
					this.itinerary_view = args.view
				else
					console.log('Unknown view: ' + args.view)
				//this.day_index = index

				if(args.day_index)
					this.day_index = args.day_index

				if(args.activity_index)
					this.activity_index = args.activity_index
			}
		}
	}
</script>