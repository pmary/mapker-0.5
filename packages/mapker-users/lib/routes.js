/////////////
//  Hooks  //
/////////////
needToCreateProfile = function() {
  var params = this.params;
  var id = params._id;
  if (Meteor.user() && id == Meteor.user()._id) {
    var currentUser = Meteor.user();
    if (
      !currentUser.profile.activity ||
      !currentUser.profile.address.countryCode ||
      !currentUser.profile.address.zipcode ||
      !currentUser.profile.address.city ||
      !currentUser.profile.address.loc
    ) {
      Session.set('modalCreateProfileErrors', {});

      //console.log("Open modal " + t.$(event.target).data('modal-template'));
      // Open the create profile modal
      Session.set('activeModal', "modalCreateProfile");

      $('#myModal').modal({
        backdrop: 'static',
          keyboard: false
      });
    }
  }
};

//////////////////////////////////////////////////////////////
//  Account creation / connexion / password lost and reset  //
//////////////////////////////////////////////////////////////
/**
 * Doc: https://github.com/iron-meteor/iron-router/blob/devel/Guide.md
 */
Router.route('/login', {
	name: 'UserLogin',
	template: 'UserLogin',
	after: function () {
		// Send the pageview to GA
		ga('send', 'pageview', '/login');
	}
});

Router.route('/logout', function () {
	Meteor.logout();
 	//this.render('Home');
 	Router.go('Home');
});

Router.route('/join', {
 	name: 'userJoin',
	template: 'userJoin',
	after: function () {
		// Send the pageview to GA
		ga('send', 'pageview', '/join');
	}
});

Router.route('/reset-password', function () {
	this.render('UserForgotPassword');
});

Router.route('/reset-password/:resetToken', function () {
	this.render('UserForgotPassword');
},{
	name: 'reset-password.token'
});

////////////////////
//  User profile  //
////////////////////
/**
 * Doc: https://github.com/iron-meteor/iron-router/blob/devel/Guide.md
 */
Router.onAfterAction(needToCreateProfile, {only: ['userProfile', 'userProfileBio', 'userProfileSkills', 'userProfilePlaces', 'userProfileNetwork']});

Router.route('/user/:_id', {
  name: 'userProfile',
  template: 'UserProfileLayout',
  yieldRegions: {
    'UserProfileBio': {to: 'content'}
  },
  //waitOn: function () { return Meteor.subscribe('user', this.params._id); },
  data: function () {
    //return Meteor.users.findOne({_id: this.params._id})
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/user/'+this.params._id);
  }
});

Router.route('/user/:_id/bio', {
  name: 'userProfileBio',
  template: 'UserProfileBio',
  layoutTemplate: 'UserProfileLayout',
  yieldRegions: {
    'UserProfileBio': {to: 'content'}
  },
  waitOn: function () {
    return [
      Meteor.subscribe('user', this.params._id),
      Meteor.subscribe("countriesList")
    ];
  },
  data: function () {
    templateData = {
      user: Meteor.users.findOne({_id: this.params._id})
    };
    return templateData;
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/user/'+this.params._id+'/bio');

    // Set the tab as active
    $('.user-profile-page .nav li').removeClass('active');
    $('.user-profile-page .nav li#nav-bio').addClass('active');

    //TAPi18n.subscribe("countriesList");
  }
});

Router.route('/user/:_id/skills', {
  name: 'userProfileSkills',
  template: 'UserProfileBio',
  layoutTemplate: 'UserProfileLayout',
  yieldRegions: {
    'UserProfileSkills': {to: 'content'}
  },
  waitOn: function () {
    return [
      Meteor.subscribe('user', this.params._id),
      Meteor.subscribe("countriesList")
    ];
  },
  data: function () {
    templateData = {
      user: Meteor.users.findOne({_id: this.params._id})
    };
    return templateData;
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/user/'+this.params._id+'/skills');

    // Set the tab as active
    $('.user-profile-page .nav li').removeClass('active');
    $('.user-profile-page .nav li#nav-skills').addClass('active');
  }
});

Router.route('/user/:_id/places', {
  name: 'userProfilePlaces',
  template: 'userProfilePlaces',
  layoutTemplate: 'UserProfileLayout',
  yieldRegions: {
    'userProfilePlaces': {to: 'content'}
  },
  waitOn: function () {
    return [
      Meteor.subscribe('user', this.params._id),
      Meteor.subscribe('countriesList'),
      Meteor.subscribe('userPlaces', this.params._id)
    ];
  },
  data: function () {
    templateData = {
      user: Meteor.users.findOne({_id: this.params._id}),
      places: Places.find()
    };
    return templateData;
  },
  after: function() {
    // Send the pageview to GA
    ga('send', 'pageview', '/user/'+this.params._id+'/places');

    // Set the tab as active
    $('.user-profile-page .nav li').removeClass('active');
    $('.user-profile-page .nav li#nav-places').addClass('active');

    //return Meteor.subscribe('userPlaces', this.params._id);
  }
});

Router.route('/user/:_id/network', {
  name: 'userProfileNetwork',
  template: 'userProfileNetwork',
  layoutTemplate: 'UserProfileLayout',
  yieldRegions: {
    'userProfileNetwork': {to: 'content'}
  },
  waitOn: function () {
    return [
      Meteor.subscribe('user', this.params._id),
      Meteor.subscribe("countriesList")
    ];
  },
  data: function () {
    templateData = {
      user: Meteor.users.findOne({_id: this.params._id})
    };
    return templateData;
  },
  after: function() {
    // Send the pageview to GA
    ga('send', 'pageview', '/user/'+this.params._id+'/network');

    // Set the tab as active
    $('.user-profile-page .nav li').removeClass('active');
    $('.user-profile-page .nav li#nav-network').addClass('active');

    return Meteor.subscribe('followedUsers', this.params._id);
  }
});
