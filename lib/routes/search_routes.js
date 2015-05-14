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

Router.route('/search/places', {
  name: 'searchPlaces',
  template: 'searchPlaces',
  layoutTemplate: 'searchLayout',
  yieldRegions: {
    'searchPlaces': {to: 'content'}
  },
  waitOn: function () {
  },
  data: function () {
  },
  after: function () {
    
  }
});

Router.route('/search/skills', {
  name: 'searchSkills',
  template: 'searchSkills',
  layoutTemplate: 'searchLayout',
  yieldRegions: {
    'searchSkills': {to: 'content'}
  },
  waitOn: function () {
  },
  data: function () {
  },
  after: function () {
    
  }
});