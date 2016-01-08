/////////////
//  Hooks  //
/////////////
var needToCreateProfile = function() {
  var params = this.params;
  var id = params._id;
  if (Meteor.user() && id === Meteor.user()._id) {
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
      $('#myModal').show();
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
  layoutTemplate: 'CoreMainLayout',
	yieldRegions: {
		'UserLogin': {to: 'content'},
    'primaryNavbar': {to: 'nav'},
    'footer': {to: 'footer'}
	},
  onAfterAction: function () {
    $('body,html').scrollTop(0);
  },
	after: function () {
		// Send the pageview to GA
		ga('send', 'pageview', '/login');
	}
});

Router.route('/logout', {
  name: 'Logout',
  layoutTemplate: 'CoreMainLayout',
	yieldRegions: {
		'Logout': {to: 'content'},
    'primaryNavbar': {to: 'nav'},
    'footer': {to: 'footer'}
	},
  onAfterAction: function () {
    Meteor.logout();
    $('body,html').scrollTop(0);
    Router.go('Home');
  }
});

Router.route('/join', {
 	name: 'userJoin',
  layoutTemplate: 'CoreMainLayout',
	yieldRegions: {
		'userJoin': {to: 'content'},
    'primaryNavbar': {to: 'nav'},
    'footer': {to: 'footer'}
	},
  onAfterAction: function () {
    $('body,html').scrollTop(0);
  },
	after: function () {
		// Send the pageview to GA
		ga('send', 'pageview', '/join');
	}
});

Router.route('/join/:token/:email/:firstname/:lastname', {
 	name: 'userJoinViaInvitation',
  layoutTemplate: 'CoreMainLayout',
	yieldRegions: {
		'userJoinViaInvitation': {to: 'content'},
    'primaryNavbar': {to: 'nav'},
    'footer': {to: 'footer'}
	},
  onAfterAction: function () {
    $('body,html').scrollTop(0);
  },
  data: function () {
    var templateData = {
      token: this.params.token,
      email: this.params.email,
      firstname: this.params.firstname,
      lastname: this.params.lastname
    };
    return templateData;
  },
	after: function () {
		// Send the pageview to GA
		ga('send', 'pageview', '/join');
	}
});

Router.route('/reset-password', {
  name: 'UserForgotPassword',
  layoutTemplate: 'CoreMainLayout',
	yieldRegions: {
		'UserForgotPassword': {to: 'content'},
    'primaryNavbar': {to: 'nav'},
    'footer': {to: 'footer'}
	},
  onAfterAction: function () {
    $('body,html').scrollTop(0);
  }
});

Router.route('/reset-password/:resetToken', {
  name: 'UserResetPassword',
  layoutTemplate: 'CoreMainLayout',
	yieldRegions: {
		'UserForgotPassword': {to: 'content'},
    'primaryNavbar': {to: 'nav'},
    'footer': {to: 'footer'}
	},
  onAfterAction: function () {
    $('body,html').scrollTop(0);
  },
  data: function () {
    return {resetToken: this.params.resetToken};
  }
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
  layoutTemplate: 'UserProfileLayout',
	yieldRegions: {
		'UserProfileBio': {to: 'content'},
    'primaryNavbar': {to: 'nav'}
	},
  onAfterAction: function () {
    $('body,html').scrollTop(0);
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
  layoutTemplate: 'coreProfileLayout',
	yieldRegions: {
    'primaryNavbar': {to: 'nav'},
    //'': {to: 'profilheader'},
    //'': {to: 'profilInfos'},
    //'': {to: 'profilNav'},
		'UserProfileBio': {to: 'profilContent'},
    'footer': {to: 'footer'}
	},
  waitOn: function () {
    return [
      Meteor.subscribe('user', this.params._id),
      Meteor.subscribe("countriesList")
    ];
  },
  data: function () {
    var templateData = {
      type: 'user',
      doc: Meteor.users.findOne(
        {_id: this.params._id},
        {
          transform: function (doc) {
            // Un-nest the profile values to flatenize the user document
            // and uniformize the doc model accross collections (project, place...)
            let formatedDoc = doc.profile;
            formatedDoc._id = doc._id;

            return formatedDoc;
          }
        }
      )
    };
    return templateData;
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/user/'+this.params._id+'/bio');

    // Set the tab as active
    $('.user-profile-page .nav li').removeClass('active');
    $('.user-profile-page .nav li#nav-bio').addClass('active');
  }
});

Router.route('/user/:_id/skills', {
  name: 'userProfileSkills',
  layoutTemplate: 'UserProfileLayout',
	yieldRegions: {
		'UserProfileSkills': {to: 'content'},
    'primaryNavbar': {to: 'nav'}
	},
  waitOn: function () {
    return [
      Meteor.subscribe('user', this.params._id),
      Meteor.subscribe("countriesList")
    ];
  },
  data: function () {
    var templateData = {
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
  layoutTemplate: 'UserProfileLayout',
	yieldRegions: {
		'userProfilePlaces': {to: 'content'},
    'primaryNavbar': {to: 'nav'}
	},
  waitOn: function () {
    return [
      Meteor.subscribe('user', this.params._id),
      Meteor.subscribe('countriesList'),
      Meteor.subscribe('userPlaces', this.params._id)
    ];
  },
  data: function () {
    var templateData = {
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
  }
});

Router.route('/user/:_id/events', {
  name: 'userProfileEvents',
  layoutTemplate: 'UserProfileLayout',
	yieldRegions: {
		'userProfileEvents': {to: 'content'},
    'primaryNavbar': {to: 'nav'}
	},
  waitOn: function () {
    return [
      Meteor.subscribe('user', this.params._id),
      Meteor.subscribe('countriesList'),
      Meteor.subscribe('userEvents', this.params._id)
    ];
  },
  data: function () {
    var templateData = {
      user: Meteor.users.findOne({_id: this.params._id}),
      userEvents: Events.find()
    };
    return templateData;
  },
  after: function() {
    // Send the pageview to GA
    ga('send', 'pageview', '/user/'+this.params._id+'/events');

    // Set the tab as active
    $('.user-profile-page .nav li').removeClass('active');
    $('.user-profile-page .nav li#nav-events').addClass('active');
  }
});

Router.route('/user/:_id/network', {
  name: 'userProfileNetwork',
  layoutTemplate: 'UserProfileLayout',
	yieldRegions: {
		'userProfileNetwork': {to: 'content'},
    'primaryNavbar': {to: 'nav'}
	},
  waitOn: function () {
    return [
      Meteor.subscribe('user', this.params._id),
      Meteor.subscribe('countriesList'),
      Meteor.subscribe('userNetwork', this.params._id)
    ];
  },
  data: function () {
    var user = Meteor.users.findOne({_id: this.params._id}),
    network = [];
    // If the user has a network
    if ( user && user.profile.network && user.profile.network.users && user.profile.network.users.connected ) {
      network = user.profile.network.users.connected;
    }

    var templateData = {
      user: user,
      userNetwork: Meteor.users.find({_id: { $in: network}})
    };
    return templateData;
  },
  after: function() {
    // Send the pageview to GA
    ga('send', 'pageview', '/user/'+this.params._id+'/network');

    // Set the tab as active
    $('.user-profile-page .nav li').removeClass('active');
    $('.user-profile-page .nav li#nav-network').addClass('active');
  }
});

Router.route('/user/:_id/communities', {
  name: 'userProfileCommunities',
  layoutTemplate: 'UserProfileLayout',
	yieldRegions: {
		'userProfileCommunities': {to: 'content'},
    'primaryNavbar': {to: 'nav'}
	},
  waitOn: function () {
    return [
      Meteor.subscribe('user', this.params._id),
      Meteor.subscribe('countriesList'),
      Meteor.subscribe('userCommunities', this.params._id)
    ];
  },
  data: function () {
    var templateData = {
      user: Meteor.users.findOne({_id: this.params._id}),
      communities: Communities.find()
    };
    return templateData;
  },
  after: function() {
    // Send the pageview to GA
    ga('send', 'pageview', '/user/'+this.params._id+'/communities');

    // Set the tab as active
    $('.user-profile-page .nav li').removeClass('active');
    $('.user-profile-page .nav li#nav-communities').addClass('active');
  }
});
