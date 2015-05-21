var avatarHelperContainer;

Template.modalChangeAvatar.rendered = function() {
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
		// Reset the input file by delete and re-create the node
		$(t.find('.modal-change-avatar .modal-body #input-avatar')).remove();
		$(t.find('.modal-change-avatar .modal-body')).append('<input type="file" id="input-avatar">');
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
		if (file && file.size >= 2097152)
			return Session.set('modalChangeAvatarErrors', {image: 'The weight of your image must be less than 2 MB'});
		if (file && !file.type.match('image.*') && file.type != "image/jpeg" && file.type != "image/png")
			return Session.set('modalChangeAvatarErrors', {image: 'Only png and jpg images are authorized'});
		Session.set('modalChangeAvatarErrors', {});

		if (file) {
			// Check for the various File API support.
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				var reader = new FileReader();
				reader.readAsDataURL(file);

				// Closure to capture the file information
				reader.onloadend = function(e) {
					// Hide the crop zone for the time of the cropper init
					// to prevent a quick jump of the image
					$('.modal-change-avatar .image-upload-container').css('display', 'none');

					// Destroyer the cropper instance if they was already one
					if ($('.modal-change-avatar .helper-tool > img').hasClass('cropper-hidden'))
						$('.modal-change-avatar .helper-tool > img').cropper('destroy');

					// Render image and create cropbox
					$('#avatar-helper-tool-img').attr('src', e.target.result);

					// Init a cropper instance
					$('#avatar-helper-tool-img').cropper({
						aspectRatio: 1/1,
						movable: false,
						strict: true, // The image can be smaller than the cropbox
						minCropBoxWidth: 160,
						minCropBoxHeight: 160,
						guides: false,
						dragCrop: false,
						resizable: false,
						crop: function(data) {
							// Output the result data for cropping image.
						}
					});

					Meteor.setTimeout(function() {
						$('.modal-change-avatar .image-upload-container').css('display', 'block');
						$('.modal-change-avatar .image-upload-container .helper-tool, .modal-change-avatar .image-upload-container .cropper-controls').css('display', 'block');
					}, 200);

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
		var canvas = $('.helper-tool > img').cropper('getCroppedCanvas', { width: 160, height: 160, fillColor: "#ffffff" } );

		var resource = Session.get('modalResource');
		var file = document.getElementById('input-avatar').files[0];

		if (file) {
			// It's an avatar change
			var reader = new FileReader();
			reader.readAsDataURL(file);

			// Closure to capture the file information
			reader.onloadend = function(e) {
				// Set the uploaded file object
				var uploadedFile = {
					resource: Session.get('modalResource'), // Infos about the currently edited resource
					data: jic.compressFromCanvas(canvas, e.target.result, 100), // Compress the image
					type: file.type, // Ex.: "image/jpeg"
					role: "avatar" // Can be cover or avatar
				}
				Meteor.call('uploadToS3', uploadedFile, function(error, imageUrl) {
					if (error) { console.log(error) }
					console.log(imageUrl);
					// If necessary, refresh the avatar image to avoid persistend cache
					if (uploadedFile.resource.type == "user") {
						$('.profile-avatar-image').attr('src', imageUrl + '?' + new Date().getTime());
					} else {
						$('#profile-avatar-bg').css('background-image', 'url(' + imageUrl + '?' + new Date().getTime() + ')');
					};

					// Close the modal
					$('#myModal').modal('hide');

					// Destroyer the cropper instance
					$('.helper-tool > img').cropper('destroy');

					// Show the upload btn and hide the helper tool
					$('.modal-change-avatar .image-upload-container .helper-tool, .modal-change-avatar .image-upload-container .cropper-controls').css('display', 'none');
					// Remove the first-upload UI
					if (t.find('#first-upload')) {t.find('#first-upload').style.display = 'inline-block';};
					if (t.find('#change-image')) {t.find('#change-image').style.display = 'none';};
				});
			}
		};
	},
	'click .cropper-zoom-in': function(e, t){
		$('.helper-tool > img').cropper("zoom", 0.1);
	},
	'click .cropper-zoom-out': function(e, t){
		$('.helper-tool > img').cropper("zoom", -0.1);
	}
});