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
  layoutTemplate: 'CoreMainLayout',
  yieldRegions: {
		'searchPlaces': {to: 'content'},
    'primaryNavbar': {to: 'nav'}
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
    ga('send', 'pageview', '/search/places');

    // Make the body height to 100%
    $('body, html').addClass('fullheight');
  },
  onStop: function () {
    // Make sure that the fullheight class is remove when route change
    $('body, html').removeClass('fullheight');
  }
});

Router.route('/search/communities', {
  name: 'searchCommunities',
  layoutTemplate: 'CoreMainLayout',
  yieldRegions: {
		'searchCommunities': {to: 'content'},
    'primaryNavbar': {to: 'nav'}
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
    ga('send', 'pageview', '/search/communities');

    // Make the body height to 100%
    $('body, html').addClass('fullheight');
  },
  onStop: function () {
    // Make sure that the fullheight class is remove when route change
    $('body, html').removeClass('fullheight');
  }
});

Router.route('/search/events', {
  name: 'searchEvents',
  layoutTemplate: 'CoreMainLayout',
  yieldRegions: {
		'searchEvents': {to: 'content'},
    'primaryNavbar': {to: 'nav'}
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
    ga('send', 'pageview', '/search/events');

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
  layoutTemplate: 'CoreMainLayout',
  yieldRegions: {
		'searchSkills': {to: 'content'},
    'primaryNavbar': {to: 'nav'}
	},
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
