Template.UserProfileLayout.rendered = function(){
	//$('#identity-edit').popover();
};

/**
 * @summary Set the 'modalResource' session variable with the data related to the current resource
 * @locus Client
 * @param {Object} [t] The current template instance object
 */
var setModalData = function(t) {
	console.log(t);
	var resource = {
		id: t.data.user._id, // User id
		cover: t.data.user.profile.cover,
		logo: t.data.user.profile.avatar,
		type: 'user'
	}
	Session.set('modalResource', resource);
}

Template.UserProfileLayout.events({
	/*****************************************************************************/
	/* Inner navigation UI */
	/*****************************************************************************/
	'click #inner-nav a' : function(e, t){
		$('#inner-nav li').removeClass('active');
		e.target.parentNode.className = 'active';
	},
	/*****************************************************************************/
	/* Avatar and cover update UI */
	/*****************************************************************************/
	'click .upload-cover-btn' : function(e, t){
		// Open the cover change modal
		Session.set('modalChangeCoverErrors', {});
		Session.set('activeModal', 'modalChangeCover');
		setModalData(t);

		// Display the upload btn and hide the helper tool
		$('.modal-change-cover .image-upload-container .helper-tool').css('display', 'none');
	},
	'click #upload-avatar-btn': function(e, t) {
		// Open the cover change modal
		Session.set('modalChangeAvatarErrors', {});
		Session.set('activeModal', 'modalChangeAvatar');
		setModalData(t);

		// Init focuspoint
		$('#helper-tool-container').jQueryFocuspointHelpertool();
	},
	/*****************************************************************************/
	/* Identity edition UI */
	/*****************************************************************************/
	'click #identity-edit' : function(e,t) {		
		if (t.find('#user-infos-identity .popover')) {
			// Render the identity edition template to the popover.
			// Be sure to always call Blaze.remove when the View is no longer needed.
			// Doc: http://docs.meteor.com/#/full/blaze_renderwithdata
			Blaze.renderWithData(Template.userProfileIdentityEdition, t.data, t.find('#user-infos-identity .popover-content'));
		} else {
			// Clean the errors and prevent undefined session var
			Session.set('userUpdateIdentityErrors', {});
			// Init the popover with empty content
			$('#identity-edit').popover({html: true, content: " "});
			// Show the popover
			$('#identity-edit').popover('show');
			// Render the userProfileIdentityEdition template in the popover with the current template data
			Blaze.renderWithData(Template.userProfileIdentityEdition, t.data, t.find('#user-infos-identity .popover-content'));
		}
	},
	/*****************************************************************************/
	/* Social profiles UI */
	/*****************************************************************************/
	'click #add-social-profiles, click #edit-social-profiles' : function(e,t) {
		if (t.find('#user-infos-social-profiles .popover')) {
			// Render the social profiles edition template to the popover.
			// Be sure to always call Blaze.remove when the View is no longer needed.
			// Doc: http://docs.meteor.com/#/full/blaze_renderwithdata
			Blaze.renderWithData(Template.userUpdateSocialProfiles, t.data, t.find('#user-infos-social-profiles .popover-content'));
		} else {
			// Clean the errors and prevent undefined session var
			Session.set('userUpdateSocialProfilesErrors', {});
			// Init the popover with empty content
			$('#social-profiles').popover({html: true, content: " "});
			// Show the popover
			$('#social-profiles').popover('show');
			// Render the userUpdateSocialProfiles template in the popover with the current template data
			Blaze.renderWithData(Template.userUpdateSocialProfiles, t.data, t.find('#user-infos-social-profiles .popover-content'));
		}
	}
});

Template.userProfileIdentityEdition.helpers({
	errorMessage: function(field) {
		return Session.get('userUpdateIdentityErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('userUpdateIdentityErrors')[field] ? 'has-error' : '';
	}
});

Template.userProfileIdentityEdition.events({
	'click #close-identity-edit-popover': function (e, t) {
		// Destroy the view and the popover
		Blaze.remove(t.view);
		$('#identity-edit').popover('destroy');
	},
	'submit #identity-form' : function(e,t) {
		e.preventDefault();
		var identity = {
			firstname: t.find('#edit-first-name').value,
			lastname: t.find('#edit-last-name').value,
			activity: t.find('#edit-activity').value,
			countryCode: t.find('#edit-select-country').value,
			zipcode: t.find('#edit-zipcode').value
		};

		var errors = validateUserIdentity(identity);
		Session.set('userUpdateIdentityErrors', errors);
		if (Object.keys(errors).length)
			// Abort the account creation due to errors
			return; 

		Meteor.call('userUpdateIdentity', identity, function(error, result) {
			// Display the error to the user and abort
			if (error)
				console.log(error);

			// Destroy the view and the popover
			Blaze.remove(t.view);
			$('#identity-edit').popover('destroy');
		});
	}
});

Template.userUpdateSocialProfiles.helpers({
	errorMessage: function(field) {
		return Session.get('userUpdateSocialProfilesErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('userUpdateSocialProfilesErrors')[field] ? 'has-error' : '';
	}
});

Template.userUpdateSocialProfiles.events({
	'click #close-social-profiles-popover': function (e, t) {
		// Destroy the view and the popover
		Blaze.remove(t.view);
		$('#social-profiles').popover('destroy');
	},
	'submit #social-profiles-form' : function(e,t) {
		e.preventDefault();
		var socialProfiles = {
			facebook: t.find('#edit-facebook').value,
			flickr: t.find('#edit-flickr').value,
			twitter: t.find('#edit-twitter').value,
			website: t.find('#edit-website').value
		};

		var errors = validateUsersocialProfiles(socialProfiles);
		Session.set('userUpdateSocialProfilesErrors', errors);
		if (Object.keys(errors).length)
			// Abort the account creation due to errors
			return; 

		Meteor.call('userUpdateSocialProfiles', socialProfiles, function(error, result) {
			// Display the error to the user and abort
			if (error)
				console.log(error);

			// Destroy the view and the popover
			Blaze.remove(t.view);
			$('#social-profiles').popover('destroy');
		});
	}
});