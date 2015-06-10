/**
 * Doc: https://github.com/iron-meteor/iron-router/blob/devel/Guide.md
 */

Router.route('/login', {
	name: 'UserLogin',
	template: 'UserLogin',
	after: function () {
		// Send the pageview to GA
		ga('send', 'pageview', '/login');
	}
});

Router.route('/logout', function () {
	Meteor.logout();
 	//this.render('Home');
 	Router.go('Home');
});

Router.route('/join', {
 	name: 'userJoin',
	template: 'userJoin',
	after: function () {
		// Send the pageview to GA
		ga('send', 'pageview', '/join');
	}
});

Router.route('/reset-password', function () {
	this.render('UserForgotPassword');
});

Router.route('/reset-password/:resetToken', function () {
	this.render('UserForgotPassword');
},{
	name: 'reset-password.token'
});