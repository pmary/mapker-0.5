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

		var errors = Users.validateUserLogin(credentials);
		Session.set('userLoginErrors', errors);
		if (Object.keys(errors).length)
			return; // Abort the account creation due to errors

		// Display the loader state
		$('#login-button').addClass('btn-loader');

		// If the form is valide log the user in
		Meteor.loginWithPassword(credentials.email, credentials.password, function(error){
			if (error){
				if (error.error === 403) {
					// Display the related error message
					Errors.throw('Invalid login or password');
				}

				// Cancel the loader state
				$('#login-button').removeClass('btn-loader');
			}else {
				// The user has been logged in, redirect him to his profile paga
				Router.go('userProfileBio', {_id: Meteor.user()._id});
			}
		});

		return false;
	}
});
