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
				type: "password",
				required: true,
				message: "Required Field"
			}
		]);

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