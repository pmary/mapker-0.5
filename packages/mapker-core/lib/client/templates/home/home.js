Template.Home.created = function() {
  if (Accounts._verifyEmailToken) {
    Accounts.verifyEmail(Accounts._verifyEmailToken, function(err) {
			console.log('verifyEmail err', err);
      if (err) {
        if (err.message === 'Verify email link expired [403]') {
          //console.log('Sorry this verification link has expired.');
					sAlert.error('Sorry, your email verification link has expired.', {position: 'top'});
        }
      } else {
        //console.log('Thank you! Your email address has been confirmed.');
				//Router.go('userEmailConfiremer', {_id: Meteor.user()._id});
				sAlert.success('Thank you! Your email address has been confirmed.', {position: 'top'});
      }
    });
  }
};

Template.Home.rendered = function(){
	window.removeEventListener('scroll', scrollListener);

	// If the account contain a reset token, redirect the user to the password reset page
	if (Accounts._resetPasswordToken)
		Router.go('reset-password.token', {resetToken: Accounts._resetPasswordToken});

	this.autorun(function () {
	    window.addEventListener('scroll', scrollListener);
	});
};

var scrollListener = function () {
	var scroll = $(window).scrollTop();

	if (scroll >= 70) {
		$('#primary-navbar').addClass('withBg');
	} else {
		$('#primary-navbar').removeClass('withBg');
	}
};

Template.Home.events({
});
