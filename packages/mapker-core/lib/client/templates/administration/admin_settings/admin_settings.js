Template.adminSettings.events({
	'click #resetEsIndex': function () {
		console.log('Reset the resources index');
		Meteor.call('mapker:search/resetIndexAndMaping', function (error){
			console.log(error);
		});
	},
	'click #restoreDocuments': function () {
		console.log('Restore the documents');
		Meteor.call('mapker:search/restoreIndexDocuments', function (error){
			console.log(error);
		});
	}
});
