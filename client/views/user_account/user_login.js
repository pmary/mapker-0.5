Template.userLogin.created = function() {
	Session.set('userLoginErrors', {});
}

Template.userLogin.helpers({
	errorMessage: function(field) {
		return Session.get('userLoginErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('userLoginErrors')[field] ? 'has-error' : '';
	}
});

Template.userLogin.events({
	'submit #login-form' : function(e, t){
		e.preventDefault();

		// Form validation
		var credentials = {
			email: t.find('#login-email').value,
			password: t.find('#login-password').value
		};

		var errors = validateUserLogin(credentials);
		Session.set('userLoginErrors', errors);
		if (Object.keys(errors).length)
			return; // Abort the account creation due to errors

		// If the form is valide log the user in
		Meteor.loginWithPassword(credentials.email, credentials.password, function(error){
			if (error){
				// Display the related error message
				Errors.throw(error.reason);
			}else {
				// The user has been logged in
			}
		});

		return false;
	}
});