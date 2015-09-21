Router.route('/communities/:_id', {
  name: 'communityProfile',
  template: 'communityProfileLayout',
  yieldRegions: {
    'communityProfileAbout': {to: 'content'}
  },
  waitOn: function () {
  },
  data: function () {
  },
  after: function () {

  }
});

Router.route('/communities/:_id/about', {
  name: 'communityProfileAbout',
  template: 'communityProfileAbout',
  layoutTemplate: 'communityProfileLayout',
  yieldRegions: {
    'communityProfileAbout': {to: 'content'}
  },
  waitOn: function () {
    return Meteor.subscribe('community', this.params._id);
  },
  data: function () {
    templateData = {
      community: Communities.findOne({_id: this.params._id})
    };
    return templateData;
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/communities/'+this.params._id+'/about');

    // Set the tab as active
    $('.community-profile-page .nav li').removeClass('active');
    $('.community-profile-page .nav li#nav-about').addClass('active');
  }
});
