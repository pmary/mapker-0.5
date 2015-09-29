Router.route('/search', {
  name: 'search',
  template: 'searchLayout',
  yieldRegions: {
    'searchPlaces': {to: 'content'}
  },
  onAfterAction: function () {
    $('body,html').scrollTop(0);
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
  onAfterAction: function () {
    $('body,html').scrollTop(0);
  },
  waitOn: function () {
  },
  data: function () {
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/search/places');

    // Make the body height to 100%
    $('body, html').addClass('fullheight');
  },
  onStop: function () {
    // Make sure that the fullheight class is remove when route change
    $('body, html').removeClass('fullheight');
  }
});

Router.route('/search/skills', {
  name: 'searchSkills',
  template: 'searchSkills',
  onAfterAction: function () {
    $('body,html').scrollTop(0);
  },
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

    // Make the body height to 100%
    $('body, html').addClass('fullheight');
  },
  onStop: function () {
    // Make sure that the fullheight class is remove when route change
    $('body, html').removeClass('fullheight');
  }
});
