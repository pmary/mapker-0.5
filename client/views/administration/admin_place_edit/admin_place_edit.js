Template.adminPlaceEdit.helpers({
	admins: function() {
		return  Meteor.users.find({_id: { $in : this.administrators} });
	}
});

Template.adminPlaceEdit.onRendered(function () {
	//Meteor.subscribe('users', userIds)
});

Template.adminPlaceEdit.events({
	'click #test' : function(e,t) {
		console.log(t);
	},
	'submit #place-edition' : function(e,t) {
		e.preventDefault();
		var activated = t.find('#activated'),
		name = t.find('#input-name');

		var place = {
			_id: t.data._id,
			administrators: t.data.administrators,
			name: name.value
		}

		if (activated)
			activated = activated.checked;

		Meteor.call('adminPlaceEdit', {place: place, activated: activated}, function(error, result) {
			// display the error to the user and abort
			if (error) {
				console.log(error);
				return alert(error.reason);
			}
		});
	}
});