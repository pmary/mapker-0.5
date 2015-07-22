Template.adminSettings.events({
	'click #resetEsIndex': function () {
		console.log('reset es index');
		Meteor.call('restoreIndex', function (error){
			console.log(error);
		});
	},
	'click #restoreUsersDocuments': function () {
		console.log('restore documents in the index');
		Meteor.call('restoreUsersDocuments', function (error){
			console.log(error);
			console.log('ok');
		});
	},
	'click #restorePlacesDocuments': function () {
		console.log('restore documents in the index');
		Meteor.call('restorePlacesDocuments', function (error){
			console.log(error);
			console.log('ok');
		});
	}
});
