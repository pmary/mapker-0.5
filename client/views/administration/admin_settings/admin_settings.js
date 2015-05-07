Template.adminSettings.events({
	'click #resetEsIndex': function() {
		console.log('reset es index');
		Meteor.call('restoreIndex', function(error, result){
			console.log(error);
		});
	},
	'click #restoreDocuments': function() {
		console.log('restore documents in the index');
		Meteor.call('restoreDocuments', function(error, result){
			console.log(error);
			console.log('ok');
		});
	}
});