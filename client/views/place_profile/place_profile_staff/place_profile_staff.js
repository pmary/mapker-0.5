Template.placeProfileStaff.helpers({
	/**
	 * @summary Return if whether or not the current user is administrator of the place
	 * @return {Boolean}
	 */
	isAdmin: function() {
		if (this.place && Meteor.user() && this.place.administrators.indexOf(Meteor.user()._id) > -1)
			return true;
		else
			return false;
	},
	errorMessage: function(field) {
		if (Session.get('userProfileSkillsErrors'))
			return Session.get('userProfileSkillsErrors')[field];
	},
	errorClass: function (field) {
		if (Session.get('userProfileSkillsErrors'))
			return !!Session.get('userProfileSkillsErrors')[field] ? 'has-error' : '';
	},
});