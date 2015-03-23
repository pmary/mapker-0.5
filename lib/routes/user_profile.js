/**
 * Doc: https://github.com/iron-meteor/iron-router/blob/devel/Guide.md
 */

Router.route('/user/:_id', {
  name: 'userProfile',
  template: 'UserProfileLayout',
  yieldRegions: {
    'UserProfileBio': {to: 'content'}
  },
  data: function () {
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
});

Router.route('/user/:_id/bio', {
  name: 'userProfileBio',
  template: 'UserProfileBio',
  layoutTemplate: 'UserProfileLayout',
  yieldRegions: {
    'UserProfileBio': {to: 'content'}
  }
});

Router.route('/user/:_id/skills', {
  name: 'userProfileSkills',
  template: 'UserProfileBio',
  layoutTemplate: 'UserProfileLayout',
  yieldRegions: {
    'UserProfileSkills': {to: 'content'}
  }
});