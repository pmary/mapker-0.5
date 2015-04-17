/**
 * Doc: https://github.com/iron-meteor/iron-router/blob/devel/Guide.md
 */

/*var getUserData = function() {
  console.log(this.);
  return Meteor.subscribe('user');
}
Router.onBeforeAction(getUserData, {only: ['userProfile', 'userProfileBio', 'userProfileSkills']});*/

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
  },
  after: function() {
    return Meteor.subscribe('userPlaces', this.params._id);
  }
});