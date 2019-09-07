<template>
	<form>
		<div v-for="(day, day_index) in this.$store.state.active_trip.itinerary">
			<div v-for="(activity, activity_index) in day.activities">
				<div class="activity" v-show="show_activity(day_index, activity_index)">
					<div class="row">
						<div class="col-md-12">
							<div class="form-group">
								<label for="activity_description">Description</label>
								<input
									:class="activity_description_class"
									v-model="activity_description"
								/>
								<div class="invalid-feedback"><i class="fa fa-exclamation-triangle" /> Description can only use letters and numbers</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<div class="form-group">
								<label for="activity_coordinates">Marker coordinates</label>
								<input
									:class="activity_coordinates_class"
									v-model="activity_coordinates"
								/>
								<small id="coordinates-help" class="form-text text-muted">Latitude, Longitude</small>
								<div class="invalid-feedback"><i class="fa fa-exclamation-triangle" /> Format must be xx.xxxx,yy.yyyy</div>
							</div>
							<a style="margin-top: 1rem; display: block;" href="#" @click="use_current_map_center"><i class="fa fa-map-marked-alt" /> Use current map center</a>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<div class="form-group">
								<label for="activity_marker_icon">Marker icon</label>
								<div>
									<div class="selected_marker_icon" :style="activity_marker_color_css"><i :class="activity_marker_icon" /></div>
									<div class="available_marker_colors">
<!--
										<span style="background-color: #FFFFFF;" @click="activity_marker_color = 'white'">&nbsp;</span>
-->
										<span style="background-color: #EB7D7F;" @click="activity_marker_color = 'lightred'">&nbsp;</span>
										<span style="background-color: #D63E2A;" @click="activity_marker_color = 'red'">&nbsp;</span>
										<span style="background-color: #A23336;" @click="activity_marker_color = 'darkred'">&nbsp;</span>
										<span style="background-color: #F69730;" @click="activity_marker_color = 'orange'">&nbsp;</span>
										<span style="background-color: #FFCB92;" @click="activity_marker_color = 'beige'">&nbsp;</span>
										<span style="background-color: #BBF970;" @click="activity_marker_color = 'lightgreen'">&nbsp;</span>
										<span style="background-color: #72AF26;" @click="activity_marker_color = 'green'">&nbsp;</span>
										<span style="background-color: #728224;" @click="activity_marker_color = 'darkgreen'">&nbsp;</span>
										<span style="background-color: #8ADAFF;" @click="activity_marker_color = 'lightblue'">&nbsp;</span>
										<span style="background-color: #38AADD;" @click="activity_marker_color = 'blue'">&nbsp;</span>
										<span style="background-color: #0067A3;" @click="activity_marker_color = 'darkblue'">&nbsp;</span>
										<span style="background-color: #436978;" @click="activity_marker_color = 'cadetblue'">&nbsp;</span>
										<span style="background-color: #D252B9;" @click="activity_marker_color = 'purple'">&nbsp;</span>
										<span style="background-color: #5B396B;" @click="activity_marker_color = 'darkpurple'">&nbsp;</span>
										<span style="background-color: #FF91EA;" @click="activity_marker_color = 'pink'">&nbsp;</span>
										<span style="background-color: #A3A3A3;" @click="activity_marker_color = 'lightgray'">&nbsp;</span>
										<span style="background-color: #575757;" @click="activity_marker_color = 'gray'">&nbsp;</span>
										<span style="background-color: #000000;" @click="activity_marker_color = 'black'">&nbsp;</span>
									</div>
									<div class="available_marker_icons">
										<i class="fa fa-circle" @click="activity_marker_icon = 'circle'"/>
										<i class="fa fa-bed" @click="activity_marker_icon = 'bed'"/>
										<i class="fa fa-campground" @click="activity_marker_icon = 'campground'"/>
										<i class="fa fa-mountain" @click="activity_marker_icon = 'mountain'"/>
										<i class="fa fa-eye" @click="activity_marker_icon = 'eye'"/>
										<i class="fa fa-utensils" @click="activity_marker_icon = 'utensils'"/>
										<i class="fa fa-coffee" @click="activity_marker_icon = 'coffee'"/>
										<i class="fa fa-beer" @click="activity_marker_icon = 'beer'"/>
										<i class="fa fa-wine-glass" @click="activity_marker_icon = 'wine-glass'"/>
										<i class="fa fa-glass-martini" @click="activity_marker_icon = 'glass-martini'"/>
										<i class="fa fa-shopping-cart" @click="activity_marker_icon = 'shopping-cart'"/>
										<i class="fa fa-shopping-basket" @click="activity_marker_icon = 'shopping-basket'"/>
										<i class="fa fa-money-bill-alt" @click="activity_marker_icon = 'money-bill-alt'"/>
										<i class="fa fa-envelope" @click="activity_marker_icon = 'envelope'"/>
										<i class="fa fa-gas-pump" @click="activity_marker_icon = 'gas-pump'"/>
										<i class="fa fa-plus-square" @click="activity_marker_icon = 'plus-square'"/>
										<i class="fa fa-tint" @click="activity_marker_icon = 'tint'"/>
										<i class="fa fa-cross" @click="activity_marker_icon = 'cross'"/>
										<i class="fa fa-train" @click="activity_marker_icon = 'train'"/>
										<i class="fa fa-bus" @click="activity_marker_icon = 'bus'"/>
										<i class="fa fa-car" @click="activity_marker_icon = 'car'"/>
										<i class="fa fa-plane" @click="activity_marker_icon = 'plane'"/>
										<i class="fa fa-ship" @click="activity_marker_icon = 'ship'"/>
										<i class="fa fa-bicycle" @click="activity_marker_icon = 'bicycle'"/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</form>
</template>

<script>
	export default {
		name: 'ItineraryTabActivityView',
		data() {
			return {
				tmp_activity_coordinates: null,
				tmp_activity_description_is_valid: true
			}
		},
		methods: {
			use_current_map_center() {
				console.log('Setting map senter in activity')
				console.log(this.$store.getters.map_settings.center)

				this.$store.commit('update_active_activity', {property: 'marker_coordinates', value: this.$store.getters.map_settings.center})
				this.tmp_activity_coordinates =  this.tp_latlng_2_str(this.$store.getters.map_settings.center)
			},
			validate_activity_coordinates() {
				let latlng_valid = false
				let action = 'remove'

				if(this.tmp_activity_coordinates == null || this.tmp_activity_coordinates == '')
					 latlng_valid = true
				else {
					let latlng_object = this.tp_str_2_latlng(this.tmp_activity_coordinates)
					if(latlng_object)
						latlng_valid = true
				}

				if(!latlng_valid)
					action = 'add'
				this.$store.commit('error_registry', {action: action, tmp_id: this.activity.tmp_id + '_marker_coordinates'})

				return latlng_valid
			},
			show_activity(day_index, activity_index) {
				return this.$store.state.active_trip.itinerary_navigation.show_day_index == day_index && this.$store.state.active_trip.itinerary_navigation.show_activity_index == activity_index
			},
			validate_activity_description() {

				let is_valid = true
				let action = 'remove'

				if(this.activity_description == '')
					is_valid = false
				else {
					let re = this.$XRegExp("^[\\p{L}\\d\ \\_\\-]+$")
					is_valid = re.test(this.activity_description)
					
				}

				if(!is_valid)
					action = 'add'
				this.$store.commit('error_registry', {action: action, tmp_id: this.activity.tmp_id + '_description'})

				return is_valid
			},
		},
		computed: {
			activity_marker_color_css: function() {
				let colors = {
					//white: '#FFFFFF',
					lightred: '#EB7D7F',
					red: '#D63E2A',
					darkred: '#A23336',
					orange: '#F69730',
					beige: '#FFCB92',
					lightgreen: '#BBF970',
					green: '#72AF26',
					darkgreen: '#728224',
					lightblue: '#8ADAFF',
					blue: '#38AADD',
					darkblue: '#0067A3',
					cadetblue: '#436978',
					purple: '#D252B9',
					darkpurple: '#5B396B',
					pink: '#FF91EA',
					lightgray: '#A3A3A3',
					gray: '#575757',
					black: '#000000',
				}

				return 'background-color: ' + colors[this.activity_marker_color] + ';'
			},
			activity_description_class: function() {
				return {
					'form-control': true,
					'is-invalid': !this.validate_activity_description()
				}
			},
			activity: function() {
				return this.$store.state.active_trip.itinerary[
						this.$store.state.active_trip.itinerary_navigation.show_day_index
					]
					.activities[
						this.$store.state.active_trip.itinerary_navigation.show_activity_index
					]
			},
			activity_description: {
				get() {
					return this.activity.description
				},
				set(value) {
					this.$store.commit('update_active_activity', {property: 'description', value: value})
				}
			},
			activity_marker_icon: {
				get() {
					return 'fa fa-' + this.activity.marker_icon
				},
				set(value) {
					this.$store.commit('update_active_activity', {property: 'marker_icon', value: value})
				}
			},
			activity_marker_color: {
				get() {
					return this.activity.marker_color
				},
				set(value) {
					this.$store.commit('update_active_activity', {property: 'marker_color', value: value})
				}
			},
			activity_coordinates_class: function() {
				return {
					'form-control': true,
					'is-invalid': !this.validate_activity_coordinates()
				}
			},
			activity_coordinates: {
				get() {
					if(this.activity.marker_coordinates)
						this.tmp_activity_coordinates =  this.tp_latlng_2_str(this.activity.marker_coordinates)
					return this.tmp_activity_coordinates
				},
				set(value) {
					// If tmp value is valid latlng update store, else just update tmp value, so don't mess up bindings to map
					this.tmp_activity_coordinates = value

					if(this.validate_activity_coordinates()){
						this.$store.commit('update_active_activity', { property: 'marker_coordinates', value: this.tp_str_2_latlng(this.tmp_activity_coordinates) })
					}
					else
						this.$store.commit('update_active_activity', { property: 'marker_coordinates', value: null })
				}
			},
		}
	}
</script>

<style>
	.selected_marker_icon {
		font-size: 2rem;
		width: 4rem;
		float: left;
		border-radius: 50%;
		background-color: red;
		height: 4rem;
		padding-top: .5rem;
		color: white;
		margin-right: 1rem;
		text-align: center;
	}
	.available_marker_icons, .available_marker_colors {
		color: #999;
		cursor: pointer;
		position: relative;
		top: 0;
		left: 0;
		width: 270px;
		display: inline-block;
	}
	.available_marker_icons i, .available_marker_colors span {
		margin-right: .5rem;
		width: 1rem;
		text-align: center;
	}
	.available_marker_colors span {
		height: 1rem;
		width: 1rem;
		display: inline-block;
		border: solid 1px #000;
	}
</style>