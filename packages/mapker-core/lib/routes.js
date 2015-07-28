/**
 * Doc: https://github.com/iron-meteor/iron-router/blob/devel/Guide.md
 */

setActiveMenuItem = function() {
   // Set the menu item as active
   $('#primary-navbar #main-menu li').removeClass('active');
   $('#primary-navbar').removeClass('home-ui');
   switch(this.url) {
     case '/search/places':
     break;

     case '/search/skills':
     break;

     default:

     break;
   }
 };
 Router.onAfterAction(setActiveMenuItem);

//////////////////////
//  General routes  //
//////////////////////
Router.route('/', {
	name: 'Home',
	template: 'Home',
	after: function(argument) {
		// Set the menu UI
	    $('#primary-navbar').addClass('home-ui');

	    // Send the pageview to GA
		ga('send', 'pageview', '/');
	}
});

Router.route('/terms-of-service', {
	name: 'termsOfService',
	template: 'termsOfService',
	after: function() {
		// Send the pageview to GA
		ga('send', 'pageview', '/terms-of-service');
	}
});

Router.route('/dmca', {
	name: 'dmca',
	template: 'dmca',
	after: function() {
		// Send the pageview to GA
		ga('send', 'pageview', '/dmca');
	}
});

Router.route('/privacy', {
	name: 'privacyPolicy',
	template: 'privacyPolicy',
	after: function() {
		// Send the pageview to GA
		ga('send', 'pageview', '/privacy');
	}
});


/////////////////////////////
//  Administration routes  //
/////////////////////////////
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
		};
		return templateData;
	},
	before: function () {
		if (!Meteor.user() || Meteor.user()._id != 'i4FxWHYGyQr3LyN4x') {
			Router.go('/');
		}
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
		}
		if (this.data()) {
			this.subscribe('users', this.data().administrators);
		}
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
		}
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
		}
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
		}
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
    };
    return templateData;
  },
	before: function () {
    if (!Meteor.user() || Meteor.user()._id != 'i4FxWHYGyQr3LyN4x') {
			Router.go('/');
		}
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
		}
    this.next();
  }
});
