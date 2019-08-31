<template>
	<div>
		View:<input v-model="itinerary_view" /><br />
		Day:<input v-model="day_index" /><br />
		Activity:<input v-model="activity_index" />
<!--
		<div class="breadcrumb">
			<a href="#" @click="show({view: 'overview'})"><font-awesome-icon icon="chevron-left" /> Overview</a>
		</div>
		<div class="breadcrumb">
			<a href="#" @click="show({view: 'overview'})"><font-awesome-icon icon="chevron-left" /> Overview</a> <a href="#" @click="show({view: 'day_view', day_index: this.$parent.day_index })"><font-awesome-icon icon="chevron-left" /> {{ this.$store.state.active_trip.itinerary[this.$parent.day_index].date_pretty }}</a>
		</div>
-->
		<div v-if="itinerary_view != 'overview'">
			<a
				href="#"
				@click="show({view: 'overview'})"
			><font-awesome-icon icon="chevron-left" /> Overview</a>
			<a v-if="itinerary_view = 'activity_view'"
				href="#" @click="show({view: 'day_view', day_index: this.day_index })"
			><font-awesome-icon icon="chevron-left" />Day</a>
		</div>

		<div v-if="this.itinerary_view === 'day_view'">
			<ItineraryTabDayView @show="show" />
		</div>
		<div v-else-if="this.itinerary_view === 'activity_view'">
			<ItineraryTabActivityView  @show="show" />
		</div>
		<div v-else>
			<ItineraryTabOverview  @show="show" />
		</div>
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
				day_index: 0,
				activity_index: 0,
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
				if(args.day_index != null) {
					console.log('Setting day_index: ' + args.day_index)
					this.day_index = args.day_index
				}

				if(args.activity_index != null)
					this.activity_index = args.activity_index

				console.log('di: ' + this.day_index)
				console.log('ai: ' + this.activity_index)

				if(
					args.view == 'overview'
					|| args.view == 'day_view'
					|| args.view == 'activity_view'
				) {
					console.log('Setting view: ' + args.view)
					this.itinerary_view = args.view
				}
				else {
					console.log('Unknown view: ' + args.view)
				}
			}
		}
	}
</script>