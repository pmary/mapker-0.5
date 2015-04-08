Template.UserProfileLayout.helpers({
	errorMessage: function(field) {
		return Session.get('userUpdateIdentityErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('userUpdateIdentityErrors')[field] ? 'has-error' : '';
	}
});

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
		console.log("edit identity");
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
		console.log(errors);
		Session.set('userUpdateIdentityErrors', errors);
		if (Object.keys(errors).length)
			return; // Abort the account creation due to errors
	},
	'click #close-identity-edit-popover' : function(e,t) {
		$('#identity-edit').popover('hide');
	}
});