/**
 * Doc: https://github.com/iron-meteor/iron-router/blob/devel/Guide.md
 */

Router.route('/login', {
	name: 'UserLogin',
	template: 'UserLogin'
});

Router.route('/logout', function () {
	Meteor.logout();
 	this.render('Home');
});

Router.route('/join', {
 	name: 'userJoin',
	template: 'userJoin'
});

Router.route('/reset-password', function () {
	this.render('UserForgotPassword');
});

Router.route('/reset-password/:resetToken', function () {
	this.render('UserForgotPassword');
},{
	name: 'reset-password.token'
});