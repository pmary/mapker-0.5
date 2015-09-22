Template.userJoin.rendered = function () {
	Session.set('userJoinErrors', {});
	$('.user-join-page [data-toggle="popover"]').popover();
};

Template.userJoin.helpers({
	errorMessage: function(field) {
		return Session.get('userJoinErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('userJoinErrors')[field] ? 'has-error' : '';
	}
});

Template.userJoin.events({
	'keyup #join-first-name, keyup #join-last-name': function (e, t) {
    var firstname = t.find('#join-first-name').value,
		lastname			= t.find('#join-last-name').value,
		nicHandle;

		// Capitalize the firstname and lastname
		firstname = Core.capitalize(firstname);
		lastname = Core.capitalize(lastname);

		// Concat the firstname and the lastname
		nicHandle = firstname + lastname;

		// Be sure that the nicHandle length is > 16 characters
		if (nicHandle.length > 15) {
			// Remove the extra characters
			nicHandle = nicHandle.substring(0, 15);
		}

    // Remove special chars and replace spaces by '_'
    t.find('#input-nichandle').value = nicHandle.replace(/[^\w\s]/gi, '').replace(/\s/g, '_');
  },
	'keyup #input-nichandle, keyup #join-first-name, keyup #join-last-name': function () {
		Meteor.call('', function (err, res) {

		});
	},
	'submit #join-form' : function(e, t){
		e.preventDefault();

		var user = {
			firstname: t.find('#join-first-name').value,
			lastname: t.find('#join-last-name').value,
			email: t.find('#join-email').value,
			password: t.find('#join-password').value,
			passwordConfirmation: t.find('#join-confirm-password').value,
			userLang: navigator.language || navigator.userLanguage
		};

		var errors = Users.validateUserJoin(user);
		Session.set('userJoinErrors', errors);
		if (Object.keys(errors).length) {
			return; // Abort the account creation due to errors
		}

		// If there if a token, it mean it's a pre-created account
		if (t.data && t.data.token) {
			console.log('has a toke');
			// Activate the pre-created account
			Meteor.call('mapker:users/activatePreCreatedAccount', t.data.token, user, function (err, res) {
				if (err) {
					console.log(err);
				}

				// Log the user in
				Meteor.loginWithPassword(user.email, user.password, function (err, res) {
					if (err) {
						console.log(err);
					}

					// Redirect the user on his profile
					Router.go('userProfileBio', {_id: Meteor.user()._id});
				});
			});
		}
		else {
			// If the form is valide
			Accounts.createUser({
				email: user.email,
				password: user.password,
				profile:{
					fullname: user.firstname+ " " + user.lastname,
					firstname: user.firstname,
					lastname: user.lastname
				}
			}, function(error, result) {
				if (error) {
					// Inform the user that account creation failed
					Errors.throw(error.reason);
				}else {
					Meteor.call('mapker:users/userCreateAccount', user);
					// Success. Account has been created and the user
					// has logged in successfully.

					Router.go('userProfileBio', {_id: Meteor.user()._id});
				}
			});
		}

		return false;
	}
});
