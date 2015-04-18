/**
 * Doc: https://github.com/iron-meteor/iron-router/blob/devel/Guide.md
 */

Router.route('/', function () {
 	this.render('Home');
});

Router.route('/search', {
	name: 'search',
 	layoutTemplate: 'search',
 	waitOn: function () {
    	//return Meteor.subscribe('placesWithinBbox');
    },
    after: function() {
    	Session.set('hideSearch', true);
    }
});