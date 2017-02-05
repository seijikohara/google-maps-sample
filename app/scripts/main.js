function CircleMarker(map, lat, lng, distance) {
  this.set('map', map);
  this.set('position', new google.maps.LatLng(lat, lng));

  var marker = new google.maps.Marker({
    draggable: true
  });
  marker.bindTo('map', this);
  marker.bindTo('position', this);

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

  var sizer = new google.maps.Marker({
    draggable: true,
    icon: {
      url: 'https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png',
      size: new google.maps.Size(10, 10),
      anchor: new google.maps.Point(5, 5)
    },
  });
  sizer.bindTo('map', this);
  sizer.bindTo('position', this, 'sizer_position');
  var me = this;
  google.maps.event.addListener(sizer, 'drag', function () {
    me.setDistance();
  });

  this.set('distance', distance);
  this.bindTo('bounds', circle);
  this.position_changed();
}
CircleMarker.prototype = new google.maps.MVCObject();
CircleMarker.prototype.distance_changed = function () {
  this.set('radius', this.get('distance') * 1000);
};
CircleMarker.prototype.position_changed = function () {
  var bounds = this.get('bounds');
  if (bounds) {
    var lng = bounds.getNorthEast().lng();
    var position = new google.maps.LatLng(this.get('position').lat(), lng);
    this.set('sizer_position', position);
  }
};
CircleMarker.prototype.distanceBetweenPoints_ = function (p1, p2) {
  if (!p1 || !p2) {
    return 0;
  }
  var R = 6371;
  var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
  var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};
CircleMarker.prototype.setDistance = function () {
  var pos = this.get('sizer_position');
  var center = this.get('position');
  var distance = this.distanceBetweenPoints_(center, pos);
  distance = Math.round(distance * 100) / 100;
  this.set('distance', distance);
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
