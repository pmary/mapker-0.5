var avatarHelperContainer;

Template.modalChangeAvatar.rendered = function() {
	$('.modal-change-avatar [data-toggle="popover"]').popover();

	avatarHelperContainer = $('#helper-tool-container').jQueryFocuspointHelpertool();
}

Template.modalChangeAvatar.helpers({
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
		// If our file is an image, display it in the avatar
		if (file.type.match('image.*')) {
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
					$('.modal-change-avatar .image-upload').css('display', 'none');
					$('.modal-change-avatar .image-upload-container .helper-tool').css('display', 'block');
				}
			}
		}
	},
	'click #save-avatar, click #update-avatar': function(e, t) {
		var file = document.getElementById('input-avatar').files[0];
		console.log(file);

		if (file) {
			// Its a avatar change
			userAvatarUploader.send(file, function (err, downloadUrl) {
				console.log(downloadUrl);
				if (downloadUrl && avatarHelperContainer) {
					// Save the new avatar in the database
					var imgFocusAttr = avatarHelperContainer.getFocusPointAttr();
					
					var avatar = {
						url: downloadUrl,
						name: Meteor.user()._id + "/avatar",
						focusX: imgFocusAttr.x,
						focusY: imgFocusAttr.y,
						w: imgFocusAttr.w,
						h: imgFocusAttr.h
					};

					Meteor.call('userInsertAvatar', avatar, function(error, result) {
						// display the error to the user and abort
						if (error) {
							return alert(error.reason);
						}

						// If necessary, refresh the avatar image
						$('.profile-avatar-image').attr('src', avatar.url + '? ' + new Date().getTime());

						// Close the modal
						$('#myModal').modal('hide');

						// Set the data to force the focus adjustement
						$('#profile-avatar-bg').data('focusY', avatar.focusY);
						$('#profile-avatar-bg').data('focusX', avatar.focusX);
						$('#profile-avatar-bg').data('imageW', avatar.w);
						$('#profile-avatar-bg').data('imageH', avatar.h);
						$('.focuspoint').focusPoint('adjustFocus');
				    });
				};
			});
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

		console.log(avatar);
	}
});