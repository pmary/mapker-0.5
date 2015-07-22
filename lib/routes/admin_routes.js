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
	},
	before: function () {
		if (!Meteor.user() || Meteor.user()._id != 'i4FxWHYGyQr3LyN4x') {
			Router.go('/');
		};
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
		if (!Meteor.user() || Meteor.user()._id != 'i4FxWHYGyQr3LyN4x') {
			Router.go('/');
		};
		if (this.data()) {
			this.subscribe('users', this.data().administrators);
		};
	}
});

Router.route('/mapker-admin/settings', {
 	name: 'adminSettings',
 	template: 'adminSettings',
	layoutTemplate: 'adminMain',
	yieldRegions: {
		'adminSettings': {to: 'content'}
	},
	before: function () {
		if (!Meteor.user() || Meteor.user()._id != 'i4FxWHYGyQr3LyN4x') {
			Router.go('/');
		};
	}
});

Router.route('/mapker-admin/users', {
 	name: 'adminUsers',
 	template: 'adminUsers',
	layoutTemplate: 'adminMain',
	yieldRegions: {
		'adminUsers': {to: 'content'}
	},
	waitOn: function () {
		return Meteor.subscribe('allUsers');
	},
	data: function () {
		return Meteor.users.find();
	},
	before: function () {
		if (!Meteor.user() || Meteor.user()._id != 'i4FxWHYGyQr3LyN4x') {
			Router.go('/');
		};
	}
});

Router.route('/mapker-admin/users/:_id/edit', {
 	name: 'adminUserEdit',
 	template: 'adminUserEdit',
	layoutTemplate: 'adminMain',
	yieldRegions: {
		'adminUserEdit': {to: 'content'}
	},
	waitOn: function () {
		return Meteor.subscribe('user', this.params._id);
	},
	data: function () {
		return Meteor.users.find({_id: this.params._id});
	},
	before: function () {
		if (!Meteor.user() || Meteor.user()._id != 'i4FxWHYGyQr3LyN4x') {
			Router.go('/');
		};
	}
});

Router.route('/mapker-admin/taxons', {
 	name: 'adminTaxons',
 	template: 'adminTaxons',
	layoutTemplate: 'adminMain',
	yieldRegions: {
		'adminTaxons': {to: 'content'}
	},
  waitOn: function () {
    return Meteor.subscribe('allTaxons');
  },
  data: function () {
    templateData = {
      taxons: Taxons.find({}).fetch()
    }
    return templateData;
  },
	before: function () {
    if (!Meteor.user() || Meteor.user()._id != 'i4FxWHYGyQr3LyN4x') {
			Router.go('/');
		};
    this.next();
  }
});

Router.route('/mapker-admin/taxons/add', {
 	name: 'adminAddTaxon',
 	template: 'adminAddTaxon',
	layoutTemplate: 'adminMain',
	yieldRegions: {
		'adminAddTaxon': {to: 'content'}
	},
	before: function () {
    if (!Meteor.user() || Meteor.user()._id != 'i4FxWHYGyQr3LyN4x') {
			Router.go('/');
		};
    this.next();
  }
});
