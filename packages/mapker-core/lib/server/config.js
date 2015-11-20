Meteor.fs = Npm.require('fs');

Meteor.startup(function () {
	/**
	 * AWS S3 configuration
	 */
	// Check if we are in production or development environement
	if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
		AWS.config.update({
			accessKeyId: Meteor.settings.aws.prod.accessKeyId,
			secretAccessKey: Meteor.settings.aws.prod.secretAccessKey,
			region: Meteor.settings.aws.prod.region // Like "eu-central-1"
		});
		s3 = new AWS.S3({params: {Bucket: Meteor.settings.aws.prod.bucket}});
	}
	else {
		AWS.config.update({
			accessKeyId: Meteor.settings.aws.dev.accessKeyId,
			secretAccessKey: Meteor.settings.aws.dev.secretAccessKey,
			region: Meteor.settings.aws.dev.region // Like "eu-central-1"
		});
		s3 = new AWS.S3({params: {Bucket: Meteor.settings.aws.dev.bucket}});
	}

	/**
	 * Customize the email validation system
	 * By default, the email is sent from no-reply@meteor.com.
	 * If you wish to receive email from users asking for help with their account,
	 * be sure to set this to an email address that you can receive email at.
	 */
  Accounts.emailTemplates.from = 'Mapker <no-reply@mapker.co>';
	// The public name of your application.
	// Defaults to the DNS name of the application (eg: awesome.meteor.com).
  Accounts.emailTemplates.siteName = 'Mapker';
	// A Function that takes a user object and returns a String for the subject line of the email.
  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Confirm Your Email Address';
  };
	// A Function that takes a user object and a url, and returns the body text for the email.
  // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return 'Please, click on the following link to verify your email address: ' + url;
  };

	/**
	 * Run some check at every user login
	 */
	var loginAttemptVerifier = function(parameters) {
      if (parameters.user && parameters.user.emails && (parameters.user.emails.length > 0)) {
        // return true if verified email, false otherwise.
        var found = _.find(
					parameters.user.emails,
					function(thisEmail) { return thisEmail.verified; }
				);

        if (!found) {
					//console.log('EMail not verified');
          throw new Meteor.Error(401, 'You have to validate your email before login.');
        }
        return found && parameters.allowed;
      } else {
        //console.log("user has no registered emails.");
        return false;
      }
    };
    Accounts.validateLoginAttempt(loginAttemptVerifier);

	/**
	 * Customize the password reset system
	 */
	Accounts.emailTemplates.resetPassword.text = function (user, url) {
		url = url.replace('#/', ''); // Remove the # from the url.
		// Customize the email template
		return "Hello,\n\nTo reset your password, simply click the link below:\n\n"+ url +"\n\nThanks.";
	};

	/**
	 * Transactional email configuration. You can use MailGun service or Mandrill
	 * for exemple
	 * @doc: http://blog.ploki.info/send-email-with-meteor-mailgun/
	 * @doc: http://docs.meteor.com/#/full/email
	 */
	Accounts.emailTemplates.from = 'Mapker <no-reply@mapker.co>';
	process.env.MAIL_URL = Meteor.settings.mandrill.prod.mailUrl;
});
