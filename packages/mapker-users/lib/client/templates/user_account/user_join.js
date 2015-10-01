Template.userJoin.rendered = function () {
	Session.set('userJoinErrors', {});
	$('.user-join-page [data-toggle="popover"]').popover();
};

Template.userJoin.helpers({
	errorMessage: function(field) {
		if (Session.get('userJoinErrors')) {
			return Session.get('userJoinErrors')[field];
		}
	},
	errorClass: function (field) {
		if (Session.get('userJoinErrors')) {
			return !!Session.get('userJoinErrors')[field] ? 'has-error' : '';
		}
	}
});

 function debounce (fn, delay) {
  var timer = null;
  return function () {
    console.log('enter the returned function');
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      console.log('bounce timeout');
      fn.apply(context, args);
    }, delay);
  };
}

Template.userJoin.events({
	/**
	 * @summary Every time the user type in the firstname or lastname fields,
	 * update the nicHandle field accordingly and check if the current nic
	 * is available
	 */
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
		nicHandle = nicHandle.replace(/[^\w\s]/gi, '').replace(/\s/g, '_');

		// Set the field with the new value
    t.find('#input-nichandle').value = nicHandle;

  },
	/**
	 * Check if the nicHandle is available and valid
	 */
	'keyup #join-first-name, keyup #join-last-name, keyup #input-nichandle': debounce(function (e, t) {
		var nicHandle = t.find('#input-nichandle').value;

		Meteor.call('mapker:nichandle/checkIfExist', nicHandle, function (err, res) {
			if (err) {
				console.log('err', err);
			}

			var errors = Session.get('userJoinErrors');
			if (res) {
				// Display the 'not available' message
				errors.nicHandle = "This username is already taken";
			}
			else {
				// Check if the nic is valid
				errors.nicHandle = Core.nicHandleValidation(nicHandle);
			}
			Session.set('userJoinErrors', errors);
		});
	}, 500),
	'keyup #input-nichandle, keyup #join-first-name, keyup #join-last-name': function () {
		Meteor.call('', function (err, res) {

		});
	},
	'submit #join-form' : function(e, t){
		e.preventDefault();

		var user = {
			firstname: t.find('#join-first-name').value,
			lastname: t.find('#join-last-name').value,
			nicHandle: t.find('#input-nichandle').value,
			email: t.find('#join-email').value,
			password: t.find('#join-password').value,
			passwordConfirmation: t.find('#join-confirm-password').value,
			userLang: navigator.language || navigator.userLanguage
		};

		var errors = Users.validateUserJoin(user);
		// Check the nicHandle

		Meteor.call('mapker:nichandle/checkIfExist', user.nicHandle, function (err, res) {
			if (err) {
				console.log('err', err);
			}

			if (res) {
				// Display the 'not available' message
				errors.nicHandle = "This username is already taken";
			}

			console.log('errors', errors);
			Session.set('userJoinErrors', errors);
			if (Object.keys(errors).length) {
				return; // Abort the account creation due to errors
			}

			// If there if a token, it mean it's a pre-created account
			if (t.data && t.data.token) {
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
				Meteor.call('mapker:users/userCreateAccount', user);
				// If the form is valide
			}

			return false;
		});
	}
});
