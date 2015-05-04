Template.adminSettings.events({
	'click #resetEsIndex': function() {
		Meteor.call('resetElasticSearch', function(error, result){
			console.log(error);
			console.log('ok');
		});
	}
});