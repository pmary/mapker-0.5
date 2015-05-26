Template.placeProfileTimetable.helpers({
	/**
	 * @summary Return if whether or not the current user is administrator of the place
	 * @return {Boolean}
	 */
	isAdmin: function() {
		if (this.place && Meteor.user() && this.place.administrators.indexOf(Meteor.user()._id) > -1)
			return true;
		else
			return false;
	}
});

Template.placeProfileTimetable.rendered = function (argument) {
	this.autorun(function () {
		/*var container = document.getElementById('hours-container');
		var datepair = new Datepair(container);*/
		$('#hours-container .time').timepicker({
			'showDuration': true,
			'timeFormat': 'g:ia'
		});

		var container = document.getElementById('hours-container');
		var datepair = new Datepair(container);
	});
}

var datepair;
/**
 * @see https://github.com/jonthornton/Datepair.js
 * @see https://github.com/jonthornton/jquery-timepicker
 */
Template.placeProfileTimetable.events({
	'click .timerange-display.editable': function (e, t) {
		
		// Get the id of the day we are editing
		var dayId = e.currentTarget.dataset.day;

		// Get the opening hours edition zone node
		var editContainer = $(e.currentTarget).parent().find('.timerange-edit');

		// Clean the interface
		$('.user-profile-timetable .hour').removeClass('active');
		$('.user-profile-timetable .pull-right').css('display', 'none');
		// Clean the timepicker and datepair instances
		if ($('.user-profile-timetable .time').timepicker()) {
			$('.user-profile-timetable .time').timepicker('remove');
		}
		if (datepair) {
			datepair.remove();
		}

		// Hide the opening hours and display the opening hours edition zone
		$(e.currentTarget).parent().addClass('active');
		$('.user-profile-timetable .pull-right').css('display', 'block');
		
		// Init the timepicker
		$('#'+dayId+' .time').timepicker({
			'showDuration': true,
			'timeFormat': 'G:i'
		});
		// Init the datepair
		datepair = new Datepair(document.getElementById(dayId));

		// Set the focus on the first input
		editContainer.find('input[type="text"]:first').focus();
	},
	'change .time': function (e, t) {
		// Get the timerange initially displayed
		var $hourContainer = $(e.target).parent().parent(),
		$editContainer = $hourContainer.find('.timerange-edit'),
		initialTimerange = $hourContainer.find('.timerange-display').text(),
		startVal,
		endVal;

		if (initialTimerange != "Closed") {
			initialTimerange = $hourContainer.find('.timerange-display').text().replace(/ /g, "").split('-'),
			startVal = initialTimerange[0].replace(/h/g, ""), 
			endVal = initialTimerange[1].replace(/h/g, "");
		}
		else {
		}

		// Get the new timerange
		var newStartVal = $editContainer.find('.time.start').val().replace(/am/g, "").replace(/pm/g, ""),
		newEndVal = $editContainer.find('.time.end').val().replace(/am/g, "").replace(/pm/g, ""),
		concatenedNewVal = newStartVal + 'h - ' + newEndVal + 'h';

		// Set the new timerange
		$hourContainer.find('.timerange-display').text(concatenedNewVal);
	},
	'click .user-action-cancel-hour': function (e, t) {
		$('.user-profile-timetable .hour').removeClass('active');
	},
	'click .user-action-set-closed': function (e, t) {
		console.log('mark as closed');
		var $hourContainer = $(e.currentTarget).parent();
		$hourContainer.find('.timerange-display').text('Closed');

	},
	'click .user-action-cancel': function (e, t) {
		$('.user-profile-timetable .hour').removeClass('active');
		$('.user-profile-timetable .pull-right').css('display', 'none');
	},
	'click .user-action-save': function (e, t) {
		$('.user-profile-timetable .hour').removeClass('active');
		$('.user-profile-timetable .pull-right').css('display', 'none');
	}
});