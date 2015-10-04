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
	},
	resetPaswdEmailSend: function () {
		return Session.get('resetPaswdEmailSend');
	}
});

Template.userForgotPassword.rendered = function(){
	// Remove the loader state
	$('#forgot-password-submit-button').removeClass('btn-loader');

	Session.set('resetPaswdEmailSend', false);

	if (Router.current().params.resetToken) {
		Session.set('resetPassword', Router.current().params.resetToken);
	}
};

Template.userForgotPassword.onDestroyed(function () {

});

Template.userForgotPassword.events({
	'submit #forgot-password-form' : function(e, t){
		e.preventDefault();

		// Display the loader state
		$('#forgot-password-submit-button').addClass('btn-loader');

		// Form validation
		var credentials = {
			email: t.find('#forgot-password-email').value
		};

		var errors = Users.validateUserForgotPassword(credentials);
		Session.set('userForgotPasswordErrors', errors);
		if (Object.keys(errors).length) {
			// Remove the loader state
			$('#forgot-password-submit-button').removeClass('btn-loader');
			return; // Abort the account creation due to errors
		}

		// If the form is valide
		Accounts.forgotPassword({email: credentials.email}, function(error){
			// Remove the loader state
			$('#forgot-password-submit-button').removeClass('btn-loader');

			if (error) {
				Errors.throw(error.reason);
			}else {
				Session.set('resetPaswdEmailSend', true);
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

		var errors = Users.validateUserResetPassword(credentials);
		Session.set('userForgotPasswordErrors', errors);
		if (Object.keys(errors).length)
			return; // Abort the account creation due to errors

		// If the form is valide
		Accounts.resetPassword(Session.get('resetPassword'), credentials.password, function(error){
			if (error) {
				// If token is expired
				if (error.error == 403) {
					Session.set('resetPassword', null);
					sAlert.error('Token expired. Enter your email to receive a new one');
				}
				console.log(error);
			}
			else {
				// The user has been logged in, redirect him to his profile paga
				Router.go('userProfileBio', {_id: Meteor.user()._id});
			}
		});
	}
});
