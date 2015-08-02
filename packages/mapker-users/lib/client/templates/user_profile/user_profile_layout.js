Template.UserProfileLayout.rendered = function(){
};

/**
 * @summary Set the 'modalResource' session variable with the data related to the current resource
 * @param {Object} [t] The current template instance object
 */
var setModalData = function(t) {
	//console.log(t);
	var resource = {
		id: t.data.user._id, // User id
		cover: t.data.user.profile.cover,
		avatar: t.data.user.profile.avatar,
		type: 'user'
	};
	Session.set('modalResource', resource);
};

Template.UserProfileLayout.events({
	/*****************************************************************************/
	/* Social bar */
	/*****************************************************************************/
	'click .user-actions-connect-button': function(e, t) {
		// Get the user id
		var resourceId = t.data.user._id;

		// Check if the user is loged in
		if (Meteor.user()) {
			// If the user is loged in, connect him to the given user
			Meteor.call('userSendConnexionRequest', resourceId, function(error, result) {
				if (error) {
					console.log(error);
				}
				console.log(result);
				//$('.user-actions-unfollow-button').html('Disconnect');
			});
		}
		else {
			// If the user isn't loged, open the modal to invite him to create an account or logged in
			Session.set('modalLoginRequiredErrors', {});
			// Open the login required modal
			Session.set('activeModal', "modalLoginRequired");
			$('#myModal').modal();
		}

		// Get the user id
		console.log(t.data.user._id);
	},
	/**
	 * @summary When the cancel connexion request btn is hover, change the style and message
	 */
	'mouseover .user-actions-cancel-connexion-request': function (e, t) {
		e.currentTarget.innerText = 'Cancel the connexion request';
		$(e.currentTarget).removeClass('btn-primary').addClass('btn-danger');
	},
	/**
	 * @summary When the cancel connexion request btn is mouseout, rollback to the default state
	 */
	'mouseout .user-actions-cancel-connexion-request': function (e, t) {
		e.currentTarget.innerText = 'Waiting for the response';
		$(e.currentTarget).removeClass('btn-danger').addClass('btn-primary');
	},
	/**
	 * @summary Cancel the connexion request
	 */
	'click .user-actions-cancel-connexion-request': function (e, t) {
		var userId = this.user._id;
		console.log('userId', userId);
		Meteor.call('userCancelConnexionRequest', userId, function (error, response) {
			if (error) return console.log(error);
			console.log(response);
		});
	},
	/**
	 * @summary Accept the user connexion request
	 */
	'click .user-action-accept-request': function (e, t) {
		Meteor.call('userAcceptConnexionRequest', t.data.user._id, function (error, result) {
			if (error) return console.log(error);
			console.log(result);
		});
	},
	'mouseover .user-actions-unconnect-button': function(e, t) {
		$('.user-actions-unconnect-button').html('Disconnect');
	},
	'mouseout .user-actions-unconnect-button': function(e, t) {
		$('.user-actions-unconnect-button').html('Connected');
	},
	'click .user-actions-unconnect-button': function(e, t) {
		// Get the user id
		var userId = t.data.user._id;

		Meteor.call('userUnConnect', userId, function(error, result) {
			if (error) {
				console.log(error);
			}
		});
	},
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
	}
});
