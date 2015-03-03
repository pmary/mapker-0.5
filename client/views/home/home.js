Template.Home.rendered = function(){
	//var bucket = new AWS.S3({params: {Bucket: 'la-paillasse'}});
	console.log($('body'));
	jQueryFocuspointHelpertool();
}

Template.Home.events({
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