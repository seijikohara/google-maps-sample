function CircleMarker(map, lat, lng, distance) {
  this.set('map', map);
  this.set('position', new google.maps.LatLng(lat, lng));

  // Center marker
  var marker = new google.maps.Marker({
    draggable: true
  });
  marker.bindTo('map', this);
  marker.bindTo('position', this);

  // Center circle
  var circle = new google.maps.Circle({
    fillColor: '#efefef',
    fillOpacity: 0.5,
    strokeColor: '#000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  circle.bindTo('center', this, 'position');
  circle.bindTo('map', this);
  circle.bindTo('radius', this);

  // Resize marker
  var sizer = new google.maps.Marker({
    draggable: true,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 5,
      strokeWeight: 2,
      fillColor: 'white',
      strokeColor: 'gray',
      fillOpacity: 1
    },
  });
  sizer.bindTo('map', this);
  sizer.bindTo('position', this, 'sizer_position');
  var me = this;
  google.maps.event.addListener(sizer, 'drag', function () {
    var sizerPosition = me.get('sizer_position');
    var center = me.get('position');
    var distance = google.maps.geometry.spherical.computeDistanceBetween(sizerPosition, center);
    me.set('radius', distance);
  });

  this.set('radius', 50000);
  this.bindTo('bounds', circle);
  this.position_changed();
}
CircleMarker.prototype = new google.maps.MVCObject();
CircleMarker.prototype.position_changed = function () {
  var bounds = this.get('bounds');
  if (bounds) {
    var lng = bounds.getNorthEast().lng();
    var position = new google.maps.LatLng(this.get('position').lat(), lng);
    this.set('sizer_position', position);
  }
};


var App = App || {};
App.Map = App.Map || {};

App.Map.map = null;
App.Map.init = function () {
  var position = {
    lat: -34.397,
    lng: 150.644
  };
  App.Map.map = new google.maps.Map(document.getElementById('map'), {
    center: position,
    scrollwheel: false,
    zoom: 8
  });

  App.Map.marker = new CircleMarker(App.Map.map, position.lat, position.lng, 15);

  google.maps.event.addListener(App.Map.marker, 'distance_changed', function () {
    console.log('distance_changed');
    console.log(this.radius)
  });
  google.maps.event.addListener(App.Map.marker, 'position_changed', function () {
    console.log('position_changed');
    console.log(this.position)
  });
};
