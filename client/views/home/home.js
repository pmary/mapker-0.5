Template.Home.rendered = function(){
	// If the account contain a reset token, redirect the user to the password reset page
	if (Accounts._resetPasswordToken)
		Router.go('reset-password.token', {resetToken: Accounts._resetPasswordToken});

	this.autorun(function () {
		// Set the menu UI
	    $('#primary-navbar').addClass('home-ui');
	});
}

Template.Home.events({
});