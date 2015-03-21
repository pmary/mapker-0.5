Template.Home.rendered = function(){
	if (Accounts._resetPasswordToken) {
		console.log('has reset token');
		Router.go('reset-password.token', {resetToken: Accounts._resetPasswordToken});
	}

	//var bucket = new AWS.S3({params: {Bucket: 'la-paillasse'}});
	//$().jQueryFocuspointHelpertool();
}

Template.Home.events({
	'click #modal-add-place' : function(e, t){
		// Reset the static map url and the form errors
		Session.set('staticMapUrl', "");
		Session.set('modalAddPlaceErrors', {});
		
		//console.log("Open modal " + t.$(event.target).data('modal-template'));
		// Open the add place modal
		var name = t.$(event.target).data('modal-template');
		Session.set('activeModal', name);
	},
	'click #upload-button' : function(e, t){
		e.preventDefault();

		var fileChooser = t.find('#file-chooser'),
		results = t.find('#results');

		var file = fileChooser.files[0];
		if (file) {
			results.innerHTML = '';

			//var params = {Key: file.name, ContentType: file.type, Body: file};
			
			uploader.send(file, function (err, downloadUrl) {
				console.log(downloadUrl);
				//Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
			});
		} else {
			results.innerHTML = 'Nothing to upload.';
		}
	}
});