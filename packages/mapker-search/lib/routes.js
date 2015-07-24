Router.route('/search', {
  name: 'search',
  template: 'searchLayout',
  yieldRegions: {
    'searchPlaces': {to: 'content'}
  },
  waitOn: function () {
  },
  data: function () {
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/search');
  }
});

Router.route('/search/places', {
  name: 'searchPlaces',
  template: 'searchPlaces',
  waitOn: function () {
  },
  data: function () {
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/search/places');
  }
});

Router.route('/search/skills', {
  name: 'searchSkills',
  template: 'searchSkills',
  /*layoutTemplate: 'searchLayout',
  yieldRegions: {
    'searchSkills': {to: 'content'}
  },*/
  waitOn: function () {
  },
  data: function () {
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/search/skills');
  }
});
