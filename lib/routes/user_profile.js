/**
 * Doc: https://github.com/iron-meteor/iron-router/blob/devel/Guide.md
 */

/*var getUserData = function() {
  console.log(this.);
  return Meteor.subscribe('user');
}
Router.onBeforeAction(getUserData, {only: ['userProfile', 'userProfileBio', 'userProfileSkills']});*/

var focusPoint = function() {
  setTimeout(function() {
    $('#profile-avatar-bg').focusPoint();
    $('#profile-cover-bg').focusPoint();
  }, 100);
}

var needToCreateProfile = function() {
  var params = this.params;
  var id = params._id;
  if (Meteor.user() && id == Meteor.user()._id) {
    var currentUser = Meteor.user();
    if (
      !currentUser.profile.activity
      || !currentUser.profile.countryCode
      || !currentUser.profile.zipcode
    ) {
      Session.set('modalCreateProfileErrors', {});
          
      //console.log("Open modal " + t.$(event.target).data('modal-template'));
      // Open the create profile modal
      Session.set('activeModal', "modalCreateProfile");

      $('#myModal').modal({
        backdrop: 'static',
          keyboard: false
      });
    };
  };
}

Router.onAfterAction(focusPoint, {only: ['userProfile', 'userProfileBio', 'userProfileSkills', 'userProfilePlaces']});
Router.onAfterAction(needToCreateProfile, {only: ['userProfile', 'userProfileBio', 'userProfileSkills', 'userProfilePlaces']});

Router.route('/user/:_id', {
  name: 'userProfile',
  template: 'UserProfileLayout',
  yieldRegions: {
    'UserProfileBio': {to: 'content'}
  },
  //waitOn: function () { return Meteor.subscribe('user', this.params._id); },
  data: function () {
    //return Meteor.users.findOne({_id: this.params._id})
  }
});

Router.route('/user/:_id/bio', {
  name: 'userProfileBio',
  template: 'UserProfileBio',
  layoutTemplate: 'UserProfileLayout',
  yieldRegions: {
    'UserProfileBio': {to: 'content'}
  },
  waitOn: function () { return Meteor.subscribe('user', this.params._id); },
  data: function () { 
    templateData = {
      user: Meteor.users.findOne({_id: this.params._id})
    }
    return templateData;
  }
});

Router.route('/user/:_id/skills', {
  name: 'userProfileSkills',
  template: 'UserProfileBio',
  layoutTemplate: 'UserProfileLayout',
  yieldRegions: {
    'UserProfileSkills': {to: 'content'}
  },
  waitOn: function () { return Meteor.subscribe('user', this.params._id); },
  data: function () { 
    templateData = {
      user: Meteor.users.findOne({_id: this.params._id})
    }
    return templateData;
  }
});

Router.route('/user/:_id/places', {
  name: 'userProfilePlaces',
  template: 'userProfilePlaces',
  layoutTemplate: 'UserProfileLayout',
  yieldRegions: {
    'userProfilePlaces': {to: 'content'}
  },
  waitOn: function () { return Meteor.subscribe('user', this.params._id); },
  data: function () { 
    templateData = {
      user: Meteor.users.findOne({_id: this.params._id}),
      places: Places.find({administrators: this.params._id})
    }
    return templateData;
  }
});