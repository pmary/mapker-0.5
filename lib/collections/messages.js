/**
 * @summary Validate that the message text and subjects are valide
 */
validateMessage = function (message) {
	var errors = {};

	var subjectError = isFilledValidation(message.subject);
	if (subjectError) {
		errors.subject = subjectError;
	}

	var textError = isFilledValidation(message.text);
	if (textError) {
		errors.text = textError;
	}

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
}

/**
 * @summary Send an email to the given message or user
 */
Meteor.methods({
  sendMessage: function (message) {
	check(message, {
		subject: String,
		text: String,
		from: String,
		to: {
			id: String,
			resource: String
		}
	});
    
	// Get the current user email
	var sender = Meteor.users.findOne({_id: message.from});
	var recievers = [];

	// Get the reciever email(s)
	if (message.to.resource == 'place') {
		// Get the place administrators emails
		var place = Places.findOne({_id: message.to.id});
		for (var i = 0; i < place.administrators.length; i++) {
			var user = Meteor.users.findOne({_id: place.administrators[i]});
			if (user && user.emails)
				recievers.push(user.emails[0].address);
		};
	};

	// Send the message to the recievers
	for (var i = 0; i < recievers.length; i++) {
		Email.send({
			to: recievers[i],
			from: "noreply@mapker.co",
			replyTo: sender.emails[0].address,
			subject: sender.profile.firstname + ' contacted you via Mapker',
			html: message.subject + ' <br><br> ' + message.text + ' <br><br> <a href="http://mapker.co">Mapker</a>.',
			text: message.subject + ' \n\n\n\n ' + message.text + ' \n\n\n\n Mapker (http://mapker.co).'
		});
	};
  }
});