L.Polyline.plotter = L.Polyline.extend({
	_lineMarkers: [],
	_editIcon: L.divIcon({className: 'leaflet-div-icon leaflet-editing-icon'}),
	_halfwayPointMarkers: [],
	_existingLatLngs: [],
	options: {
		weight: 2,
		color: '#f00',
		readOnly: false,
	},
	lineMarkers: function() { return this._lineMarkers },
	initialize: function (latlngs, options){
		this._setExistingLatLngs(latlngs)
		L.Polyline.prototype.initialize.call(this, [], options)
	},
	onAdd: function (map) {
		L.Polyline.prototype.onAdd.call(this, map)
		this._map = map
		this._plotExisting()
		if(!this.options.readOnly){
			this._bindMapClick()
		}
	},
	getPlotLatLngs: function() {
		let latlngs = []
		for(index in this._lineMarkers){
			latlngs.push([
				this._lineMarkers[index].getLatLng().lat,
				this._lineMarkers[index].getLatLng().lng
			])
		}
		return latlngs
	},
	setLatLngs: function(latlngs){
		L.Polyline.prototype.setLatLngs.call(this, latlngs)
	},
	setReadOnly: function(readOnly){
		let visibility = 'visible'
		if(readOnly || readOnly  == 'undefined'){
			var markerFunction = '_unbindMarkerEvents'
			var halfwayMarkerFunction = '_unbindHalfwayMarker'
			this._unbindMapClick()
			visibility = 'hidden'
		}else{
			var markerFunction = '_bindMarkerEvents'
			var halfwayMarkerFunction = '_bindHalfwayMarker'
			this._bindMapClick()
		}
		if(typeof markerFunction !== 'undefined'){
			this.options.readOnly = readOnly
			for(index in this._halfwayPointMarkers){
				this[halfwayMarkerFunction](this._halfwayPointMarkers[index])
				this._halfwayPointMarkers[index]._icon.style.visibility = visibility
			}
			for(index in this._lineMarkers){
				this[markerFunction](this._lineMarkers[index])
				this._lineMarkers[index]._icon.style.visibility = visibility
			}
		}
	},
	_bindMapClick: function(){
		this._map.on('click', this._addNewMarker, this)
	},
	_unbindMapClick: function(){
		this._map.off('click', this._addNewMarker, this)
	},
	_setExistingLatLngs: function(latlngs){
		this._existingLatLngs = latlngs
	},
	_replot: function(){
		this._redraw()
		this._redrawHalfwayPoints()
	},
	_getNewMarker: function(latlng, options){
		return new L.marker(latlng, options)
	},
	_unbindMarkerEvents: function(marker){
		marker.off('click', this._removePoint, this)
		marker.off('drag', this._replot, this)
		marker.dragging.disable()
	},
	_bindMarkerEvents: function(marker){
		marker.on('click', this._removePoint, this)
		marker.on('drag', this._replot, this)
		marker.dragging.enable()
	},
	_unbindHalfwayMarker: function(marker){
		marker.off('click', this._addHalfwayPoint, this)
	},
	_bindHalfwayMarker: function(marker){
		marker.on('click', this._addHalfwayPoint, this)
	},
	_addToMapAndBindMarker: function(newMarker){
		newMarker.addTo(this._map)
		if(!this.options.readOnly){
		this._bindMarkerEvents(newMarker)
		}
	},
	clearPoints: function() {
		for (let i = this._lineMarkers.length - 1; i > -1; i--) {
			this._removePoint({target: this._lineMarkers[i]})
		}
	},
	_removePoint: function(e){
		if(this._lineMarkers.indexOf(e.target) > -1) {
			this._map.removeLayer(this._lineMarkers[this._lineMarkers.indexOf(e.target)])
			this._lineMarkers.splice(this._lineMarkers.indexOf(e.target), 1)
		}
		else {
			this._map.removeLayer(this._halfwayPointMarkers[this._halfwayPointMarkers.indexOf(e.target)])
			this._halfwayPointMarkers.splice(this._halfwayPointMarkers.indexOf(e.target), 1)
		}

		this._replot()
	},
	addNewMarker: function(latlng) {
		this._addNewMarker({
			latlng: new L.LatLng(
				latlng[0],
				latlng[1]
			)
		})
	},
	_addNewMarker: function(e){
		var newMarker = this._getNewMarker(e.latlng, { icon: this._editIcon })
		this._addToMapAndBindMarker(newMarker)
		this._lineMarkers.push(newMarker)
		this._replot()
	},
	_redrawHalfwayPoints: function(){
		for(index in this._halfwayPointMarkers){
			this._map.removeLayer(this._halfwayPointMarkers[index])
		}
		this._halfwayPointMarkers = []
		for(index in this._lineMarkers){
			index = parseInt(index)
			if(typeof this._lineMarkers[index + 1] === 'undefined'){
				return
			}
			var halfwayMarker = new L.Marker([
				(this._lineMarkers[index].getLatLng().lat + this._lineMarkers[index + 1].getLatLng().lat) / 2,
				(this._lineMarkers[index].getLatLng().lng + this._lineMarkers[index + 1].getLatLng().lng) / 2,
			], { icon: this._editIcon, opacity: 0.5 }).addTo(this._map)
			halfwayMarker.index = index
			if(!this.options.readOnly){
				this._bindHalfwayMarker(halfwayMarker)
			}
			this._halfwayPointMarkers.push(halfwayMarker)
		}
	},
	_addHalfwayPoint: function(e){
		var newMarker = this._getNewMarker(e.latlng, { icon: this._editIcon })
		this._addToMapAndBindMarker(newMarker)
		this._lineMarkers.splice(e.target.index + 1, 0, newMarker)
		this._replot()
	},
	_plotExisting: function(){
		for(index in this._existingLatLngs){
		this._addNewMarker({
			latlng: new L.LatLng(
			this._existingLatLngs[index][0],
			this._existingLatLngs[index][1]
			)
		})
		}
	},
	_redraw: function(){
		this.setLatLngs([])
		this.redraw()
		for(index in this._lineMarkers){
			this.addLatLng(this._lineMarkers[index].getLatLng())
		}

		//this._lineMarkers[0]._icon.style.backgroundColor = '#00FF00'

		this.redraw()
	}
})

L.Polyline.Plotter = function(latlngs, options){
	return new L.Polyline.plotter(latlngs, options)
}