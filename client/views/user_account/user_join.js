Template.userJoin.created = function() {
	Session.set('userJoinErrors', {});
}

Template.userJoin.helpers({
	errorMessage: function(field) {
		return Session.get('userJoinErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('userJoinErrors')[field] ? 'has-error' : '';
	}
});

Template.userJoin.events({
	'submit #join-form' : function(e, t){
		e.preventDefault();

		var user = {
			firstname: t.find('#join-first-name').value,
			lastname: t.find('#join-last-name').value,
			email: t.find('#join-email').value,
			password: t.find('#join-password').value,
			passwordConfirmation: t.find('#join-confirm-password').value
		}

		var errors = validateUserJoin(user);
		Session.set('userJoinErrors', errors);
		if (Object.keys(errors).length)
			return; // Abort the account creation due to errors

		// If the form is valide
		Accounts.createUser({
			email: user.email, 
			password: user.password, 
			profile:{
				username: user.firstname+ " " + user.lastname, 
				firstname: user.firstname, 
				lastname: user.lastname
			}
		}, function(error, result) {
			if (error) {
				// Inform the user that account creation failed
				Errors.throw(error.reason);
			}else {
				// Success. Account has been created and the user
				// has logged in successfully. 
				
				// Create a new document in the ES resource index
				Meteor.call('createUserDocument', Meteor.user()._id, function(result) {
					console.log(result);
				});

				Router.go('userProfileBio', {_id: Meteor.user()._id});
			}
		});

		return false;
	}
});