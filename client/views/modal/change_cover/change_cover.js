var coverHelperContainer;

Template.modalChangeCover.rendered = function() {
	$('.modal-change-cover [data-toggle="popover"]').popover();

	coverHelperContainer = $('#helper-tool-container').jQueryFocuspointHelpertool();
}

Template.modalChangeCover.helpers({
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
		if (file.type.match('image.*')) {
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
					$('.modal-change-cover .image-upload').css('display', 'none');
					$('.modal-change-cover .image-upload-container .helper-tool').css('display', 'block');
				}
			}
		}
	},
	'click #save-cover, click #update-cover': function(e, t) {
		var file = document.getElementById('input-cover').files[0];
		console.log(file);

		if (file) {
			// Its a cover change
			userCoverUploader.send(file, function (err, downloadUrl) {
				console.log(downloadUrl);
				if (downloadUrl && coverHelperContainer) {
					// Save the new cover in the database
					var imgFocusAttr = coverHelperContainer.getFocusPointAttr();
					
					var cover = {
						url: downloadUrl,
						name: Meteor.user()._id + "/cover",
						focusX: imgFocusAttr.x,
						focusY: imgFocusAttr.y,
						w: imgFocusAttr.w,
						h: imgFocusAttr.h
					};

					Meteor.call('userInsertCover', cover, function(error, result) {
						// display the error to the user and abort
						if (error) {
							return alert(error.reason);
						}

						// If necessary, refresh the cover image
						$('.profile-cover-image').attr('src', cover.url + '? ' + new Date().getTime());

						// Close the modal
						$('#myModal').modal('hide');

						// Set the data to force the focus adjustement
						$('#profile-cover-bg').data('focusY', cover.focusY);
						$('#profile-cover-bg').data('focusX', cover.focusX);
						$('#profile-cover-bg').data('imageW', cover.w);
						$('#profile-cover-bg').data('imageH', cover.h);
						$('.focuspoint').focusPoint('adjustFocus');
				    });
				};
			});
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

		console.log(cover);
	}
});