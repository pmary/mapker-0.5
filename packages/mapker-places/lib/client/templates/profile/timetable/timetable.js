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

var originalOpeningHours;
Template.placeProfileTimetable.created = function () {
	// here 'this' refers to template instance
	this.autorun(_.bind(function () {
		var place = Places.findOne({'_id': Router.current().params._id});
		if (place && place.openingHours) {
			originalOpeningHours = place.openingHours;
			//this.openingHours.set(place.openingHours);
			Session.set('openingHours', place.openingHours);
		}
	},this));
};

Template.placeProfileTimetable.rendered = function () {
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
		if ($('.user-profile-timetable .time').timepicker())
			$('.user-profile-timetable .time').timepicker('remove');
		// Destroy all the datepair instances
		if (datepairSlot1)
			datepairSlot1.remove();

		// Set the selected day in editing state
		$(e.currentTarget).parent().addClass('active');
		// Display the 'Cancel' and 'Save' btns
		$('.user-profile-timetable .pull-right').css('display', 'block');

		// Init the timepicker
		$('#'+this.d+' .time').timepicker({ 'showDuration': true, 'timeFormat': 'G:i' });
		// Init the datepair
		datepair = new Datepair(document.getElementById(this.d));

		// Check for a

		// Set the focus on the first input
		$(e.currentTarget).parent().find('.timerange-edit').find('input[type="text"]:first').focus();
	},
	'change .time': function (e) {
		var $hourContainer = $(e.target).parent().parent(),
		$editingContainer = $hourContainer.find('.timerange-edit');

		var openingHours = Session.get('openingHours');
		for (var i = 0; i < openingHours.length; i++) {
			if(openingHours[i].d === this.d) {
				if (openingHours[i].c) delete openingHours[i].c;
				openingHours[i].s = $editingContainer.find('.time.start').val();
				openingHours[i].e = $editingContainer.find('.time.end').val();
				Session.set('openingHours', openingHours);
			}
		}
	},
	'click .user-action-cancel-hour': function () {
		$('.user-profile-timetable .hour').removeClass('active');
	},
	/**
	 * @summary When there is no opening hours filled yet, this action
	 * allow the user to fill them
	 */
	'click .add-place-opening-hours': function () {
		var defaultOpeningHours = {
			comment: 'Lorem ipsum...',
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
					// Create it
					openingHours.days[i][slot] = {from: '', to: ''};
				}
				openingHours.days[i][slot][position] = value;
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

		Meteor.call('placeUpdateOpeningHours', openingHours, t.data.place._id, function (error) {
			if (error) {
				throw error;
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
 	}
});
