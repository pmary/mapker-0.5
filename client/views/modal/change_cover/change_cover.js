var coverHelperContainer;

Template.modalChangeCover.rendered = function() {
}

Template.modalChangeCover.helpers({
	modalResource: function() {
		return Session.get('modalResource');
	},
	errorMessage: function(field) {
		return Session.get('modalChangeCoverErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('modalChangeCoverErrors')[field] ? 'has-error' : '';
	}
});

Template.modalChangeCover.events({
	'click .image-upload' : function(e, t){
		// Reset the input file by delete and re-create the node
		$(t.find('.modal-change-cover .modal-body #input-cover')).remove();
		$(t.find('.modal-change-cover .modal-body')).append('<input type="file" id="input-cover">');
		// Open the upload file browser
		$('#input-cover').click();
	},
	'click #cancel-modal-cover': function(e, t) {
		// Close the modal
		$('#myModal').modal('hide');
	},
	'change #input-cover': function(e, t) {
		// Once a file to upload is picked
		var file = e.target.files[0];
		// If our file is an image, display it in the cover
		if (file && file.size >= 2097152)
			return Session.set('modalChangeCoverErrors', {image: 'The weight of your image must be less than 2 MB'});
		if (file && !file.type.match('image.*') && file.type != "image/jpeg" && file.type != "image/png")
			return Session.set('modalChangeCoverErrors', {image: 'Only png and jpg images are authorized'});
		Session.set('modalChangeCoverErrors', {});

		if (file) {
			// Check for the various File API support.
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				var reader = new FileReader();
				reader.readAsDataURL(file);

				// Closure to capture the file information
				reader.onloadend = function(e) {
					// Destroyer the cropper instance if they was already one
					if ($('.modal-change-cover .helper-tool > img').hasClass('cropper-hidden'))
						$('.modal-change-cover .helper-tool > img').cropper('destroy');

					// Render image and create cropbox
					$('#cover-helper-tool-img').attr('src', e.target.result);

					// Init a cropper instance
					$('#cover-helper-tool-img').cropper({
						movable: false,
						strict: false, // When false, image can't be smaller than the cropbox
						minCropBoxWidth: 422,
						minCropBoxHeight: 93,
						guides: false,
						dragCrop: false,
						resizable: false,
						crop: function(data) {
							// Output the result data for cropping image.
						}
					});

					// Hide the upload btn and display the helper tool
					$('.modal-change-cover .image-upload-container').css('display', 'block');
					// Remove the first-upload UI
					if (t.find('#first-upload')) {t.find('#first-upload').style.display = 'none';};
					if (t.find('#change-image')) {t.find('#change-image').style.display = 'inline-block';};
				}
			}
		}
		else {

		}
	},
	'click #save-cover, click #update-cover': function(e, t) {
		var canvas = $('.helper-tool > img').cropper('getCroppedCanvas', { fillColor: "#ffffff" } );

		var resource = Session.get('modalResource');
		var file = document.getElementById('input-cover').files[0];

		if (file) {
			// It's a cover change
			var reader = new FileReader();
			reader.readAsDataURL(file);

			// Closure to capture the file information
			reader.onloadend = function(e) {
				// Set the uploaded file object
				var uploadedFile = {
					resource: Session.get('modalResource'), // Infos about the currently edited resource
					data: jic.compressFromCanvas(canvas, e.target.result, 100), // Compress the image
					type: file.type, // Ex.: "image/jpeg"
					role: "cover", // Can be cover or avatar
				}
				Meteor.call('uploadToS3', uploadedFile, function(error, imageUrl) {
					if (error) { console.log(error) }
					console.log(imageUrl);
					// If necessary, refresh the cover image
					$('.profile-cover').css('background-image', 'url(' + imageUrl + '?' + new Date().getTime() + ')');

					// Close the modal
					$('#myModal').modal('hide');

					// Destroyer the cropper instance
					$('.helper-tool > img').cropper('destroy');

					// Show the upload btn and hide the helper tool
					$('.modal-change-cover .image-upload-container').css('display', 'none');
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