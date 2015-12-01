Router.route('/create-an-event', {
  name: 'createEvent',
  template: 'createEvent',
  onAfterAction: function () {
    $('body,html').scrollTop(0);
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/create-an-event');
  }
});

Router.route('/events/:_id', {
  name: 'eventProfile',
  template: 'eventProfileLayout',
  yieldRegions: {
    'eventProfileAbout': {to: 'content'}
  },
  onAfterAction: function () {
    $('body,html').scrollTop(0);
  },
  waitOn: function () {
  },
  data: function () {
  },
  after: function () {

  }
});

Router.route('/events/:_id/about', {
  name: 'eventProfileAbout',
  template: 'eventProfileAbout',
  layoutTemplate: 'eventProfileLayout',
  yieldRegions: {
    'eventProfileAbout': {to: 'content'}
  },
  waitOn: function () {
    return Meteor.subscribe('event', this.params._id);
  },
  data: function () {
    var templateData = {
      event: Events.findOne({_id: this.params._id})
    };
    return templateData;
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/events/'+this.params._id+'/about');

    // Set the tab as active
    $('.event-profile-page .nav li').removeClass('active');
    $('.event-profile-page .nav li#nav-about').addClass('active');
  }
});
