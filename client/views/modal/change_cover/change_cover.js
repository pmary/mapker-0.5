var coverHelperContainer;

Template.modalChangeCover.rendered = function() {
	$('.modal-change-cover [data-toggle="popover"]').popover();

	coverHelperContainer = $('#helper-tool-container').jQueryFocuspointHelpertool();
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
		if (file.size >= 2097152)
			return Session.set('modalChangeCoverErrors', {image: 'The weight of your image must be less than 2 MB'});
		if (!file.type.match('image.*') && file.type != "image/jpeg" && file.type != "image/png")
			return Session.set('modalChangeCoverErrors', {image: 'Only png and jpg images are authorized'});
		Session.set('modalChangeCoverErrors', {});

		if (file) {
			// Check for the various File API support.
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				var reader = new FileReader();
				reader.readAsDataURL(file);

				// Closure to capture the file information
				reader.onloadend = function(e) {
					// Render image and create cropbox
					$('#cover-helper-tool-img, #cover-target-overlay').attr('src', e.target.result);
					// Init jQueryFocuspoint
					coverHelperContainer = $('#helper-tool-container').jQueryFocuspointHelpertool();
					// Hide the upload btn and display the helper tool
					$('.modal-change-cover .image-upload-container .helper-tool').css('display', 'block');
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
		var resource = Session.get('modalResource');
		var file = document.getElementById('input-cover').files[0];
		var imgFocusAttr = coverHelperContainer.getFocusPointAttr();

		if (file) {
			// It's a cover change
			var reader = new FileReader();
			reader.readAsDataURL(file);

			// Closure to capture the file information
			reader.onloadend = function(e) {
				// Set the uploaded file object
				var uploadedFile = {
					resource: Session.get('modalResource'), // Infos about the currently edited resource
					data: jic.compress(e.target.result, 60), // Compress the image
					type: file.type, // Ex.: "image/jpeg"
					role: "cover", // Can be cover or avatar
					focusX: imgFocusAttr.x,
					focusY: imgFocusAttr.y,
					w: imgFocusAttr.w,
					h: imgFocusAttr.h
				}
				Meteor.call('uploadToS3', uploadedFile, function(error, imageUrl) {
					if (error) { console.log(error) }
					// If necessary, refresh the cover image
					$('.profile-cover-image').attr('src', imageUrl + '? ' + new Date().getTime());

					// Close the modal
					$('#myModal').modal('hide');

					// Set the data to force the focus adjustement
					$('#profile-cover-bg').data('focusY', uploadedFile.focusY);
					$('#profile-cover-bg').data('focusX', uploadedFile.focusX);
					$('#profile-cover-bg').data('imageW', uploadedFile.w);
					$('#profile-cover-bg').data('imageH', uploadedFile.h);
					$('#profile-cover-bg').focusPoint();
				});
			}
		} else {
			// Its just an update
			var imgFocusAttr = coverHelperContainer.getFocusPointAttr();
					
			var cover = {
				focusX: imgFocusAttr.x,
				focusY: imgFocusAttr.y
			};

			Meteor.call('userUpdateCover', cover, function(error, result) {
				if (error)
					return alert(error.reason);

				// Close the modal
				$('#myModal').modal('hide');

				// Set the data to force the focus adjustement
				$('#profile-cover-bg').data('focusY', cover.focusY);
				$('#profile-cover-bg').data('focusX', cover.focusX);
				$('#profile-cover-bg').focusPoint();
			});
		};
	},
	'click #update-cover': function(e, t) {
		var imgFocusAttr = coverHelperContainer.getFocusPointAttr();

		var cover = {
			focusX: imgFocusAttr.x,
			focusY: imgFocusAttr.y,
			w: imgFocusAttr.w,
			h: imgFocusAttr.h
		};
	}
});