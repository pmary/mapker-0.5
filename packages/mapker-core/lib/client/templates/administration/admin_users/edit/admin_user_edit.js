Template.adminUserEdit.helpers({
	user: function () {
		return  Meteor.users.findOne();
	}
});

Template.adminUserEdit.events({

});
