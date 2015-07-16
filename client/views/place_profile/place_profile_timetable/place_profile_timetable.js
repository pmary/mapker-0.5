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
		return Session.get('placeProfileTimetableErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('placeProfileTimetableErrors')[field] ? 'has-error' : '';
	},
	/**
	 * @summary Get the current place opening hours data
	 */
	openingHours: function () {
		return Session.get('openingHours');
	}

});


openingHours = new ReactiveVar();
Template.placeProfileTimetable.created = function () {
	// here 'this' refers to template instance
	this.openingHours = new ReactiveVar();
	this.autorun(_.bind(function(){
		var place = Places.findOne({'_id': Router.current().params._id});
		if (place && place.openingHours) {
			this.openingHours.set(place.openingHours);
			Session.set('openingHours', place.openingHours);
		};
	},this));
};

Template.placeProfileTimetable.rendered = function (argument) {
}

var datepair;
/**
 * @see https://github.com/jonthornton/Datepair.js
 * @see https://github.com/jonthornton/jquery-timepicker
 */
Template.placeProfileTimetable.events({
	/**
	 * @summary Display and init the edition UI for the selected day
	 */
	'click .timerange-display.editable': function (e, t) {
		// Remove the 'active' class from every days
		$('.user-profile-timetable .hour').removeClass('active');
		// Hide the 'Cancel' and 'Save' btns
		$('.user-profile-timetable .pull-right').css('display', 'none');
		// Destroy all the timepicker
		if ($('.user-profile-timetable .time').timepicker())
			$('.user-profile-timetable .time').timepicker('remove');
		// Destroy all the datepair instances
		if (datepair)
			datepair.remove();

		// Set the selected day in editing state
		$(e.currentTarget).parent().addClass('active');
		// Display the 'Cancel' and 'Save' btns
		$('.user-profile-timetable .pull-right').css('display', 'block');

		// Init the timepicker
		$('#'+this.d+' .time').timepicker({ 'showDuration': true, 'timeFormat': 'G:i' });
		// Init the datepair
		datepair = new Datepair(document.getElementById(this.d));

		// Set the focus on the first input
		$(e.currentTarget).parent().find('.timerange-edit').find('input[type="text"]:first').focus();
	},
	'change .time': function (e, t) {
		var $hourContainer = $(e.target).parent().parent(),
		$editingContainer = $hourContainer.find('.timerange-edit');

		var openingHours = Session.get('openingHours');
		for (var i = 0; i < openingHours.length; i++) {
			if(openingHours[i].d == this.d) {
				if (openingHours[i].c) delete openingHours[i].c;
				openingHours[i].s = $editingContainer.find('.time.start').val();
				openingHours[i].e = $editingContainer.find('.time.end').val();
				Session.set('openingHours', openingHours);
			}
		};
	},
	'click .user-action-cancel-hour': function (e, t) {
		$('.user-profile-timetable .hour').removeClass('active');
	},
	'click .user-action-set-closed': function (e, t) {
		// Display the 'Cancel' and 'Save' btns
		$('.user-profile-timetable .pull-right').css('display', 'block');

		var openingHours = Session.get('openingHours');
		for (var i = 0; i < openingHours.length; i++) {
			if(openingHours[i].d == this.d) {
				delete openingHours[i].s;
				delete openingHours[i].e;
				openingHours[i].c = true;
				Session.set('openingHours', openingHours);
			}
		};
	},
	'click .user-action-cancel': function (e, t) {
		//console.log(Router.current().params._id);
		console.log(t.openingHours.get());
		//Places.findOne({'_id': Router.current().params._id});
		Session.set('openingHours', t.openingHours.get());

		$('.user-profile-timetable .hour').removeClass('active');
		$('.user-profile-timetable .pull-right').css('display', 'none');
	},
	/**
	 * @summary When there is no opening hours filled yet, this action
	 * allow the user to fill them
	 */
	'click .user-action-set-hours': function (e, t) {
		console.log('set default opening hour');
		Session.set('openingHours', [
			{d : "mo", c: true},
			{d : "tu", c: true},
			{d : "we", c: true},
			{d : "th", c: true},
			{d : "fr", c: true},
			{d : "sa", c: true},
			{d : "su", c: true}
		]);
	},
	'click .user-action-save': function (e, t) {
		var openingHours = Session.get('openingHours');

		Meteor.call('placeUpdateOpeningHours', openingHours, t.data.place._id, function (error, result) {
			if (error)
				console.log(error);
			console.log(result);
		});

		$('.user-profile-timetable .hour').removeClass('active');
		$('.user-profile-timetable .pull-right').css('display', 'none');
	}
});
