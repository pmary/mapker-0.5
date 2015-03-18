Template.UserLogin.events({
	'submit #login-form' : function(e, t){
		e.preventDefault();

		// Form validation
		var email = t.find('#login-email'),
		password = t.find('#login-password');

		var validate = fieldsValidation([
			{
				node: email, 
				type: "email",
				required: true,
				message: "Required Field"
			},
			{
				node: password, 
				type: "password-confirmation",
				required: true,
				message: "Required Field"
			}
		]);

		// If the form is valide
		if (validate) {
			// Log the user in
			Meteor.loginWithPassword(email.value, password.value, function(err){
        		if (err){
        			// Display the related error message
        			console.log(err);
        		}else {
        			// The user has been logged in
        		}
        	});
		};

		return false;
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

		var firstname = t.find('#join-first-name'),
		lastname = t.find('#join-last-name'),
		email = t.find('#join-email'),
		password = t.find('#join-password'),
		passwordConfirmation = t.find('#join-confirm-password');

		// Form validation
		var validate = fieldsValidation([
			/*{
				node: firstname,
				type: "text",
				required: true,
				message: "Required Field"
			},*/
			{
				node: lastname,
				type: "text",
				required: true,
				message: "Required Field"
			},
			{
				node: email,
				type: "email",
				required: true,
				message: "Required Field"
			},
			{
				node: password,
				type: "password",
				required: true,
				message: "Required Field"
			},
			{
				node: passwordConfirmation,
				type: "password",
				required: true,
				message: "Required Field",
				mustBeEqualTo: password
			}
		]);

		// If the form is valide
		if (validate) {
			Accounts.createUser({email: email.value, password: password.value, profile:{firstname: firstname.value, lastname: lastname.value}}, function(err) {
				if (err) {
					// Inform the user that account creation failed
				}else {
					// Success. Account has been created and the user
					// has logged in successfully. 
					console.log("sucess account creation");
				}
			});
		}

		return false;
	}
});


Template.UserForgotPassword.helpers({
	// If a resetPassword token is present in the URL, then we will display the new-password form. 
	// Otherwise, we will display the recovery-email form.
	resetPassword : function(t) {
		return Session.get('resetPassword');
	}
});

Template.UserForgotPassword.rendered = function(){
	console.log(Accounts);
	if (Accounts._resetPasswordToken) {
		Session.set('resetPassword', Accounts._resetPasswordToken);
	}
};

Template.UserForgotPassword.events({
	'submit #forgot-password-form' : function(e, t){
		e.preventDefault();

		var email = t.find('#forgot-password-email');

		// Form validation
		var validate = fieldsValidation([
			{
				node: email,
				type: "email",
				required: true,
				message: "Required Field"
			}
		]);

		// If the form is valide
		if (validate) {
			Accounts.forgotPassword({email: email.value}, function(err){
				if (err) {
					console.log(err);
				}else {
					console.log("all right");
				}
			});
		};

		return false;
	},
	'submit #reset-password-form' : function(e, t){
		e.preventDefault();

		var password = t.find('#new-password'),
		passwordConfirmation = t.find('#new-password-confirm');

		// Form validation
		var validate = fieldsValidation([
			{
				node: password,
				type: "password",
				required: true
			},
			{
				node: passwordConfirmation,
				type: "password",
				required: true,
				mustBeEqualTo: password
			}
		]);

		// If the form is valide
		if (validate) {
			Accounts.resetPassword(Session.get('resetPassword'), password.value, function(err){
				if (err) {
					// If token is expired
					if (err.error == 403) {
						Session.set('resetPassword', null);
					};
					console.log(err);
				}
				else {
					console.log('Password reset');
				}
			});
		}
	}
});