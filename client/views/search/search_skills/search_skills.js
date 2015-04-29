Template.searchSkills.helpers({
	/*searchTerms: function () {
		return Session.get('searchTerms');
	},
	locationsResults: function () {
		return Session.get("locationsResults");
	},*/
	users: function () {
		return Session.get("searchUsersResults");
	}
});

Template.searchSkills.rendered = function() {
	/*$searchWhat = $('#input-what').selectize({
		valueField: 'activity',
		labelField: 'activity',
		searchField: 'activity',
		sortField: 'activity',
		persist: true,
		maxItems: 1,
		create: false,
		highlight: false,
		addPrecedence: false,
		render: {
			option: function(item, escape) {
				return '<div>' +
					'<span class="title">' +
						'<span class="name">' + escape(item.activity) + '</span>' +
					'</span>' +
				'</div>';
			}
		},
		load: function(query, callback) {
			if (!query.length) return callback();
			
			Meteor.call('placesAutocompleteByActivities', query, function(error, result) {
				// Display the error to the user and abort
				if (error) return console.log(error.reason);
				//console.log(result)
				
				var myResult = [];
				for (var i = 0; i < result.length; i++) {
					myResult.push({activity: result[i].activities[0]});
				};
				callback(myResult);
			});
		},
		onItemAdd: function(value, $item) {},
		onItemRemove: function(value, $item) {
			$('#input-where').val("");
		},
		onType: function(str) {},
		onFocus: function() {},
		onBlur: function(){}
	});*/
}

Template.searchSkills.events({
	// Search nav
	'click #input-radio-place': function() {
		Router.go('searchPlaces');
	},
	'click #input-radio-skills': function() {
		Router.go('searchSkills');
	}
});