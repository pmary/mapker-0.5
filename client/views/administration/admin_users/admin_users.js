Template.adminUsers.helpers({
	users: function() {
		return  Meteor.users.find();
	}
});

Template.adminUsers.events({

});