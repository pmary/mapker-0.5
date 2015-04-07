var avatarHelperContainer;

Template.modalChangeAvatar.onRendered = function() {
	$('.modal-change-avatar [data-toggle="popover"]').popover();

	avatarHelperContainer = $('#helper-tool-container').jQueryFocuspointHelpertool();
}

Template.modalChangeAvatar.helpers({
	modalResource: function() {
		return Session.get('modalResource');
	},
	errorMessage: function(field) {
		return Session.get('modalChangeAvatarErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('modalChangeAvatarErrors')[field] ? 'has-error' : '';
	}
});

Template.modalChangeAvatar.events({
	'click .image-upload' : function(e, t){
		// Open the upload file browser
		$('#input-avatar').click();
	},
	'click #cancel-modal-avatar': function(e, t) {
		// Close the modal
		$('#myModal').modal('hide');
	},
	'change #input-avatar': function(e, t) {
		// Once a file to upload is picked
		var file = e.target.files[0];
		// If our file is an image, display it in the cover
		if (file.size >= 2097152)
			return Session.set('modalChangeAvatarErrors', {image: 'The weight of your image must be less than 2 MB'});
		if (!file.type.match('image.*') && file.type != "image/jpeg" && file.type != "image/png")
			return Session.set('modalChangeAvatarErrors', {image: 'Only png and jpg images are authorized'});
		Session.set('modalChangeAvatarErrors', {});

		if (file) {
			// Check for the various File API support.
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				var reader = new FileReader();
				reader.readAsDataURL(file);

				// Closure to capture the file information
				reader.onloadend = function(e) {
					// Render image and create cropbox
					$('#avatar-helper-tool-img, #avatar-target-overlay').attr('src', e.target.result);
					// Init jQueryFocuspoint
					avatarHelperContainer = $('#helper-tool-container').jQueryFocuspointHelpertool();
					// Hide the upload btn and display the helper tool
					$('.modal-change-avatar .image-upload-container .helper-tool').css('display', 'block');
					// Remove the first-upload UI
					if (t.find('#first-upload')) {t.find('#first-upload').style.display = 'none';};
					if (t.find('#change-image')) {t.find('#change-image').style.display = 'inline-block';};
				}
			}
		}
		else {

		}
	},
	'click #save-avatar, click #update-avatar': function(e, t) {
		var resource = Session.get('modalResource');
		var file = document.getElementById('input-avatar').files[0];
		var imgFocusAttr = avatarHelperContainer.getFocusPointAttr();

		if (file) {
			// It's an avatar change
			var reader = new FileReader();
			reader.readAsDataURL(file);

			// Closure to capture the file information
			reader.onloadend = function(e) {
				// Set the uploaded file object
				var uploadedFile = {
					resource: Session.get('modalResource'), // Infos about the currently edited resource
					data: jic.compress(e.target.result, 60), // Compress the image
					type: file.type, // Ex.: "image/jpeg"
					role: "avatar", // Can be cover or avatar
					focusX: imgFocusAttr.x,
					focusY: imgFocusAttr.y,
					w: imgFocusAttr.w,
					h: imgFocusAttr.h
				}
				Meteor.call('uploadToS3', uploadedFile, function(error, imageUrl) {
					if (error) { console.log(error) }
					// If necessary, refresh the avatar image
					$('.profile-avatar-image').attr('src', imageUrl + '? ' + new Date().getTime());

					// Close the modal
					$('#myModal').modal('hide');

					// Set the data to force the focus adjustement
					$('#profile-avatar-bg').data('focusY', uploadedFile.focusY);
					$('#profile-avatar-bg').data('focusX', uploadedFile.focusX);
					$('#profile-avatar-bg').data('imageW', uploadedFile.w);
					$('#profile-avatar-bg').data('imageH', uploadedFile.h);
					$('#profile-avatar-bg').focusPoint();
				});
			}
		} else {
			// Its just an update
			var imgFocusAttr = avatarHelperContainer.getFocusPointAttr();
					
			var avatar = {
				focusX: imgFocusAttr.x,
				focusY: imgFocusAttr.y
			};

			Meteor.call('userUpdateAvatar', avatar, function(error, result) {
				if (error)
					return alert(error.reason);

				// Close the modal
				$('#myModal').modal('hide');

				// Set the data to force the focus adjustement
				$('#profile-avatar-bg').data('focusY', avatar.focusY);
				$('#profile-avatar-bg').data('focusX', avatar.focusX);
				$('#profile-avatar-bg').focusPoint();
			});
		};
	},
	'click #update-avatar': function(e, t) {
		var imgFocusAttr = avatarHelperContainer.getFocusPointAttr();

		var avatar = {
			focusX: imgFocusAttr.x,
			focusY: imgFocusAttr.y,
			w: imgFocusAttr.w,
			h: imgFocusAttr.h
		};
	}
});