/**
 * Doc: https://github.com/iron-meteor/iron-router/blob/devel/Guide.md
 */

Router.route('/', {
	name: 'Home',
	template: 'Home',
	after: function(argument) {
		// Set the menu UI
	    $('#primary-navbar').addClass('home-ui');
	}
});

Router.route('/terms-of-service', {
	name: 'termsOfService',
	template: 'termsOfService'
});