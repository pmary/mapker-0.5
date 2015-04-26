Router.route('/search', {
  name: 'search',
  template: 'searchLayout',
  yieldRegions: {
    'searchPlaces': {to: 'content'}
  },
  waitOn: function () {
  },
  data: function () {
  }
});

Router.route('/places/places', {
  name: 'searchPlaces',
  template: 'searchPlaces',
  layoutTemplate: 'searchLayout',
  yieldRegions: {
    'searchPlaces': {to: 'content'}
  },
  waitOn: function () {
    //return Meteor.subscribe('place', this.params._id);
  },
  data: function () {
    /*templateData = {
      place: Places.findOne({_id: this.params._id})
    }
    return templateData;*/
  }
});