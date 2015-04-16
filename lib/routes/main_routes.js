/**
 * Doc: https://github.com/iron-meteor/iron-router/blob/devel/Guide.md
 */

Router.route('/', function () {
 	this.render('Home');
});

Router.route('/search', function () {
 	this.render('search');
});