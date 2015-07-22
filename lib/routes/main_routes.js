/**
 * Doc: https://github.com/iron-meteor/iron-router/blob/devel/Guide.md
 */

Router.route('/', {
	name: 'Home',
	template: 'Home',
	after: function(argument) {
		// Set the menu UI
	    $('#primary-navbar').addClass('home-ui');

	    // Send the pageview to GA
		ga('send', 'pageview', '/');
	}
});

Router.route('/terms-of-service', {
	name: 'termsOfService',
	template: 'termsOfService',
	after: function() {
		// Send the pageview to GA
		ga('send', 'pageview', '/terms-of-service');
	}
});

Router.route('/dmca', {
	name: 'dmca',
	template: 'dmca',
	after: function() {
		// Send the pageview to GA
		ga('send', 'pageview', '/dmca');
	}
});

Router.route('/privacy', {
	name: 'privacyPolicy',
	template: 'privacyPolicy',
	after: function() {
		// Send the pageview to GA
		ga('send', 'pageview', '/privacy');
	}
});
