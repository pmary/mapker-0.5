Meteor.startup(function(){
    Mapbox.load();
});

Template.search.rendered = function() {
	this.autorun(function () {
		if (Mapbox.loaded()) {
			L.mapbox.accessToken = 'pk.eyJ1IjoibWFwa2VyIiwiYSI6IkdhdGxLZUEifQ.J3Et4F0n7-rX2oAQHaf22A';
			var map = L.mapbox.map('map', 'examples.map-i86nkdio')
			.setView([40, -74.50], 9);
		}
	});
}