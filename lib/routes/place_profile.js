Router.route('/places/:_id', {
  name: 'placeProfile',
  template: 'placeProfileLayout',
  yieldRegions: {
    'placeProfileAbout': {to: 'content'}
  },
  waitOn: function () {
  },
  data: function () {
  },
  after: function () {

  }
});

Router.route('/places/:_id/about', {
  name: 'placeProfileAbout',
  template: 'placeProfileAbout',
  layoutTemplate: 'placeProfileLayout',
  yieldRegions: {
    'placeProfileAbout': {to: 'content'}
  },
  waitOn: function () {
    return Meteor.subscribe('place', this.params._id);
  },
  data: function () {
    templateData = {
      place: Places.findOne({_id: this.params._id})
    }
    return templateData;
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/places/'+this.params._id+'/about');
  }
});

Router.route('/places/:_id/opening-hours', {
  name: 'placeProfileTimetable',
  template: 'placeProfileTimetable',
  layoutTemplate: 'placeProfileLayout',
  yieldRegions: {
    'placeProfileTimetable': {to: 'content'}
  },
  waitOn: function () {
    return Meteor.subscribe('place', this.params._id);
  },
  data: function () {
    templateData = {
      place: Places.findOne({_id: this.params._id}, {reactive: false})
    }
    return templateData;
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/places'+this.params._id+'/opening-hours');
  }
});