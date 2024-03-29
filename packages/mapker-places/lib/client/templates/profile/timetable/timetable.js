var originalOpeningHours;

Template.placeProfileTimetable.helpers({
	/**
	 * @summary Return if whether or not the current user is administrator of the place
	 * @return {Boolean}
	 */
	isAdmin: function() {
		if (this.place && Meteor.user()) {
			var isAdmin = Places.findOne({_id: this.place._id, members: { $elemMatch: { id: Meteor.user()._id, admin: true } } });
			if (isAdmin) {
				return true;
			}
			else {
				return false;
			}
		}
	},
	errorMessage: function(field) {
		if (Session.get('placeProfileTimetableErrors')) {
			return Session.get('placeProfileTimetableErrors')[field];
		}
	},
	errorClass: function (field) {
		if (Session.get('placeProfileTimetableErrors')) {
			return !!Session.get('placeProfileTimetableErrors')[field] ? 'has-error' : '';
		}
	},
	/**
	 * @summary Get the current place opening hours data
	 */
	/*openingHours: function () {
		return Session.get('openingHours');
	},*/
	openingHours: function () {
		return Session.get('openingHours');
	}

});

Template.placeProfileTimetable.rendered = function () {
	originalOpeningHours = null;
	// here 'this' refers to template instance
	this.autorun(_.bind(function () {
		var place = Places.findOne({'_id': Router.current().params._id});
		if (place && place.openingHours) {
			originalOpeningHours = place.openingHours;
			Session.set('openingHours', place.openingHours);

			for (var i = 0; i < originalOpeningHours.days.length; i++) {
				// Init the timepickers
				$('.opening-hours-timetable .time').timepicker({ 'showDuration': true, 'timeFormat': 'G:i' });

				// Init the datepair
				$('#' + originalOpeningHours.days[i].day + '-slot1').datepair();
				$('#' + originalOpeningHours.days[i].day + '-slot2').datepair();
			}
		}
	},this));
};

Template.placeProfileTimetable.onDestroyed(function () {
  // Remove the 'openingHours' session var
  delete Session.keys.openingHours;
});

/**
 * @see https://github.com/jonthornton/Datepair.js
 * @see https://github.com/jonthornton/jquery-timepicker
 */
Template.placeProfileTimetable.events({
	/**
	 * @summary Display and init the edition UI for the selected day
	 */
	'click .timerange-display.editable': function (e) {
		// Remove the 'active' class from every days
		$('.user-profile-timetable .hour').removeClass('active');
		// Hide the 'Cancel' and 'Save' btns
		$('.user-profile-timetable .pull-right').css('display', 'none');
		// Destroy all the timepicker
		if ($('.user-profile-timetable .time').timepicker()) {
			$('.user-profile-timetable .time').timepicker('remove');
		}

		// Set the selected day in editing state
		$(e.currentTarget).parent().addClass('active');
		// Display the 'Cancel' and 'Save' btns
		$('.user-profile-timetable .pull-right').css('display', 'block');

		// Init the timepicker
		$('#' + this.d + ' .time').timepicker({ 'showDuration': true, 'timeFormat': 'G:i' });
		// Init the datepair
		datepair = new Datepair(document.getElementById(this.d));

		// Set the focus on the first input
		$(e.currentTarget).parent().find('.timerange-edit').find('input[type="text"]:first').focus();
	},
	/*'change .time': function (e) {
		console.log('time change');
		console.log('this.day', this.day);
		var $hourContainer = $(e.target).parent().parent(),
		$editingContainer = $hourContainer.find('.timerange-edit');

		var openingHours = Session.get('openingHours');
		console.log('openingHours.days', openingHours.days);
		for (var i = 0; i < openingHours.days.length; i++) {
			if(openingHours.days[i].day === this.day) {
				// If the day was previously set as closed
				if (openingHours.days[i].closed) {
					// Remove the close key
					delete openingHours.days[i].closed;
				}
				//openingHours.days[i].from = $editingContainer.find('.time.start').val();
				openingHours.days[i].from = $('#' + this.day + '-slot1 .input-slot1-from').val();
				openingHours.days[i].to = $('#' + this.day + '-slot1 .input-slot1-to').val();
				console.log('openingHours.days[i]', openingHours.days[i]);
				Session.set('openingHours', openingHours);
			}
		}
	},*/
	'click .user-action-cancel-hour': function () {
		$('.user-profile-timetable .hour').removeClass('active');
	},
	/**
	 * @summary When there is no opening hours filled yet, this action
	 * allow the user to fill them
	 */
	'click .add-place-opening-hours': function () {
		var defaultOpeningHours = {
			comment: '',
			days: [
				{ day: "monday", closed: true },
				{ day: "tuesday", closed: true },
				{ day: "wednesday", closed: true },
				{ day: "thursday", closed: true },
				{ day: "friday", closed: true },
				{ day: "saturday", closed: true },
				{ day: "sunday", closed: true }
			]
		};

		Session.set('openingHours', defaultOpeningHours);

		Meteor.setTimeout(function () {
			// Open all the days edition
			$('.user-profile-timetable .col-day').addClass('editing');
			$('.user-profile-timetable .opening-hours-timetable').addClass('editing');

			for (var i = 0; i < defaultOpeningHours.days.length; i++) {
				// Init the timepickers
				$('.opening-hours-timetable .time').timepicker({ 'showDuration': true, 'timeFormat': 'G:i' });

				// Init the datepair
				$('#' + defaultOpeningHours.days[i].day + '-slot1').datepair();
				$('#' + defaultOpeningHours.days[i].day + '-slot2').datepair();
			}
		}, 500);
	},
	/**
	 * @summary Make the timetable editable
	 */
	'click .opening-hours-timetable.editable .hours': function (e) {
		console.log('Enter in edition mode');
		var day =  e.currentTarget.dataset.id;

		$('.user-profile-timetable .col-day').removeClass('editing');
		$(e.currentTarget).parent().addClass('editing');
		$('.user-profile-timetable .opening-hours-timetable').addClass('editing');
	},
	/**
	 * @summary Save the edition in the local openingHours session var when the
	 * value of a time input field change
	 */
	'change .hours-editing .time': function (e) {
		var day =  e.currentTarget.dataset.id,
		slot = e.currentTarget.dataset.slot,
		position = e.currentTarget.dataset.position,
		value = e.currentTarget.value;

		var openingHours = Session.get('openingHours');
		// Update the opening hours
		for (var i = 0; i < openingHours.days.length; i++) {
			if (openingHours.days[i].day === day) {
				// Check if this day was marked as closed
				if (openingHours.days[i].closed) {
					// Remove the closed key
					delete openingHours.days[i].closed;
				}

				// Check if the slot doesn't exist
				if (! openingHours.days[i][slot]) {
					// Init the object
					//openingHours.days[i][slot] = {from: '', to: ''};
					openingHours.days[i][slot] = {};
				}
				openingHours.days[i][slot][position] = value;

				// If we just edit the 'from' position
				if (position === 'from') {
					// The 'to' value may have been updated, so get its value
					var toVal = $('#' + day + '-' + slot + ' .input-' + slot + '-to').val();
					// And update the slot object
					openingHours.days[i][slot].to = toVal;
				}
				Session.set('openingHours', openingHours);
			}
		}
	},
	/**
	 * @summary Add a shift to a day
	 */
	'click .user-action-add-shift': function (e) {
		var day =  e.target.dataset.id;
		var openingHours = Session.get('openingHours');

		// Find the given day in the openingHours object
		for (var i = 0; i < openingHours.days.length; i++) {
			if (openingHours.days[i].day === day) {
				// Check if there is not already a second slot
				if (! openingHours.days[i].slot2) {
					// Create a second empty slot
					openingHours.days[i].slot2 = {from: '', to: ''};
					// Update the session var
					Session.set('openingHours', openingHours);
				}
			}
		}

		// Init a second timepicket/datepair for this day
		Meteor.setTimeout(function() {
			$('#' + day + '-slot2 .time').timepicker({ 'showDuration': true, 'timeFormat': 'G:i' });
			datepairSlot2 = $('#' + day + '-slot2').datepair();
	}, 500);
	},
	/**
	 * @summary Remove a shift from a day
	 */
	'click .user-action-remove-shift': function (e) {
		var day =  e.target.dataset.id;
		var openingHours = Session.get('openingHours');

		// Find the given day in the openingHours object
		for (var i = 0; i < openingHours.days.length; i++) {
			if (openingHours.days[i].day === day) {
				// Check if there is a second slot
				if (openingHours.days[i].slot2) {
					// Delete the second slot
					delete openingHours.days[i].slot2;
					// Update the session var
					Session.set('openingHours', openingHours);
				}
			}
		}
	},
	/**
	 * @summary Mark the place as closed this day
	 */
	'click .user-action-set-closed': function (e) {
		var day =  e.target.dataset.id;
		var openingHours = Session.get('openingHours');

		$('.user-profile-timetable .opening-hours-timetable').addClass('editing');
		$('.user-profile-timetable .opening-hours-timetable .col-day.' + day).removeClass('editing');

		// Find the given day in the openingHours object
		for (var i = 0; i < openingHours.days.length; i++) {
			if (openingHours.days[i].day === day) {
				// Check if there is a first slot
				if (openingHours.days[i].slot1) {
					// Delete the first slot
					delete openingHours.days[i].slot1;
				}

				// Check if there is a second slot
				if (openingHours.days[i].slot2) {
					// Delete the second slot
					delete openingHours.days[i].slot2;
				}

				// Set the day as closed
				openingHours.days[i].closed = true;

				// Update the session var
				Session.set('openingHours', openingHours);
			}
		}
	},
	'click .user-action-save': function (e, t) {
		var openingHours = Session.get('openingHours');

		Meteor.call('mapker:places/updateOpeningHours', openingHours, t.data.place._id, function (error) {
			if (error) {
				console.log(error);
			}
		});

		$('.user-profile-timetable .opening-hours-timetable .col-day').removeClass('editing');
		$('.user-profile-timetable .opening-hours-timetable').removeClass('editing');
	},
	/**
	 * @summary Restore the default timetable state and cancel the editions
	 */
	 'click .user-action-cancel': function () {
		 $('.user-profile-timetable .opening-hours-timetable .col-day').removeClass('editing');
		 $('.user-profile-timetable .opening-hours-timetable').removeClass('editing');

		 // Reset the openingHours Session var
		 Session.set('openingHours', originalOpeningHours);
 	},
	/**
	 * @summary Add extra info
	 */
	'click .no-opening-hours-infos': function () {
		// Get the height of the opening hours info UI
		var height = $('.user-profile-timetable .no-opening-hours-infos').height();

		// Hide the 'no opening hours info' UI
		$('.user-profile-timetable .no-opening-hours-infos').css('display', 'none');
		// Display the edition UI
		$('.user-profile-timetable .opening-hours-infos-edition').css({'display': 'block'});
		$('.user-profile-timetable .opening-hours-infos-edition textarea').css('height', height + 90 + 'px');
		$('.user-profile-timetable .opening-hours-infos-edition textarea').focus();
	},
	/**
	 * @summary Enter in edition mode for the opening hours extat infos
	 */
	'click .user-action-edit-comment': function () {
		// Get the height of the opening hours info UI
		var height = $('.user-profile-timetable .opening-hours-infos').height();

		// Hide the opening hours info UI
		$('.user-profile-timetable .opening-hours-infos').css('display', 'none');
		// Display the edition UI
		$('.user-profile-timetable .opening-hours-infos-edition').css({'display': 'block'});
		$('.user-profile-timetable .opening-hours-infos-edition textarea').css('height', height + 90 + 'px');
		$('.user-profile-timetable .opening-hours-infos-edition textarea').focus();
	},
	/**
	 * @summary Save the edited infos
	 */
	'submit #form-opening-hours-infos': function (e, t) {
		e.preventDefault();

		var infos = t.find('#textarea-opening-hours-infos').value,
		openingHours = Session.get('openingHours');

		openingHours.comment = infos;
		Session.set('openingHours', openingHours);

		Meteor.call('mapker:places/updateOpeningHours', openingHours, t.data.place._id, function (error) {
			if (error) {
				console.log(error);
			}
		});

		// Display the opening hours info UI
		$('.user-profile-timetable .opening-hours-infos').css('display', 'block');
		// Hide the edition UI
		$('.user-profile-timetable .opening-hours-infos-edition').css('display', 'none');
	},
	/**
	 * @summary Cancel the opening hours info edition
	 */
	'click .user-action-cancel-opening-hours-infos-edit': function (e) {
		e.preventDefault();
		// Display the opening hours info UI
		$('.user-profile-timetable .opening-hours-infos').css('display', 'block');
		$('.user-profile-timetable .no-opening-hours-infos').css('display', 'block');
		// Hide the edition UI
		$('.user-profile-timetable .opening-hours-infos-edition').css('display', 'none');
	}
});
