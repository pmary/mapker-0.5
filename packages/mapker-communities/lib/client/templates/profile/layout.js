Template.communityProfileLayout.helpers({
	/**
	 * @summary Return if whether or not the current user is administrator of the place
	 * @return {Boolean}
	 */
	isAdmin: function () {
		if (this.community && Meteor.user()) {
			var isAdmin = Communities.findOne({
				_id: this.community._id,
				members: { $elemMatch: { id: Meteor.user()._id, admin: true } }
			});
			if (isAdmin) {
				return true;
			}
			else {
				return false;
			}
		}
	}
});

/**
 * @summary Set the 'modalResource' session variable with the data related to the current resource
 * @param {Object} [t] The current template instance object
 */
var setModalData = function(t) {
	var resource = {
		id: t.data.community._id,
		cover: t.data.community.cover,
		avatar: t.data.community.avatar,
		type: 'community'
	};
	Session.set('modalResource', resource);
};

Template.communityProfileLayout.events({
	/*****************************************************************************/
	/* Inner navigation UI */
	/*****************************************************************************/
	/**
	 * @summary Add the 'active' class name to the selected nav item and remove it from others
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click #inner-nav a' : function (e) {
		$('#inner-nav li').removeClass('active');
		e.target.parentNode.className = 'active';
	},
	/*****************************************************************************/
	/* Avatar and cover update UI */
	/*****************************************************************************/
	/**
	 * @summary Open the upload modal and give it the needed data
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click .upload-cover-btn' : function(e, t){
		// Open the cover change modal
		Session.set('modalChangeCoverErrors', {});
		Session.set('activeModal', 'modalChangeCover');
		// Pass the mandatory data to the modal instance via a session variable
		setModalData(t);

		// Display the upload btn and hide the helper tool
		$('.modal-change-cover .image-upload-container .helper-tool').css('display', 'none');
	},
	/**
	 * @summary Open the upload modal and give it the needed data
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click #upload-avatar-btn': function(e, t) { console.log(t);
		// Open the cover change modal
		Session.set('modalChangeAvatarErrors', {});
		Session.set('activeModal', 'modalChangeAvatar');
		// Pass the mandatory data to the modal instance via a session variable
		setModalData(t);
	},
	/*****************************************************************************/
	/* Social bar UI */
	/*****************************************************************************/
	/**
	 * @summary Open the modal that allow the user to send a message to the place owner
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click .user-action-message': function (e, t) {
		// Check if the user is loged in
		if (Meteor.user()) {
			// Set the session var with the current resource data
			Session.set('modalMessage', t.data);

			// Open the add message modal
			Session.set('activeModal', 'modalSendMessage');
			$('#myModal').modal();
		}
		else {
			// Open the 'login required' modal
			Modal.show('modalLoginRequired');
		}
	}
});
