Router.route('/mapker-admin', {
 	name: 'adminMain',
 	template: 'adminMain',
	layoutTemplate: 'adminMain',
	yieldRegions: {
		'adminPlaces': {to: 'content'}
	},
	waitOn: function () { return Meteor.subscribe('placesToValidate'); },
	data: function () { 
		templateData = {
			placesToValidate: Places.find()
		}
		return templateData;
	}
});

Router.route('/mapker-admin/places/:_id/edit', {
 	name: 'adminPlaceEdit',
 	template: 'adminPlaceEdit',
	layoutTemplate: 'adminMain',
	yieldRegions: {
		'adminPlaceEdit': {to: 'content'}
	},
	waitOn: function () { 
		return Meteor.subscribe('place', this.params._id);
	},
	data: function () {
		return Places.findOne({_id: this.params._id});
	},
	before: function () {
		if (this.data()) {
			this.subscribe('users', this.data().administrators);
		};
	}
});