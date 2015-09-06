Template.userForgotPassword.created = function() {
	Session.set('userForgotPasswordErrors', {});
};

Template.userForgotPassword.helpers({
	// If a resetPassword token is present in the URL, then we will display the new-password form.
	// Otherwise, we will display the recovery-email form.
	resetPassword : function(t) {
		return Session.get('resetPassword');
	},
	errorMessage: function(field) {
		return Session.get('userForgotPasswordErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('userForgotPasswordErrors')[field] ? 'has-error' : '';
	}
});

Template.userForgotPassword.rendered = function(){
	if (Accounts._resetPasswordToken) {
		Session.set('resetPassword', Accounts._resetPasswordToken);
	}
};

Template.userForgotPassword.events({
	'submit #forgot-password-form' : function(e, t){
		e.preventDefault();

		// Form validation
		var credentials = {
			email: t.find('#forgot-password-email').value
		};

		var errors = Users.validateUserForgotPassword(credentials);
		Session.set('userForgotPasswordErrors', errors);
		if (Object.keys(errors).length)
			return; // Abort the account creation due to errors

		// If the form is valide
		Accounts.forgotPassword({email: credentials.email}, function(error){
			if (error) {
				Errors.throw(error.reason);
			}else {
				console.log("all right");
			}
		});

		return false;
	},
	'submit #reset-password-form' : function(e, t){
		e.preventDefault();

		// Form validation
		var credentials = {
			password: t.find('#new-password').value,
			passwordConfirmation: t.find('#new-password-confirm').value
		};

		var errors = validateUserResetPassword(credentials);
		Session.set('userForgotPasswordErrors', errors);
		if (Object.keys(errors).length)
			return; // Abort the account creation due to errors

		// If the form is valide
		Accounts.resetPassword(Session.get('resetPassword'), credentials.password, function(error){
			if (error) {
				// If token is expired
				if (error.error == 403) {
					Session.set('resetPassword', null);
				}
				console.log(error);
			}
			else {
				console.log('Password reset');
			}
		});
	}
});
