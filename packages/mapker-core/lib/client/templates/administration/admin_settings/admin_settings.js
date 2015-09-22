Template.adminSettings.events({
	'click #resetEsIndex': function () {
		console.log('reset es index');
		Meteor.call('mapker:search/restoreIndex', function (error){
			console.log(error);
		});
	},
	'click #restoreUsersDocuments': function () {
		console.log('restore documents in the index');
		Meteor.call('mapker:search/restoreUsersDocuments', function (error){
			console.log(error);
			console.log('ok');
		});
	},
	'click #restorePlacesDocuments': function () {
		console.log('restore documents in the index');
		Meteor.call('mapker:search/restorePlacesDocuments', function (error){
			console.log(error);
			console.log('ok');
		});
	}
});
