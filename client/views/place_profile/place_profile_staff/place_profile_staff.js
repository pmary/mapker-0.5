Template.placeProfileStaff.helpers({
	/**
	 * @summary Return if whether or not the current user is administrator of the place
	 * @return {Boolean}
	 */
	isAdmin: function () {
		if (this.place && Meteor.user()) {
			var isAdmin = Places.findOne({_id: this.place._id, members: { $elemMatch: { id: Meteor.user()._id, admin: true } } });
			if (isAdmin) {
				return true;
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
	},
	current: function () {
		return Session.get('currentStaffUserSelected');
	},
	/**
	 * @summary Get the details of the staff members of the place
	 */
	staffMembers: function () {
		// Get all the members
		var place = Places.findOne({_id: Router.current().params._id, members: {$elemMatch: { staff: true }}}, {fields: {members: 1}});
		var members = place.members;
		// Filter the staff members
		var staffMembersIds = [];
		for (var i = 0; i < members.length; i++) {
			if (members[i].staff)
				staffMembersIds.push(members[i].id);
		}
		// Get the staff members data
		Meteor.subscribe('users', staffMembersIds);
		return Meteor.users.find({ _id: { $in: staffMembersIds } }).fetch();
	}
});

Template.placeProfileStaff.events({
	'click .user-action-open-modal-invite-staff': function () {
		// Open the modal
		Session.set('activeModal', 'modalPlaceInviteStaffMembers');
		$('#myModal').modal();
		Template.modalPlaceInviteStaffMembers.rendered();
	}
});

Template.placeProfileStaffAddMember.rendered = function () {
	// Clear the session var
	Session.set('currentStaffUserSelected', null);

	/**
	 * @summary AutoComplete init. for the users input field
	 * @see https://github.com/devbridge/jQuery-Autocomplete
	 * @see https://www.devbridge.com/sourcery/components/jquery-autocomplete/
	 */
	//this.autorun(function () {
		var currentQueryString;
		$('.place-profile-staff #input-who').autocomplete({
			position: "absolute",
			appendTo: $('.place-profile-staff #input-who-container'),
			lookup: function (queryString, done) {
				// Disable the add button until
				$('.place-profile-staff .user-action-add-staff-member').addClass('disabled');

				// No search if the query string lenght < 2 characters
				// Or if the input text hasn't change
				if (queryString.length < 2 || queryString === currentQueryString) return;
				currentQueryString = queryString;

				// Get the suggestions according to the queryString
				Meteor.call('getUsersByFullname', queryString, function (error, result) {
					// Display the error to the user and abort
					if (error) {
						throw error;
					}

					var formatedResult = {
						suggestions: $.map(result, function (dataItem) {
							return { value: dataItem._source.name, data: dataItem._id };
						})
					};

					done(formatedResult);
				});
			},
			// Called before displaying the suggestions. You may manipulate suggestions DOM before it is displayed.
			beforeRender: function (container) {
				console.log($(container)[0]);
				container[0].innerHTML = '<div><em>Hello</em></div>';
			},
			onSelect: function (suggestion) {
				//console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
				Session.set('currentStaffUserSelected', suggestion.data);
				$('.place-profile-staff .user-action-add-staff-member').removeClass('disabled');
			}
		});
	//});
};

Template.placeProfileStaffAddMember.events({
	'click .user-action-add-staff-member': function () {
	}
});
