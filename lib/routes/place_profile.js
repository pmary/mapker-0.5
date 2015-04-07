Router.route('/places/:_id', {
  name: 'placeProfile',
  template: 'placeProfileLayout',
  yieldRegions: {
    'placeProfileAbout': {to: 'content'}
  },
  waitOn: function () {
  },
  data: function () {
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
  }
});