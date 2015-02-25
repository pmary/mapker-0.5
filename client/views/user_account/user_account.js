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

Template.UserJoin.events({
	'submit #join-form' : function(e, t){
		e.preventDefault();

		// Form validation
		var firstname = t.find('#join-first-name'),
		lastname = t.find('#join-last-name'),
		email = t.find('#join-email'),
		password = t.find('#join-password'),
		confirmedPassword = t.find('#join-confirm-password');

		var validate = fieldsValidation([
			{
				node: firstname,
				type: "text",
				required: true,
				message: "Required Field"
			},
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
				node: confirmedPassword,
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