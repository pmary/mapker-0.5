Template.Home.rendered = function(){
	window.removeEventListener('scroll', scrollListener);

	// If the account contain a reset token, redirect the user to the password reset page
	if (Accounts._resetPasswordToken)
		Router.go('reset-password.token', {resetToken: Accounts._resetPasswordToken});

	this.autorun(function () {
		// Set the menu UI
	    $('#primary-navbar').addClass('home-ui');


	    window.addEventListener('scroll', scrollListener);
	});
}

var scrollListener = function () {
	var scroll = $(window).scrollTop();

	if (scroll >= 70) {
		$('#primary-navbar').addClass('withBg');
	} else {
		$('#primary-navbar').removeClass('withBg');
	}
}

Template.Home.events({
});
