Template.UserProfileLayout.rendered = function(){
	//$('#identity-edit').popover();
};

var setModalData = function(t) {
	var resource = {
		id: t.data.user._id, // User id
		cover: t.data.user.profile.cover,
		logo: t.data.user.profile.avatar,
		type: 'user'
	}
	Session.set('modalResource', resource);
}

Template.UserProfileLayout.events({
	/**
	 * Inner navigation UI
	 */
	'click #inner-nav a' : function(e, t){
		$('#inner-nav li').removeClass('active');
		e.target.parentNode.className = 'active';
	},
	/**
	 * Avatar and cover update UI
	 */
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
	/**
	 * Identity edition UI
	 */
	'click #identity-edit' : function(e,t) {
		/**
		 * Render the identity edition template to the popover.
		 * Be sure to always call Blaze.remove when the View is no longer needed.
		 * Doc: http://docs.meteor.com/#/full/blaze_renderwithdata
		 */
		if (t.find('#user-infos .popover')) {
			Blaze.renderWithData(Template.userProfileIdentityEdition, t.data, t.find('#user-infos .popover-content'));
		} else {
			Session.set('userUpdateIdentityErrors', {}); // Clean the errors and prevent undefined session var
			$('#identity-edit').popover({html: true, content: " "});
			$('#identity-edit').popover('show');
			Blaze.renderWithData(Template.userProfileIdentityEdition, t.data, t.find('#user-infos .popover-content'));
		}
	},
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
			return; // Abort the account creation due to errors

		Meteor.call('userUpdateIdentity', identity, function(error, result) {
			// display the error to the user and abort
			if (error)
				console.log(error);

			// Destroy the view and the popover
			Blaze.remove(t.view);
			$('#identity-edit').popover('destroy');
	    });
	}
});