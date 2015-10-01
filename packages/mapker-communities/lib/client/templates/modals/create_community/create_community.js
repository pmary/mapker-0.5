function debounce (fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

Template.modalCreateCommunity.helpers({
	errorMessage: function (field) {
		if (Session.get('modalCreatePlaceErrors')) {
			return Session.get('modalCreatePlaceErrors')[field];
		}
	},
	errorClass: function (field) {
		if (Session.get('modalCreatePlaceErrors')) {
			return !!Session.get('modalCreatePlaceErrors')[field] ? 'has-error' : '';
		}
	}
});

Template.modalCreateCommunity.rendered = function () {
	$('.modal-create-community [data-toggle="popover"]').popover();
};

Template.modalCreateCommunity.events({
	/**
	 * @summary Every time the user type in the name field,
	 * update the nicHandle field accordingly
	 */
  'keyup #input-name': function (e, t) {
    var name = t.find('#input-name').value,
		nicHandle;

		// Capitalize the name
		nicHandle = Core.capitalize(name);

		// Be sure that the nicHandle length is > 16 characters
		if (nicHandle.length > 15) {
			// Remove the extra characters
			nicHandle = nicHandle.substring(0, 15);
		}

		// Remove special chars and replace spaces by '_'
		nicHandle = nicHandle.replace(/[^\w\s]/gi, '').replace(/\s/g, '_');

    // Remove special chars and replace spaces by '_'
    t.find('#input-username').value = nicHandle;
  },
	/**
	 * @summary Check if the current nic is available
	 */
	'keyup .modal-create-community #input-name, keyup #input-username': debounce(function (e, t) {
		var nicHandle = t.find('#input-username').value;

		Meteor.call('mapker:nichandle/checkIfExist', nicHandle, function (err, res) {
			if (err) {
				console.log('err', err);
			}

			var errors = Session.get('modalCreatePlaceErrors');
      if (! errors) {
        errors = {};
      }

			if (res) {
				// Display the 'not available' message
				errors.username = "This username is already taken";
			}
			else {
				// Check if the nic is valid
				errors.username = Core.nicHandleValidation(nicHandle);
			}
			Session.set('modalCreatePlaceErrors', errors);
		});
	}, 250),
	/**
	 * @summary Create the community
	 */
	'click .user-action-create': function (e, t) {
    // Display the button loader state
		$('.user-action-create').addClass('btn-loader');

		var community = {
			name: t.find('#input-name').value,
			username: t.find('#input-username').value,
			description: t.find('#textarea-description').value
		};

		var errors = Communities.validateCommunityCreate(community);

		// Check the nicHandle
		Meteor.call('mapker:nichandle/checkIfExist', community.username, function (err, res) {
			if (err) {
        // Remove the button loader state
        $('.user-action-create').removeClass('btn-loader');
				console.log('err', err);
			}

			if (res) {
        // Remove the button loader state
        $('.user-action-create').removeClass('btn-loader');
				// Display the 'not available' message
				errors.username = "This username is already taken";
			}

			Session.set('modalCreatePlaceErrors', errors);
			if (Object.keys(errors).length) {
        // Remove the button loader state
        $('.user-action-create').removeClass('btn-loader');
				return; // Abort the account creation due to errors
			}

			// Create the community
			Meteor.call('mapker:communities/insert', community, function (err, res) {
        if (err) {
          // Remove the button loader state
          $('.user-action-create').removeClass('btn-loader');
          console.log('err', err);
        }

        // Remove the button loader state
        $('.user-action-create').removeClass('btn-loader');
        console.log('res', res);
      });
		});
	}
});
