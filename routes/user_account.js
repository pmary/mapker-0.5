/**
 * Doc: https://github.com/iron-meteor/iron-router/blob/devel/Guide.md
 */

Router.route('/login', function () {
 	this.render('UserLogin');
});

Router.route('/join', function () {
 	this.render('UserJoin');
});