Template.userProfilePlaces.rendered = function() {
	this.autorun(function () {
		console.log(this);
		//Meteor.subscribe('place', this.params._id);
	});
}